
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
import { addAdminByPhone } from '@/lib/admin-actions';

const adminSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
});

type AdminFormValues = z.infer<typeof adminSchema>;

export function AddAdminForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: { phone: '' },
    mode: 'onChange',
  });

  async function onSubmit(data: AdminFormValues) {
    setIsSubmitting(true);
    
    const result = await addAdminByPhone(data.phone);
    
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
          name="phone"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Admin Phone Number</FormLabel>
              <FormControl>
                 <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-muted-foreground sm:text-sm">
                      +91
                    </span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="9876543210"
                    className="pl-12"
                    {...field}
                  />
                </div>
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
