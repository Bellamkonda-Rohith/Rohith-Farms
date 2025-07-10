'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Bird } from './types';
import { uploadImage, deleteImage } from './storage';

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
        fatherVideoUrl: formData.get('fatherVideoUrl') as string || '',
        motherName: formData.get('motherName') as string,
        motherVideoUrl: formData.get('motherVideoUrl') as string || '',
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
      name: birdDataRequest.name,
      bloodline: birdDataRequest.bloodline,
      traits: birdDataRequest.traits,
      isAvailable: birdDataRequest.isAvailable,
      videoUrl: birdDataRequest.videoUrl,
      imageUrl,
      father: { 
        name: birdDataRequest.fatherName, 
        imageUrl: fatherImageUrl,
        videoUrl: birdDataRequest.fatherVideoUrl,
      },
      mother: { 
        name: birdDataRequest.motherName, 
        imageUrl: motherImageUrl,
        videoUrl: birdDataRequest.motherVideoUrl,
      },
    };

    await addDoc(collection(db, 'birds'), birdData);
    
    revalidatePath('/admin');
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


export async function deleteBird(birdId: string, imagePaths: string[]) {
    try {
        // Delete the document from Firestore
        await deleteDoc(doc(db, 'birds', birdId));

        // Delete associated images from Storage
        const deletePromises = imagePaths.map(path => deleteImage(path));
        await Promise.all(deletePromises);
        
        revalidatePath('/admin');
        revalidatePath('/');
        revalidatePath('/birds');

        return { success: true, message: 'Bird deleted successfully!' };

    } catch (error) {
        console.error('Error deleting bird:', error);
        let errorMessage = 'Failed to delete bird.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return { success: false, message: errorMessage };
    }
}
