'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc } from 'firebase/firestore';
import { z } from 'zod';
import { db } from './firebase';
import type { Bird } from './types';

const parentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  imageUrl: z.string().url('Must be a valid URL'),
});

export const birdSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bloodline: z.string().min(1, 'Bloodline is required'),
  traits: z.string().min(1, 'Traits are required'),
  isAvailable: z.boolean().default(true),
  imageUrl: z.string().url('Image URL must be a valid URL'),
  videoUrl: z.string().url('Video URL must be a valid URL').optional().or(z.literal('')),
  father: parentSchema,
  mother: parentSchema,
});

export type BirdFormData = z.infer<typeof birdSchema>;

export async function addBird(data: BirdFormData) {
  try {
    const validatedData = birdSchema.parse(data);

    // Casting to Omit<Bird, 'id'> as addDoc will generate the ID
    const birdData: Omit<Bird, 'id'> = {
      ...validatedData,
      videoUrl: validatedData.videoUrl || '', // Ensure it's not undefined
    };

    await addDoc(collection(db, 'birds'), birdData);
    
    // Revalidate paths to show the new bird
    revalidatePath('/');
    revalidatePath('/birds');
    
    return { success: true, message: 'Bird added successfully!' };
  } catch (error) {
    console.error('Error adding bird:', error);
    let errorMessage = 'Failed to add bird.';
    if (error instanceof z.ZodError) {
        errorMessage = error.errors.map(e => e.message).join(', ');
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}
