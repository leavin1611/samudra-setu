'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { HeartHandshake } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useNeeds } from '@/context/NeedsContext';

const needsSchema = z.object({
  needType: z.string().min(1, 'Need type is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  isUrgent: z.boolean().default(false),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm this is a genuine request' }),
  }),
});

export function NeedsForm() {
    const { toast } = useToast();
    const { addNeed } = useNeeds();

    const form = useForm<z.infer<typeof needsSchema>>({
        resolver: zodResolver(needsSchema),
        defaultValues: {
            consent: false,
            needType: '',
            location: '',
            description: '',
            isUrgent: false,
        },
    });

    function onSubmit(values: z.infer<typeof needsSchema>) {
        const newNeed = {
            id: `need_${Date.now()}`,
            user: "Anonymous",
            timeAgo: "Just now",
            needType: values.needType,
            location: values.location,
            description: values.description,
            isUrgent: values.isUrgent,
            status: 'Open' as 'Open' | 'In-Progress' | 'Fulfilled',
        };
        addNeed(newNeed);
        
        toast({
            title: "Need Request Submitted!",
            description: "Your request has been broadcast to volunteers and disaster managers.",
        });

        form.reset();
    }

  return (
    <div className="py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold relative inline-block">
          Request Assistance
          <span className="block w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></span>
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          If you are affected by a hazard, list your needs here for volunteers and officials.
        </p>
      </div>
      <Card className="w-full max-w-2xl mx-auto shadow-2xl">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="needType" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type of Need</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select primary need" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="water">Drinking Water</SelectItem>
                                    <SelectItem value="food">Food & Rations</SelectItem>
                                    <SelectItem value="shelter">Temporary Shelter</SelectItem>
                                    <SelectItem value="medical">Medical Assistance</SelectItem>
                                    <SelectItem value="rescue">Rescue/Evacuation</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Location</FormLabel>
                            <FormControl><Input placeholder="e.g., Near Marina Beach Lighthouse" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Detailed Description</FormLabel>
                        <FormControl><Textarea rows={4} placeholder="Describe your situation and need. e.g., 'Family of 4 stranded on rooftop, need immediate evacuation and water.'" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="flex justify-between items-center">
                    <FormField control={form.control} name="isUrgent" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="font-normal">Mark as Urgent</FormLabel>
                        </FormItem>
                    )} />
                </div>
                

                <FormField control={form.control} name="consent" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>I confirm this is a genuine request for assistance.</FormLabel>
                            <FormMessage />
                        </div>
                    </FormItem>
                )} />
              
              <Button type="submit" className="w-full">
                <HeartHandshake className="mr-2 h-4 w-4" />
                Submit Request
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
