// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-564a5.firebaseapp.com",
  projectId: "mern-estate-564a5",
  storageBucket: "mern-estate-564a5.appspot.com",
  messagingSenderId: "261066050276",
  appId: "1:261066050276:web:285181d03fb1393aa87af1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);