import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "Your_APiKeyHere",
  projectId: "connect-social-project",
  storageBucket: "connect-social-project.appspot.com",
  appId: "1:376521021326:web:da937148b2599ed221b6df",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, "cs");
export const storage = getStorage(app);
export const firebaseAuth = getAuth(app);
