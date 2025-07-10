
'use server';

import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file || file.size === 0) {
    throw new Error("A file is required for upload.");
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Provided file is not an image.');
  }

  const filePath = `${folder}/${uuidv4()}-${file.name}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file, { contentType: file.type });
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}

export async function deleteImage(imageUrl: string): Promise<void> {
    try {
        // This is the crucial fix: get the file path from the full URL.
        const decodedUrl = decodeURIComponent(imageUrl);
        const path = decodedUrl.split('/o/')[1].split('?')[0];
        
        if (!path) {
            console.warn(`Could not determine storage path from URL: ${imageUrl}`);
            return;
        }

        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
    } catch (error: any) {
        // It's okay if the file doesn't exist, we can ignore that error.
        if (error.code === 'storage/object-not-found') {
            console.log(`Image not found at ${imageUrl}, skipping delete.`);
        } else {
            console.error(`Failed to delete image at ${imageUrl}:`, error);
            // We don't rethrow because failing to delete an image shouldn't
            // block the deletion of the Firestore document.
        }
    }
}
