import { Injectable } from '@angular/core';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firebaseStorage } from '../firebase';

@Injectable({ providedIn: 'root' })
export class StorageService {
  async uploadRequestImage(userId: string, file: File): Promise<string> {
    if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) throw new Error('Archivo no permitido. Usa una imagen de hasta 8 MB.');
    const storageRef = ref(firebaseStorage, `service-requests/${userId}/${crypto.randomUUID()}-${file.name}`);
    await uploadBytes(storageRef, file, { contentType: file.type });
    return getDownloadURL(storageRef);
  }
}