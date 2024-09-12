import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCLHi6iHVLIwZyrLDu61RrYZQiL5u8UJpk",
  authDomain: "snapnest-21282.firebaseapp.com",
  projectId: "snapnest-21282",
  storageBucket: "snapnest-21282.appspot.com",
  messagingSenderId: "62928298601",
  appId: "1:62928298601:web:62fecf2292d5a098edf8f8",
  measurementId: "G-XZK3BED8TW",
  databaseURL: "https://snapnest-21282-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const database = getDatabase(app);

export const storage = getStorage(app);