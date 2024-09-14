// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgJM9aIaT9Ye33XHu39vMMnuAqb2o9xC8",
  authDomain: "ship-routing-app.firebaseapp.com",
  projectId: "ship-routing-app",
  storageBucket: "ship-routing-app.appspot.com",
  messagingSenderId: "179380437829",
  appId: "1:179380437829:web:a9f4c24ead9c717a50742c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };