// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxf4_2k5cdCZV32Y2BuyLfWVAx6D8fAz8",
  authDomain: "anime-sensei-cca0b.firebaseapp.com",
  projectId: "anime-sensei-cca0b",
  storageBucket: "anime-sensei-cca0b.firebasestorage.app",
  messagingSenderId: "334381808916",
  appId: "1:334381808916:web:0e98b44c6657ecce0f9601",
  measurementId: "G-BWVFLYN5G1"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;