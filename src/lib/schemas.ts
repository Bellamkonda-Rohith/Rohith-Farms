import { z } from 'zod';

const firebaseStorageUrl = () => z.string().url().startsWith("https://firebasestorage.googleapis.com/");

export const birdSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  age: z.string().min(1, 'Age is required.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  
  birdImages: z.array(firebaseStorageUrl()).min(1, "At least one bird image is required."),
  birdVideos: z.array(firebaseStorageUrl()).optional().default([]),
  
  motherImages: z.array(firebaseStorageUrl()).optional().default([]),
  motherVideos: z.array(firebaseStorageUrl()).optional().default([]),
  
  fatherImages: z.array(firebaseStorageUrl()).optional().default([]),
  fatherVideos: z.array(firebaseStorageUrl()).optional().default([]),

  isFeatured: z.boolean().default(false),
  isSold: z.boolean().default(false),
});

export type BirdFormData = z.infer<typeof birdSchema>;
