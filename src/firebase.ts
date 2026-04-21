import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVjSFTj9BY2vZAHCt0Z06bDd0SlJNQyyI",
  authDomain: "customdrinkmaker-9c051.firebaseapp.com",
  projectId: "customdrinkmaker-9c051",
  storageBucket: "customdrinkmaker-9c051.firebasestorage.app",
  messagingSenderId: "275753526719",
  appId: "1:275753526719:web:81375a918eed72224f2d0a",
  measurementId: "G-PHE7LETHTR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();