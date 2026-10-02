import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from '../firebase';
import { UserProfile } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<User | null | undefined>(undefined);
  readonly user$ = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(firebaseAuth, user => this.userSubject.next(user));
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  }

  async register(displayName: string, email: string, whatsapp: string, password: string): Promise<void> {
    const credential = await this.withTimeout(
      createUserWithEmailAndPassword(firebaseAuth, email, password),
      'La creación de la cuenta tardó demasiado. Revisa tu conexión e inténtalo nuevamente.'
    );
    await this.withTimeout(
      updateProfile(credential.user, { displayName }),
      'La cuenta fue creada, pero no pudimos guardar tu nombre.'
    );
    const profile: UserProfile = {
      uid: credential.user.uid,
      displayName,
      email,
      whatsapp,
      role: 'user',
      photoURL: credential.user.photoURL,
      provider: 'password',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await this.withTimeout(
      setDoc(doc(firestore, 'users', credential.user.uid), profile),
      'La cuenta fue creada, pero no pudimos guardar tus datos en Firestore. Verifica que Firestore esté habilitado.'
    );
  }

  async loginWithGoogle(): Promise<void> {
    const credential = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
    const profileRef = doc(firestore, 'users', credential.user.uid);
    const existing = await getDoc(profileRef);
    if (!existing.exists()) {
      await setDoc(profileRef, {
        uid: credential.user.uid,
        displayName: credential.user.displayName ?? 'Usuario',
        email: credential.user.email ?? '',
        whatsapp: '',
        role: 'user',
        photoURL: credential.user.photoURL,
        provider: 'google.com',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      } satisfies UserProfile);
    }
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(firebaseAuth, email);
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
  }

  async getProfile(uid: string): Promise<UserProfile | null> {
    const snapshot = await getDoc(doc(firestore, 'users', uid));
    return snapshot.exists() ? snapshot.data() as UserProfile : null;
  }

  private async withTimeout<T>(operation: Promise<T>, message: string): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(message)), 15000);
    });
    try {
      return await Promise.race([operation, timeout]);
    } finally {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    }
  }
}