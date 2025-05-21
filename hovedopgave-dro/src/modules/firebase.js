import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // dette skal tilføjes

const firebaseConfig = {
    apiKey: "AIzaSyDAo44L0oXvz0h1mxfBZahqvuMRkZgoy5s",
    authDomain: "frokostportal-dro.firebaseapp.com",
    projectId: "frokostportal-dro",
    storageBucket: "frokostportal-dro.firebasestorage.app",
    messagingSenderId: "952522259397",
    appId: "1:952522259397:web:3ed35e42edddc60e3329ac"
  };

const app = initializeApp(firebaseConfig);

// 🔐 Authentication
const auth = getAuth(app);

export { auth };