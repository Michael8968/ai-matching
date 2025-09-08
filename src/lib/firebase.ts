// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCRH4EusKWPxH9YVbYRr3N6AMvcNd98RI",
  authDomain: "design-sales-d95bb.firebaseapp.com",
  projectId: "design-sales-d95bb",
  storageBucket: "design-sales-d95bb.appspot.com",
  messagingSenderId: "711093196627",
  appId: "1:711093196627:web:69d4aeacbd23720b07f3a6",
  measurementId: "G-275V79NTNJ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Configure Firestore for better connectivity
import { connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";

// Configure Firestore settings for better connectivity
if (typeof window !== 'undefined') {
  // Only run in browser environment
  try {
    // Enable network and configure settings
    enableNetwork(db);
    
    // Add connection state monitoring
    const handleConnectionChange = () => {
      if (navigator.onLine) {
        enableNetwork(db).catch(console.warn);
      } else {
        disableNetwork(db).catch(console.warn);
      }
    };
    
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
  } catch (error) {
    console.warn('Firebase network configuration warning:', error);
  }
}

export { app, db, auth };
