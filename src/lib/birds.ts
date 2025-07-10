
import { db, isFirebaseInitialized } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import type { Bird } from './types';

// This function will fetch all birds from the 'birds' collection in Firestore.
export async function getBirds(): Promise<Bird[]> {
  try {
    // Wait for Firebase to be initialized before making a call
    await isFirebaseInitialized();
    const birdsCol = collection(db, 'birds');
    const birdSnapshot = await getDocs(birdsCol);
    const birdList = birdSnapshot.docs.map(doc => {
      return { 
        id: doc.id,
        ...doc.data()
      } as Bird
    });
    return birdList;
  } catch (error) {
    console.error("Error fetching birds:", error);
    // In case of an error, we return an empty array.
    // This can happen if Firebase is not configured correctly or rules are wrong.
    return [];
  }
}

// This function will fetch a single bird by its ID from the 'birds' collection.
export async function getBird(id: string): Promise<Bird | undefined> {
  try {
    // Wait for Firebase to be initialized before making a call
    await isFirebaseInitialized();
    const birdDocRef = doc(db, 'birds', id);
    const birdSnap = await getDoc(birdDocRef);

    if (birdSnap.exists()) {
      return { id: birdSnap.id, ...birdSnap.data() } as Bird;
    } else {
      console.log("No such document with id:", id);
      return undefined;
    }
  } catch (error) {
    console.error(`Error fetching bird with id ${id}:`, error);
    return undefined;
  }
}
