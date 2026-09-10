export interface Payment {
  id: string;
  requestId: string;
  userId: string;
  amount: number;
  date: unknown;
  method: string;
  status: 'pending' | 'paid' | 'cancelled';
  notes?: string;
}