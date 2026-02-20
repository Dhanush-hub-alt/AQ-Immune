// Firebase Service
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
  QueryConstraint,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { firebaseConfig } from '../config';
import { SensorData, Alert, User } from '../types';

// Initialize Firebase app - handle missing config gracefully
let app;
let auth;
let db;

try {
  if (
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.authDomain
  ) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Set persistence
    setPersistence(auth, browserLocalPersistence).catch((error: any) => {
      console.warn('Error setting persistence:', error);
    });
  } else {
    console.warn('Firebase config incomplete. Please set environment variables.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Export auth and db (may be undefined if config incomplete)
export { auth, db };
export const authService = {
  signup: async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: () => {
    return auth.currentUser;
  },
};

// Firestore Service for Sensor Data
export const sensorService = {
  // Real-time listener for sensor data
  subscribeSensorData: (
    sensorId: string,
    callback: (data: SensorData[]) => void,
    constraints?: QueryConstraint[]
  ): Unsubscribe => {
    const q = constraints
      ? query(
          collection(db, 'sensorData'),
          where('sensorId', '==', sensorId),
          ...constraints
        )
      : query(collection(db, 'sensorData'), where('sensorId', '==', sensorId));

    return onSnapshot(q, (snapshot: any) => {
      const data = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp),
      })) as SensorData[];
      callback(data);
    });
  },

  // Real-time listener for all sensor data
  subscribeAllSensorData: (callback: (data: SensorData[]) => void): Unsubscribe => {
    return onSnapshot(collection(db, 'sensorData'), (snapshot: any) => {
      const data = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp),
      })) as SensorData[];
      callback(data);
    });
  },

  // Get sensor data by ID
  getSensorData: async (sensorId: string) => {
    try {
      const q = query(collection(db, 'sensorData'), where('sensorId', '==', sensorId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as SensorData[];
    } catch (error) {
      console.error('Error getting sensor data:', error);
      throw error;
    }
  },
};

// Firestore Service for Alerts
export const alertService = {
  // Real-time listener for alerts
  subscribeAlerts: (userId: string, callback: (alerts: Alert[]) => void): Unsubscribe => {
    const q = query(collection(db, 'alerts'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot: any) => {
      const alerts = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(doc.data().timestamp),
      })) as Alert[];
      callback(alerts);
    });
  },

  // Get all alerts for user
  getUserAlerts: async (userId: string) => {
    try {
      const q = query(collection(db, 'alerts'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Alert[];
    } catch (error) {
      console.error('Error getting alerts:', error);
      throw error;
    }
  },
};

// Firestore Service for User Profile
export const userService = {
  // Create user profile in Firestore
  createUserProfile: async (userId: string, displayName: string, email: string, role: 'admin' | 'user' = 'user') => {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        id: userId,
        displayName,
        email,
        role,
        photoURL: '',
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          theme: 'dark',
          language: 'en',
          units: 'metric',
          notifications_enabled: true,
        },
        notificationSettings: {
          email: true,
          push: true,
          sms: false,
        },
        linkedDevices: [],
      });
      return userRef;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (userId: string) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },
  
  // Get user by email
  getUserByEmail: async (email: string) => {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },
  
  // Update last login
  updateLastLogin: async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        lastLogin: new Date(),
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  },
  
  // Subscribe to user profile updates
  subscribeUserProfile: (userId: string, callback: (user: User | null) => void): Unsubscribe => {
    const docRef = doc(db, 'users', userId);
    return onSnapshot(docRef, (docSnap: any) => {
      if (docSnap.exists()) {
        const user = {
          id: docSnap.id,
          ...docSnap.data(),
        } as User;
        callback(user);
      } else {
        callback(null);
      }
    });
  },
};

export default {
  auth,
  db,
  authService,
  sensorService,
  alertService,
  userService,
};
