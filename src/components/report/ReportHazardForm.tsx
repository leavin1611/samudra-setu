
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Bot, Sparkles, Camera, Video, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useHazardReports } from '@/context/HazardReportsContext';
import { analyzeReportImage } from '@/ai/flows/analyze-report-image';
import { useState, useRef, useEffect }d from 'react';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import EXIF from 'exif-js';
import { format } from 'date-fns';


const reportSchema = z.object({
  hazardType: z.string().min(1, 'Hazard type is required'),
  severity: z.string().min(1, 'Severity level is required'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm your observation' }),
  }),
});

export function ReportHazardForm() {
    const { toast } = useToast();
    const { addReport } = useHazardReports();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [activeTab, setActiveTab] = useState('upload');
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        if (activeTab === 'webcam') {
            const getCameraAndLocationPermission = async () => {
                // Get Camera Permission
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setHasCameraPermission(true);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (error) {
                    console.error('Error accessing camera:', error);
                    setHasCameraPermission(false);
                    toast({
                        variant: 'destructive',
                        title: 'Camera Access Denied',
                        description: 'Please enable camera permissions to use this feature.',
                    });
                }

                // Get Location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            form.setValue('location', `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                            toast({
                                title: "Location Captured",
                                description: "Your current location has been filled in.",
                            });
                        },
                        () => {
                            toast({
                                variant: 'destructive',
                                title: 'Location Access Denied',
                                description: 'Could not fetch location. Please enter it manually.',
                            });
                        }
                    );
                }
            };
            getCameraAndLocationPermission();

            return () => {
                // Stop camera stream when component unmounts or tab changes
                if(videoRef.current && videoRef.current.srcObject) {
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        }
    }, [activeTab]);


    const form = useForm<z.infer<typeof reportSchema>>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            consent: false,
            hazardType: '',
            severity: '',
            location: '',
            date: '',
            time: '',
            description: ''
        },
    });

    const processImageWithAI = async (photoDataUri: string) => {
        setIsAnalyzing(true);
        setUploadedImage(photoDataUri);

        try {
            const result = await analyzeReportImage({ photoDataUri });
            form.setValue('hazardType', result.hazardType);
            form.setValue('severity', result.severity);
            form.setValue('description', result.description);
            toast({
                title: "🤖 AI Analysis Complete",
                description: "The form has been pre-filled based on your image.",
            });
        } catch (error) {
            console.error("Image analysis failed:", error);
            toast({
                variant: "destructive",
                title: "AI Analysis Failed",
                description: "Could not analyze the image. Please fill out the form manually.",
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        EXIF.getData(file as any, function(this: any) {
            const lat = EXIF.getTag(this, "GPSLatitude");
            const lon = EXIF.getTag(this, "GPSLongitude");

            if (!lat || !lon) {
                toast({
                    variant: "destructive",
                    title: "Geo-tag Required",
                    description: "Uploaded photos must contain geo-tag (GPS) information. Please upload a different photo.",
                });
                return;
            }

            const latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
            const lonRef = EXIF.getTag(this, "GPSLongitudeRef") || "E";
            
            const latDec = (lat[0] + lat[1] / 60 + lat[2] / 3600) * (latRef === "S" ? -1 : 1);
            const lonDec = (lon[0] + lon[1] / 60 + lon[2] / 3600) * (lonRef === "W" ? -1 : 1);
            
            form.setValue('location', `${latDec.toFixed(5)}, ${lonDec.toFixed(5)}`);

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                processImageWithAI(reader.result as string);
            };
        });
    };

    const handleTakePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        // Get the image data from the canvas
        const photoDataUri = canvas.toDataURL('image/jpeg');

        // Set current date and time
        const now = new Date();
        form.setValue('date', format(now, 'yyyy-MM-dd'));
        form.setValue('time', format(now, 'HH:mm'));

        processImageWithAI(photoDataUri);
    }

    function onSubmit(values: z.infer<typeof reportSchema>) {
        const isVerified = Math.random() > 0.5;

        const newReport = {
            id: Date.now(),
            title: `${values.hazardType.charAt(0).toUpperCase() + values.hazardType.slice(1)} in ${values.location}`,
            user: "Anonymous",
            timeAgo: "Just now",
            description: values.description,
            tags: [values.hazardType, values.location],
            verified: isVerified,
            type: values.hazardType as any,
            severity: values.severity as any,
            location: values.location,
            date: new Date(`${values.date}T${values.time}`).toISOString(),
            imageUrl: uploadedImage || "https://picsum.photos/seed/" + Date.now() + "/400/200",
            imageHint: `${values.hazardType} ${values.location}`,
            lat: 11.23 + (Math.random() - 0.5) * 5,
            lng: 78.34 + (Math.random() - 0.5) * 5,
        };
        addReport(newReport);
        
        toast({
            title: "Report Submitted!",
            description: "Thank you for contributing to community safety.",
        });

        if (isVerified) {
             setTimeout(() => {
                toast({
                    title: "🔔 New Verified Hazard Alert!",
                    description: `A new ${newReport.severity} risk ${values.hazardType} has been verified in ${values.location}.`,
                });
            }, 1000);
        }

        form.reset();
        setUploadedImage(null);
    }

  return (
    <div className="py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold relative inline-block">
          Report a Hazard
          <span className="block w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></span>
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Help keep coastal communities safe by reporting ocean hazards
        </p>
      </div>
      <Card className="w-full max-w-3xl mx-auto shadow-2xl">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label>Upload Media & Analyze with AI</Label>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4"/> Upload Image</TabsTrigger>
                        <TabsTrigger value="webcam"><Camera className="mr-2 h-4 w-4" /> Use Webcam</TabsTrigger>
                      </TabsList>
                      <TabsContent value="upload">
                         <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10 relative">
                            {uploadedImage && !isAnalyzing && (
                                <Image src={uploadedImage} alt="Uploaded hazard" layout="fill" className="object-contain rounded-lg" />
                            )}
                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center rounded-lg">
                                    <Bot className="h-12 w-12 text-primary animate-bounce" />
                                    <p className="mt-4 text-sm font-semibold text-primary">AI is analyzing your image...</p>
                                </div>
                            )}
                             <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                                    <Label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                                    >
                                    <span>Click to upload a geo-tagged image</span>
                                    <Input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/jpeg,image/png" />
                                    </Label>
                                </div>
                                <p className="text-xs leading-5 text-muted-foreground">The AI will pre-fill the form for you.</p>
                                </div>
                          </div>
                      </TabsContent>
                      <TabsContent value="webcam">
                        <div className="mt-2 rounded-lg border border-input p-2 space-y-4">
                            <div className="relative aspect-video">
                                <video ref={videoRef} className="w-full h-full rounded-md bg-muted" autoPlay muted playsInline />
                                {hasCameraPermission === false && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
                                        <Alert variant="destructive" className="w-auto">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Camera Access Denied</AlertTitle>
                                            <AlertDescription>Enable camera permissions to use this feature.</AlertDescription>
                                        </Alert>
                                    </div>
                                )}
                            </div>
                            <Button type="button" onClick={handleTakePhoto} disabled={!hasCameraPermission || isAnalyzing} className="w-full">
                                <Video className="mr-2 h-4 w-4" />
                                Capture Photo & Analyze
                            </Button>
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                      </TabsContent>
                    </Tabs>
                </div>
                
                {isAnalyzing ? (
                    <div className="space-y-6 pt-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                ) : (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="hazardType" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hazard Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select hazard type" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="tsunami">Tsunami</SelectItem>
                                    <SelectItem value="storm">Storm Surge</SelectItem>
                                    <SelectItem value="waves">High Waves</SelectItem>
                                    <SelectItem value="currents">Dangerous Currents</SelectItem>
                                    <SelectItem value="flooding">Coastal Flooding</SelectItem>
                                    <SelectItem value="erosion">Beach Erosion</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="severity" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Severity Level</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select severity level" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="low">Low - Minor issue</SelectItem>
                                    <SelectItem value="medium">Medium - Concerning</SelectItem>
                                    <SelectItem value="high">High - Dangerous</SelectItem>
                                    <SelectItem value="extreme">Extreme - Emergency</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">
                           Description <Sparkles className="h-4 w-4 text-yellow-500" />
                           <span className="text-xs text-muted-foreground">(auto-filled by AI)</span>
                        </FormLabel>
                        <FormControl><Textarea rows={4} placeholder="Describe the hazard in detail" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl><Input placeholder="Enter the location of the hazard" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="date" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="time" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl><Input type="time" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="consent" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>I confirm that this report is based on my direct observation.</FormLabel>
                            <FormMessage />
                        </div>
                    </FormItem>
                )} />
              
              <Button type="submit" className="w-full">Submit Report</Button>
              </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    