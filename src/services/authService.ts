import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';
import type { User } from '../types';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    return mapFirebaseUser(firebaseUser);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(mapFirebaseUser(firebaseUser));
    } else {
      callback(null);
    }
  });
};

const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email ?? '',
  displayName: firebaseUser.displayName ?? 'User',
  photoUrl: firebaseUser.photoURL ?? undefined,
});
