import { Injectable } from '@angular/core';
import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../firebase';
import { MaintenanceService } from '../models/service.model';
import { RequestStatus, ServiceRequest } from '../models/service-request.model';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  async getActiveServices(): Promise<MaintenanceService[]> {
    const snapshot = await getDocs(query(collection(firestore, 'services'), where('active', '==', true)));
    return snapshot.docs.map(item => ({ id: item.id, ...item.data() } as MaintenanceService));
  }

  async getUserRequests(userId: string): Promise<ServiceRequest[]> {
    const snapshot = await getDocs(query(collection(firestore, 'serviceRequests'), where('userId', '==', userId)));
    return snapshot.docs.map(item => ({ requestId: item.id, ...item.data() } as ServiceRequest));
  }

  async createRequest(request: Omit<ServiceRequest, 'requestId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const reference = await addDoc(collection(firestore, 'serviceRequests'), { ...request, status: 'pending' satisfies RequestStatus, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return reference.id;
  }

  async updateRequestStatus(requestId: string, status: RequestStatus): Promise<void> {
    await updateDoc(doc(firestore, 'serviceRequests', requestId), { status, updatedAt: serverTimestamp(), ...(status === 'completed' ? { completedAt: serverTimestamp() } : {}) });
  }
}