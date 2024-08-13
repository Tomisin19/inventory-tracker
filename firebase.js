// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDh8HGvbGk0churlPdBKLdkrvidtzNPq-I",
  authDomain: "inventory-management-98aaa.firebaseapp.com",
  projectId: "inventory-management-98aaa",
  storageBucket: "inventory-management-98aaa.appspot.com",
  messagingSenderId: "300757838115",
  appId: "1:300757838115:web:f83ad6943e20d0cf884496",
  measurementId: "G-3CPZHD67VE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}