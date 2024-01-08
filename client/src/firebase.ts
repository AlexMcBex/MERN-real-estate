// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-6ce06.firebaseapp.com",
  projectId: "mern-real-estate-6ce06",
  storageBucket: "mern-real-estate-6ce06.appspot.com",
  messagingSenderId: "755473657184",
  appId: "1:755473657184:web:7edfd2cd7e66656330c205"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);