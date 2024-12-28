'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import { createDiscountCode } from '../actions';

const formSchema = z.object({
  code: z
    .string()
    .min(5, 'Code must be at least 5 characters')
    .max(20, 'Code must be less than 20 characters')
    .regex(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers only'),
  discount_percent: z.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%'),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateDiscountCode() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      discount_percent: 10,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await createDiscountCode(values);

      if (!response?.success) {
        throw new Error(response?.error || 'Failed to create discount code');
      }

      toast({
        title: 'Success',
        description: 'Discount code created successfully',
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating discount code:', error);
      toast({
        title: 'Error',
        description: 'Failed to create discount code',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Code</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Discount Code</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='SUMMER2024'
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='discount_percent'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Percentage</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      min={1}
                      max={100}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full'>
              Create Code
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
