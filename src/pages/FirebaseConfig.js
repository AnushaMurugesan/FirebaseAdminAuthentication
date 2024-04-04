import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyAOgzkrEBDnTXlPqJ9snD7E0wIMdYa6nbo",
  authDomain: "employee-form-83ba4.firebaseapp.com",
  projectId: "employee-form-83ba4",
  storageBucket: "employee-form-83ba4.appspot.com",
  messagingSenderId: "23419591272",
  appId: "1:23419591272:web:f2303cc5990d7c80fb79dd",
  measurementId: "G-4TGB9J3GCG"
};


const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app);

