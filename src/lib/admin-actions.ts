'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc } from 'firebase/firestore';
import { z } from 'zod';
import { db } from './firebase';
import type { Bird } from './types';
import { uploadImage } from './storage';

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

export async function addBird(formData: FormData) {
  try {
    const image = formData.get('image') as File | null;
    const fatherImage = formData.get('fatherImage') as File | null;
    const motherImage = formData.get('motherImage') as File | null;

    if (!image || !fatherImage || !motherImage) {
        return { success: false, message: "All images are required." };
    }
    
    const birdDataRequest = {
        name: formData.get('name') as string,
        bloodline: formData.get('bloodline') as string,
        traits: formData.get('traits') as string,
        isAvailable: formData.get('isAvailable') === 'true',
        videoUrl: formData.get('videoUrl') as string || '',
        fatherName: formData.get('fatherName') as string,
        motherName: formData.get('motherName') as string,
    }

    if (!birdDataRequest.name || !birdDataRequest.bloodline || !birdDataRequest.fatherName || !birdDataRequest.motherName) {
        return { success: false, message: "Required text fields are missing."};
    }

    const [imageUrl, fatherImageUrl, motherImageUrl] = await Promise.all([
        uploadImage(image, 'birds'),
        uploadImage(fatherImage, 'parents'),
        uploadImage(motherImage, 'parents')
    ]);

    const birdData: Omit<Bird, 'id'> = {
        ...birdDataRequest,
        imageUrl,
        father: { name: birdDataRequest.fatherName, imageUrl: fatherImageUrl },
        mother: { name: birdDataRequest.motherName, imageUrl: motherImageUrl },
    };

    await addDoc(collection(db, 'birds'), birdData);
    
    revalidatePath('/');
    revalidatePath('/birds');
    
    return { success: true, message: 'Bird added successfully!' };
  } catch (error) {
    console.error('Error adding bird:', error);
    let errorMessage = 'Failed to add bird.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}
