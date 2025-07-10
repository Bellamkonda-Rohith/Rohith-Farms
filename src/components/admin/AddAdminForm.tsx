
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addAdminByUid } from '@/lib/admin-actions';

const adminSchema = z.object({
  uid: z.string().min(1, 'Please enter a valid User ID (UID).'),
});

type AdminFormValues = z.infer<typeof adminSchema>;

export function AddAdminForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: { uid: '' },
    mode: 'onChange',
  });

  async function onSubmit(data: AdminFormValues) {
    setIsSubmitting(true);
    
    const result = await addAdminByUid(data.uid);
    
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
        <FormField
          control={form.control}
          name="uid"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Admin User ID (UID)</FormLabel>
              <FormControl>
                  <Input
                    placeholder="Enter the UID of the user to make admin"
                    {...field}
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Admin
        </Button>
      </form>
    </Form>
  );
}
