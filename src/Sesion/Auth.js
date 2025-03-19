import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Importar la configuración de Firebase

export const fakeAuth = {
  isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
  userRole: localStorage.getItem("userRole") || null,
  userName: localStorage.getItem("userName") || null, // Nuevo campo para el nombre del usuario

  async login(pin, navigate, setUpdate) {
    try {
      // Obtener los usuarios desde Firestore
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = querySnapshot.docs.map((doc) => doc.data());

      // Buscar el usuario con el PIN proporcionado
      const user = users.find((u) => u.pin === pin);

      if (user) {
        this.isAuthenticated = true;
        this.userRole = user.role;
        this.userName = user.name; // Obtener el nombre del usuario
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userName", user.name); // Guardar el nombre del usuario en localStorage
        setUpdate((prev) => !prev); // Forzar la actualización
        navigate('/form1'); // Redirigir después del login
      } else {
        alert('PIN incorrecto');
      }
    } catch (error) {
      console.error('Error al autenticar el usuario: ', error.message);
      alert('Hubo un error al autenticar el usuario: ' + error.message);
    }
  },

  logout(navigate, setUpdate) {
    this.isAuthenticated = false;
    this.userRole = null;
    this.userName = null; // Limpiar el nombre del usuario
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName"); // Eliminar el nombre del usuario de localStorage
    setUpdate((prev) => !prev); // Forzar la actualización
    navigate('/login'); // Redirigir al login después de cerrar sesión
  },
};