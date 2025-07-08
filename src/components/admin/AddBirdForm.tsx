'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { birdSchema, addBird } from '@/lib/admin-actions';

type BirdFormValues = z.infer<typeof birdSchema>;

const defaultValues: Partial<BirdFormValues> = {
  isAvailable: true,
  videoUrl: '',
  father: { name: '' },
  mother: { name: '' },
};

export function AddBirdForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BirdFormValues>({
    resolver: zodResolver(birdSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: BirdFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('bloodline', data.bloodline);
    formData.append('traits', data.traits);
    formData.append('isAvailable', String(data.isAvailable));
    formData.append('videoUrl', data.videoUrl || '');

    if (data.imageUrl?.length > 0) {
      formData.append('image', data.imageUrl[0]);
    }
    if (data.father.imageUrl?.length > 0) {
        formData.append('fatherName', data.father.name);
        formData.append('fatherImage', data.father.imageUrl[0]);
    }
    if (data.mother.imageUrl?.length > 0) {
        formData.append('motherName', data.mother.name);
        formData.append('motherImage', data.mother.imageUrl[0]);
    }

    const result = await addBird(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            {/* Main Bird Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Bird Details</h3>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bird Name / ID</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Red-001" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bloodline"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bloodline</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Sweater" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="traits"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Traits</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Describe the bird's notable traits..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field: { onChange, ...props } }) => (
                        <FormItem>
                        <FormLabel>Bird Image</FormLabel>
                        <FormControl>
                            <Input 
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={(e) => onChange(e.target.files)} 
                                {...props} 
                            />
                        </FormControl>
                        <FormDescription>Upload the main bird image.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>YouTube Video URL (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="https://www.youtube.com/embed/..." {...field} />
                        </FormControl>
                        <FormDescription>Must be a YouTube embed URL.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Available for Sale</FormLabel>
                            <FormDescription>Is this bird currently available?</FormDescription>
                        </div>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        </FormItem>
                    )}
                />
            </div>
            {/* Parent Details */}
            <div className="space-y-4">
                {/* Father */}
                <div className="space-y-4 rounded-lg border p-4">
                    <h3 className="text-lg font-medium">Father Details</h3>
                     <FormField
                        control={form.control}
                        name="father.name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Father's Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Big Red" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="father.imageUrl"
                        render={({ field: { onChange, ...props } }) => (
                            <FormItem>
                            <FormLabel>Father's Image</FormLabel>
                            <FormControl>
                                <Input 
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(e) => onChange(e.target.files)} 
                                    {...props} 
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* Mother */}
                <div className="space-y-4 rounded-lg border p-4">
                    <h3 className="text-lg font-medium">Mother Details</h3>
                     <FormField
                        control={form.control}
                        name="mother.name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Mother's Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Blue Hen" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mother.imageUrl"
                        render={({ field: { onChange, ...props } }) => (
                            <FormItem>
                            <FormLabel>Mother's Image</FormLabel>
                            <FormControl>
                                 <Input 
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(e) => onChange(e.target.files)} 
                                    {...props} 
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Bird
        </Button>
      </form>
    </Form>
  );
}
