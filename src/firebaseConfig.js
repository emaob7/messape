// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase (obtén estos datos desde la consola de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyBAfDRfyTSqt7-a3lpRsfsX3yfudJdTL50",
  authDomain: "unves-bcb8c.firebaseapp.com",
  projectId: "unves-bcb8c",
  storageBucket: "unves-bcb8c.firebasestorage.app",
  messagingSenderId: "472843915923",
  appId: "1:472843915923:web:561e11a3a1164b534fb366",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtén una instancia de Firestore
const db = getFirestore(app);

export { db };
