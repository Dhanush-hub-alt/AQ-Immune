// Mobile App Config
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const apiConfig = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000,
};

export const appConfig = {
  appName: 'AQ-Immune',
  appVersion: '1.0.0',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
};
