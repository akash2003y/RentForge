import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {

  apiKey:
    "AIzaSyBRTcQ3jEJ958mvwiFR2DIzHL-osBTLZgI",

  authDomain:
    "rentforge-b94e7.firebaseapp.com",

  projectId:
    "rentforge-b94e7",

  storageBucket:
    "rentforge-b94e7.firebasestorage.app",

  messagingSenderId:
    "134014677771",

  appId:
    "1:134014677771:web:6f3ff9556505d2721d680e",

  measurementId:
    "G-EWB0PXYMKH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// GOOGLE PROVIDER
export const provider =
  new GoogleAuthProvider();

// FORCE ACCOUNT CHOOSER
provider.setCustomParameters({

  prompt: "select_account"
});