export interface Equipment {
  id: string;
  userId: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  serialNumber?: string;
  operatingSystem?: string;
  notes?: string;
  createdAt: unknown;
  updatedAt: unknown;
}