import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const imageFileListSchema = z
  .any()
  .refine((files) => files?.length > 0, 'An image is required.')
  .refine((files) => files?.length < 2, 'Only one image can be uploaded.')
  .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  );

const parentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  imageUrl: imageFileListSchema,
});

export const birdSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bloodline: z.string().min(1, 'Bloodline is required'),
  traits: z.string().min(1, 'Traits are required'),
  isAvailable: z.boolean().default(true),
  imageUrl: imageFileListSchema,
  videoUrl: z.string().url('Video URL must be a valid URL').optional().or(z.literal('')),
  father: parentSchema,
  mother: parentSchema,
});

export type BirdFormData = z.infer<typeof birdSchema>;
