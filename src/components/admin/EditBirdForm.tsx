'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { updateBird } from '@/lib/admin-actions';
import { birdSchema } from '@/lib/schemas';
import type { Bird } from '@/lib/types';
import { FileUploader } from './FileUploader';

type BirdFormValues = z.infer<typeof birdSchema>;

interface EditBirdFormProps {
    bird: Bird;
}

export function EditBirdForm({ bird }: EditBirdFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BirdFormValues>({
    resolver: zodResolver(birdSchema),
    defaultValues: {
      name: bird.name || '',
      age: bird.age || '',
      price: bird.price || 0,
      description: bird.description || '',
      isFeatured: bird.isFeatured || false,
      isSold: bird.isSold || false,
      birdImages: bird.birdImages || [],
      birdVideos: bird.birdVideos || [],
      fatherImages: bird.fatherImages || [],
      fatherVideos: bird.fatherVideos || [],
      motherImages: bird.motherImages || [],
      motherVideos: bird.motherVideos || [],
    },
    mode: 'onChange',
  });

  async function onSubmit(data: BirdFormValues) {
    setIsSubmitting(true);
    
    const result = await updateBird(bird.id, data);
    
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      });
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  }

  const UploaderSection = ({ title, fieldName }: { title: string; fieldName: keyof BirdFormValues }) => (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <FormField
        control={form.control}
        name={`${fieldName}Images` as any}
        render={({ field }) => (
            <FileUploader
                label="Images"
                storagePath={`birds/${bird.id}/${fieldName}Images`}
                fileType="image"
                value={field.value}
                onChange={field.onChange}
            />
        )}
      />
      <FormField
        control={form.control}
        name={`${fieldName}Videos` as any}
        render={({ field }) => (
             <FileUploader
                label="Videos"
                storagePath={`birds/${bird.id}/${fieldName}Videos`}
                fileType="video"
                value={field.value}
                onChange={field.onChange}
            />
        )}
      />
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bird Details</h3>
             <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name / ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
             )}/>
             <FormField control={form.control} name="age" render={({ field }) => (
                <FormItem><FormLabel>Age</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
             )}/>
             <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>Price (INR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
             )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="flex gap-8">
              <FormField control={form.control} name="isSold" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-1">
                  <div className="space-y-0.5"><FormLabel className="text-base">Mark as Sold</FormLabel></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
              )}/>
              <FormField control={form.control} name="isFeatured" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-1">
                  <div className="space-y-0.5"><FormLabel className="text-base">Feature on Homepage</FormLabel></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
              )}/>
            </div>
          </div>
          
          <div className="space-y-6">
            <UploaderSection title="Main Bird Media" fieldName="bird" />
            <UploaderSection title="Father's Media" fieldName="father" />
            <UploaderSection title="Mother's Media" fieldName="mother" />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
        </Button>
      </form>
    </Form>
  );
}
