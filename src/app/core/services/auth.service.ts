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
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await updateProfile(credential.user, { displayName });
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
    await setDoc(doc(firestore, 'users', credential.user.uid), profile);
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
}