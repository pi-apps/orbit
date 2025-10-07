import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcGbIoBCaSCUZhoqcEf4LXHlJZCu7k93I",
  projectId: "connect-social-project",
  storageBucket: "connect-social-project.appspot.com",
  appId: "1:376521021326:web:da937148b2599ed221b6df",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, "cs");
export const storage = getStorage(app);
export const firestoreDb = getFirestore(app);
export const firebaseAuth = getAuth(app);
