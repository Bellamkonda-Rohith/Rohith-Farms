
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, type Firestore } from "firebase/firestore";
import { db } from "./firebase";
import type { Bird } from "./types";

// Helper function to convert Firestore doc to Bird type
const fromFirestore = (doc: any): Bird => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        age: data.age,
        weight: data.weight,
        color: data.color,
        line: data.line,
        price: data.price,
        availability: data.availability,
        isFeatured: data.isFeatured,
        images: data.images || [],
        videos: data.videos || [],
        skills: data.skills || [],
        parents: data.parents || { father: { images: [], videos: [] }, mother: { images: [], videos: [] } },
        createdAt: data.createdAt,
    };
};

// A function to get the birds collection, only if db is initialized.
const getBirdsCollection = () => {
    if (!db) {
        // Return null or throw a specific error if db is not available
        return null;
    }
    return collection(db as Firestore, 'birds');
}

export async function getBirds(): Promise<Bird[]> {
    const birdsCollection = getBirdsCollection();
    if (!birdsCollection) {
        console.warn("Firestore is not initialized. Skipping getBirds fetch.");
        return [];
    }
    const q = query(birdsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
}

export async function getBirdById(id: string): Promise<Bird | null> {
    if (!db) {
        console.warn("Firestore is not initialized. Skipping getBirdById fetch.");
        return null;
    }
    const birdDoc = doc(db, 'birds', id);
    const snapshot = await getDoc(birdDoc);
    if (snapshot.exists()) {
        return fromFirestore(snapshot);
    }
    return null;
}

export async function getFeaturedBirds(): Promise<Bird[]> {
    const birdsCollection = getBirdsCollection();
    if (!birdsCollection) {
        console.warn("Firestore is not initialized. Skipping getFeaturedBirds fetch.");
        return [];
    }
    const q = query(
        birdsCollection, 
        where('isFeatured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(3)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
}
