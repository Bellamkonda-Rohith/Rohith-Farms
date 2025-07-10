
import { z } from 'zod';

const firebaseStorageUrl = () => z.string().url().startsWith("https://firebasestorage.googleapis.com/");

const parentUrlSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  imageUrl: firebaseStorageUrl(),
  videoUrl: z.string().url('Video URL must be a valid YouTube embed URL').optional().or(z.literal('')),
});

export const birdUrlSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bloodline: z.string().min(1, 'Bloodline is required'),
  traits: z.string().min(1, 'Traits are required'),
  isAvailable: z.boolean().default(true),
  imageUrl: firebaseStorageUrl(),
  videoUrl: z.string().url('Video URL must be a valid YouTube embed URL').optional().or(z.literal('')),
  father: parentUrlSchema,
  mother: parentUrlSchema,
});

export type BirdUrlFormData = z.infer<typeof birdUrlSchema>;
