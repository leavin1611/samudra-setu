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
import { Upload, BellRing } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useHazardReports } from '@/context/HazardReportsContext';

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

    function onSubmit(values: z.infer<typeof reportSchema>) {
        // Simulate a chance of the report being instantly verified
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
            imageUrl: "https://picsum.photos/seed/" + Date.now() + "/400/200",
            imageHint: `${values.hazardType} ${values.location}`,
            lat: 11.23 + (Math.random() - 0.5) * 5, // Placeholder lat with randomness
            lng: 78.34 + (Math.random() - 0.5) * 5, // placeholder lng with randomness
        };
        addReport(newReport);
        
        toast({
            title: "Report Submitted!",
            description: "Thank you for contributing to community safety.",
        });

        if (isVerified) {
             setTimeout(() => {
                toast({
                    variant: "default",
                    title: "🔔 New Verified Hazard Alert!",
                    description: `A new ${newReport.severity} risk ${values.hazardType} has been verified in ${values.location}.`,
                });
            }, 1000);
        }

        form.reset();
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="hazardType" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hazard Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea rows={4} placeholder="Describe the hazard in detail" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
              
                <div>
                  <Label>Upload Media (Optional)</Label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                        <Label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                        >
                          <span>Click to upload</span>
                          <Input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </Label>
                        <p className="pl-1">photos or videos</p>
                      </div>
                      <p className="text-xs leading-5 text-muted-foreground">Max file size: 10MB</p>
                    </div>
                  </div>
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
