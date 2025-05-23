// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase (obtén estos datos desde la consola de Firebase)
const firebaseConfig = {
     apiKey: "AIzaSyBu2uXBTOyChgmWNm3hUDYx_UsxyCP61Og",
  authDomain: "copy-cc2cb.firebaseapp.com",
  databaseURL: "https://copy-cc2cb.firebaseio.com",
  projectId: "copy-cc2cb",
  storageBucket: "copy-cc2cb.appspot.com",
  messagingSenderId: "465291082387",
  appId: "1:465291082387:web:b8b36fd0e054abc2b02b66",
  measurementId: "G-EX37NDEWKX"
   
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtén una instancia de Firestore
const db = getFirestore(app);

export { db };