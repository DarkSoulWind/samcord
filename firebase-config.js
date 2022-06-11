// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQ1B4jB5ynYnIITccWDjH7C4Nbg8TTNyE",
  authDomain: "samcord-5d1fa.firebaseapp.com",
  projectId: "samcord-5d1fa",
  storageBucket: "samcord-5d1fa.appspot.com",
  messagingSenderId: "1032122070441",
  appId: "1:1032122070441:web:ef5250713022952ce680b8",
  measurementId: "G-N4GPTZC0K8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const provider = new GoogleAuthProvider();