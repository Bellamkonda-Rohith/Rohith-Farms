
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useState } from 'react';
import { Loader2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addBird } from '@/lib/admin-actions';

const initialIdSchema = z.object({
  name: z.string().min(1, 'A name or ID is required to start.'),
});

type InitialIdFormValues = z.infer<typeof initialIdSchema>;

export function AddBirdForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InitialIdFormValues>({
    resolver: zodResolver(initialIdSchema),
    defaultValues: { name: '' },
    mode: 'onChange',
  });

  async function onSubmit(data: InitialIdFormValues) {
    setIsSubmitting(true);
    
    const result = await addBird({
      name: data.name,
      age: "Not set",
      price: 0,
      description: "No description provided yet.",
      birdImages: [],
      birdVideos: [],
      motherImages: [],
      motherVideos: [],
      fatherImages: [],
      fatherVideos: [],
      isFeatured: false,
      isSold: false,
    });
    
    setIsSubmitting(false);

    if (result.success && result.birdId) {
      toast({
        title: 'Bird Created!',
        description: `Redirecting to edit page for "${data.name}".`,
      });
      router.push(`/admin/edit/${result.birdId}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
      <div className="flex-grow">
        <label htmlFor="name" className="sr-only">Bird Name / ID</label>
        <input
          id="name"
          placeholder="Enter a unique name or ID to start (e.g., Red-001)"
          className="w-full p-2 border rounded-md"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <PlusCircle className="mr-2 h-4 w-4" />
        )}
        Create & Edit Bird
      </Button>
    </form>
  );
}
