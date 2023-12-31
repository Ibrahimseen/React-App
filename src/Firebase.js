import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDCIS9UMmWLqfEV4VU4rQWOmhzBKJncZpE",
  authDomain: "ibrahim-chat-app.firebaseapp.com",
  projectId: "ibrahim-chat-app",
  storageBucket: "ibrahim-chat-app.appspot.com",
  messagingSenderId: "663283574426",
  appId: "1:663283574426:web:25e33d4bcb4a735ec5e123"
};

 export const app = initializeApp(firebaseConfig);