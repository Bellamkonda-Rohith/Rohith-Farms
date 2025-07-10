
'use server';

import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadFile(
  file: File,
  folder: string,
  onProgress: (progress: number) => void
): Promise<string> {
  if (!file) {
    throw new Error("A file is required for upload.");
  }

  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (isImage && !allowedImageTypes.includes(file.type)) {
    throw new Error(`Unsupported image type: ${file.type}. Please use JPG, PNG, WEBP, or GIF.`);
  }

  if (isVideo && !allowedVideoTypes.includes(file.type)) {
     throw new Error(`Unsupported video type: ${file.type}. Please use MP4, WEBM, or MOV.`);
  }

  if (!isImage && !isVideo) {
      throw new Error('File type not supported. Please upload an image or video.');
  }

  const filePath = `${folder}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, filePath);

  const uploadTask = uploadBytesResumable(storageRef, file, { contentType: file.type });

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        reject(new Error(`Upload failed. Code: ${error.code}`));
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

export async function deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl.includes('firebasestorage.googleapis.com')) {
        console.warn(`Skipping delete for non-storage URL: ${imageUrl}`);
        return;
    }
    try {
        const decodedUrl = decodeURIComponent(imageUrl);
        const path = decodedUrl.split('/o/')[1].split('?')[0];
        
        if (!path) {
            console.warn(`Could not determine storage path from URL: ${imageUrl}`);
            return;
        }

        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
    } catch (error: any) {
        if (error.code === 'storage/object-not-found') {
            console.log(`Image not found at ${imageUrl}, skipping delete.`);
        } else {
            console.error(`Failed to delete image at ${imageUrl}:`, error);
            throw error;
        }
    }
}
