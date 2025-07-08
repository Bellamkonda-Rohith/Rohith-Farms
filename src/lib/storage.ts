
'use server';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
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
