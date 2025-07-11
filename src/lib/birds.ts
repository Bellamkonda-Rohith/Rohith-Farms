
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase";
import type { Bird } from "./types";

const birdsCollection = collection(db, 'birds');

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
        parents: data.parents || { father: { images: [], videos: [] }, mother: { images: [], videos: [] } },
        createdAt: data.createdAt,
    };
};

export async function getBirds(): Promise<Bird[]> {
    const q = query(birdsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
}

export async function getBirdById(id: string): Promise<Bird | null> {
    const birdDoc = doc(db, 'birds', id);
    const snapshot = await getDoc(birdDoc);
    if (snapshot.exists()) {
        return fromFirestore(snapshot);
    }
    return null;
}

export async function getFeaturedBirds(): Promise<Bird[]> {
    const q = query(
        birdsCollection, 
        where('isFeatured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(3)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(fromFirestore);
}
