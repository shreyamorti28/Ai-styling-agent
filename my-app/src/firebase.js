// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPgFgZG5yRBI8YVPYJ_sKPfGSDWW48oX0",
  authDomain: "ai-styling-agent.firebaseapp.com",
  projectId: "ai-styling-agent",
  storageBucket: "ai-styling-agent.appspot.com",
  messagingSenderId: "209768607805",
  appId: "1:209768607805:web:0f10c54096d011fc3a7a54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };