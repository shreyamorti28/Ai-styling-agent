// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQ9kl6rL8o0KVq-hRs0xXlaNTJ5zdfCbg",
  authDomain: "my-ai-styling-agent.firebaseapp.com",
  projectId: "my-ai-styling-agent",
  storageBucket: "my-ai-styling-agent.firebasestorage.app",
  messagingSenderId: "365321394255",
  appId: "1:365321394255:web:2a03ccf79b2a705563723a",
  measurementId: "G-MYN1KYTX3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };