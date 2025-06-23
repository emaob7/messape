import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getApps } from "firebase/app";

// ⚙️ Tu configuración de Firebase (¡completala con tus datos reales!)
const firebaseConfig = {
  apiKey: "AIzaSyBu2uXBTOyChgmWNm3hUDYx_UsxyCP61Og",
  authDomain: "copy-cc2cb.firebaseapp.com",
  databaseURL: "https://copy-cc2cb.firebaseio.com",
  projectId: "copy-cc2cb",
  storageBucket: "copy-cc2cb.appspot.com",
  messagingSenderId: "465291082387",
  appId: "1:465291082387:web:b8b36fd0e054abc2b02b66",
  measurementId: "G-EX37NDEWKX",
};

// 🔐 Inicializar Firebase si aún no está
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

export default function RenameCollectionButton() {
  const handleRename = async () => {
    const oldName = "formularios"; // 🔴 colección actual
    const newName = "2025"; // 🟢 nombre nuevo

    const oldCollectionRef = collection(db, oldName);
    const newCollectionRef = collection(db, newName);

    try {
      const snapshot = await getDocs(oldCollectionRef);

      for (const document of snapshot.docs) {
        const data = document.data();

        // ✅ Copiar a la nueva colección
        await setDoc(doc(newCollectionRef, document.id), data);

        // 🧹 (Opcional) Eliminar de la colección vieja
        // await deleteDoc(doc(oldCollectionRef, document.id));
        console.log(`Copiado: ${document.id}`);
      }

      alert('Todos los documentos fueron copiados de "formularios" a "2025"');
    } catch (error) {
      console.error("Error al renombrar:", error);
      alert("Ocurrió un error. Revisá la consola.");
    }
  };

  return (
    <button
      onClick={handleRename}
      style={{ padding: "10px 20px", margin: "20px", fontSize: "16px" }}
    >
      Renombrar colección "formularios" a "2025"
    </button>
  );
}
