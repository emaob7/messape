import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Importar la configuración de Firebase

export const fakeAuth = {
  isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
  userRole: localStorage.getItem("userRole") || null,
  userName: localStorage.getItem("userName") || null,
  inactivityTimer: null,
  eventListenersAdded: false,
  currentNavigate: null,
  currentSetUpdate: null,

  async login(pin, navigate, setUpdate) {
    try {
      // Guardar referencias para usar en los callbacks
      this.currentNavigate = navigate;
      this.currentSetUpdate = setUpdate;

      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = querySnapshot.docs.map((doc) => doc.data());
      const user = users.find((u) => u.pin === pin);

      if (user) {
        this.isAuthenticated = true;
        this.userRole = user.role;
        this.userName = user.name;
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userName", user.name);
        setUpdate((prev) => !prev);
        navigate('/form1');
        
        if (!this.eventListenersAdded) {
          this.addActivityListeners();
          this.eventListenersAdded = true;
        }
        
        this.resetInactivityTimer();
      } else {
        alert('PIN incorrecto');
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      alert(`Error al autenticar: ${error.message}`);
    }
  },

  logout() {
    this.isAuthenticated = false;
    this.userRole = null;
    this.userName = null;
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    this.currentSetUpdate?.((prev) => !prev);
    this.currentNavigate?.('/login');
    this.clearInactivityTimer();
    this.removeActivityListeners();
    this.eventListenersAdded = false;
  },

  resetInactivityTimer() {
    this.clearInactivityTimer();
    
    this.inactivityTimer = setTimeout(() => {
      if (this.isAuthenticated) {
        alert('Sesión expirada por inactividad');
        this.logout();
      }
    }, 300000); // 15 minutos (en producción usa 900000)
  },

  clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  },

  addActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const resetTimer = () => this.resetInactivityTimer();

    // biome-ignore lint/complexity/noForEach: <explanation>
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Guardar referencia para poder removerla
    this.activityHandler = resetTimer;
  },

  removeActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    if (this.activityHandler) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      events.forEach(event => {
        window.removeEventListener(event, this.activityHandler);
      });
    }
  }
};