
'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, doc, deleteDoc, setDoc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { AdminUser, Bird } from './types';
import { deleteImage } from './storage';
import { type BirdUrlFormData } from './schemas';
import { getAuth } from 'firebase-admin/auth';
import { getFirebaseAdminApp } from './firebase-admin';

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
        await deleteDoc(doc(db, 'birds', bird.id));

        const imageUrlsToDelete = [
            bird.imageUrl,
            bird.father?.imageUrl,
            bird.mother?.imageUrl,
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

export async function addAdminByPhone(phone: string) {
  try {
    const app = getFirebaseAdminApp();
    const auth = getAuth(app);
    const fullPhoneNumber = `+91${phone}`;
    
    const userRecord = await auth.getUserByPhoneNumber(fullPhoneNumber);
    const uid = userRecord.uid;

    const adminRef = doc(db, 'admins', uid);
    const adminDoc = await getDoc(adminRef);

    if (adminDoc.exists()) {
      return { success: false, message: 'User is already an admin.' };
    }

    await setDoc(adminRef, {
      phoneNumber: fullPhoneNumber,
      addedAt: new Date().toISOString(),
    });

    revalidatePath('/admin/users');
    return { success: true, message: `Admin added successfully for ${fullPhoneNumber}.` };

  } catch (error: any) {
    console.error('Error adding admin:', error);
    let message = 'Failed to add admin.';
    if (error.code === 'auth/user-not-found') {
      message = 'No user found with this phone number. Please ensure they have logged in at least once.';
    } else if (error instanceof Error) {
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
