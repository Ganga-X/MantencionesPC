export type RequestStatus = 'pending' | 'contacted' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface ServiceRequest {
  requestId: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  price: number;
  deviceType: string;
  brand: string;
  model: string;
  description: string;
  status: RequestStatus;
  createdAt: unknown;
  updatedAt: unknown;
  completedAt?: unknown;
}