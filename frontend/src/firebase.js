// src/firebase.js
// Firebase configuration and initialization for 6seasonsorganic ecommerce frontend

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Add other Firebase imports as needed (e.g., auth, firestore)

const firebaseConfig = {
  apiKey: "AIzaSyChDLbark2pn6SMPmeiA93Vqk7jLQASoMA",
  authDomain: "seasons-organic.firebaseapp.com",
  projectId: "seasons-organic",
  storageBucket: "seasons-organic.firebasestorage.app",
  messagingSenderId: "144034970073",
  appId: "1:144034970073:web:3a33a34885d69da97f01c8",
  measurementId: "G-BCBRDFWZ00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
