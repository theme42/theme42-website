import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcTXtIdJrP1C9Ljo5ptDnMy4yLdq-97IU",
  authDomain: "theme42-site.firebaseapp.com",
  projectId: "theme42-site",
  appId: "1:1067013832657:web:18ab3b87d2c1d8a3a0c8e9"
};};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Add scopes for additional permissions
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');