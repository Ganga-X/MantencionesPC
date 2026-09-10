export interface MaintenanceService {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  active: boolean;
  createdAt: unknown;
  updatedAt: unknown;
}