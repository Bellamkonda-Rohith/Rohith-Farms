
'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, doc, deleteDoc, setDoc, getDocs, query, where, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { AdminUser, Bird } from './types';
import { deleteImage } from './storage';
import { type BirdFormData } from './schemas';

export async function addBird(birdData: BirdFormData) {
  try {
    const newBird: Omit<Bird, 'id'> = {
      ...birdData,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'birds'), newBird);
    
    revalidatePath('/admin');
    
    return { success: true, message: 'Bird created successfully!', birdId: docRef.id };
  } catch (error) {
    console.error('Error adding bird:', error);
    let errorMessage = 'Failed to add bird.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}

export async function updateBird(birdId: string, birdData: BirdFormData) {
  try {
    const birdRef = doc(db, 'birds', birdId);
    await updateDoc(birdRef, { ...birdData });

    revalidatePath('/admin');
    revalidatePath(`/birds/${birdId}`);
    revalidatePath('/birds');
    revalidatePath(`/admin/edit/${birdId}`);

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
        await deleteDoc(doc(db, 'birds', bird.id));

        const imageUrlsToDelete = [
            ...bird.birdImages,
            ...bird.motherImages,
            ...bird.fatherImages,
            ...bird.birdVideos,
            ...bird.motherVideos,
            ...bird.fatherVideos,
        ].filter((url): url is string => !!url);

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

// --- Admin User Management ---

export async function addAdminByUid(uid: string) {
  try {
    if (!uid || uid.trim().length === 0) {
      return { success: false, message: 'A valid User ID (UID) is required.' };
    }
    
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, message: 'No user found with this UID. Please ensure the user has logged in at least once.' };
    }

    const adminRef = doc(db, 'admins', uid);
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists()) {
      return { success: false, message: 'This user is already an admin.' };
    }
    
    const userData = userSnap.data();

    await setDoc(adminRef, {
      phoneNumber: userData?.phoneNumber || 'N/A',
      addedAt: new Date().toISOString(),
    });

    revalidatePath('/admin/users');
    return { success: true, message: `Admin added successfully for user ${uid}.` };

  } catch (error: any) {
    console.error('Error adding admin:', error);
    let message = 'Failed to add admin.';
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, message };
  }
}

export async function getAdmins(): Promise<AdminUser[]> {
    try {
        const adminsCol = collection(db, 'admins');
        const adminSnapshot = await getDocs(adminsCol);
        const adminList = adminSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                phoneNumber: data.phoneNumber,
            } as AdminUser;
        });
        return adminList;
    } catch (error) {
        console.error("Error fetching admins:", error);
        return [];
    }
}
