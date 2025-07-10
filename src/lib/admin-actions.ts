
'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Bird } from './types';
import { deleteImage } from './storage';
import { type BirdUrlFormData } from './schemas';

export async function addBird(birdData: BirdUrlFormData) {
  try {
    const newBird: Omit<Bird, 'id'> = {
      ...birdData,
      father: {
        name: birdData.father.name,
        imageUrl: birdData.father.imageUrl,
        videoUrl: birdData.father.videoUrl,
      },
      mother: {
        name: birdData.mother.name,
        imageUrl: birdData.mother.imageUrl,
        videoUrl: birdData.mother.videoUrl,
      },
    };

    await addDoc(collection(db, 'birds'), newBird);
    
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

export async function updateBird(birdId: string, birdData: BirdUrlFormData) {
  try {
    const birdRef = doc(db, 'birds', birdId);
    await setDoc(birdRef, birdData, { merge: true });

    revalidatePath('/admin');
    revalidatePath(`/birds/${birdId}`);
    revalidatePath('/birds');

    return { success: true, message: 'Bird updated successfully!' };
  } catch (error) {
    console.error('Error updating bird:', error);
    let errorMessage = 'Failed to update bird.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}


export async function deleteBird(bird: Bird) {
    try {
        // Delete the document from Firestore
        await deleteDoc(doc(db, 'birds', bird.id));

        // Gather all image URLs to delete from Storage
        const imageUrlsToDelete = [
            bird.imageUrl,
            bird.father?.imageUrl,
            bird.mother?.imageUrl,
        ].filter((url): url is string => !!url);


        // Delete associated images from Storage
        const deletePromises = imageUrlsToDelete.map(url => deleteImage(url));
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
