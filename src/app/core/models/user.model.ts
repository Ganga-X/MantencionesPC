export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  whatsapp: string;
  role: UserRole;
  photoURL?: string | null;
  provider?: string;
  createdAt: unknown;
  updatedAt: unknown;
}