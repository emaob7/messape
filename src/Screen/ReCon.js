function Mensaje({ esAdmin }) {
    if (esAdmin) {
      return <h1>Bienvenido, Administrador</h1>;
    }
    return <h1>Bienvenido, Usuario</h1>;
  }
  
  export default function ReCon() {
    return <Mensaje esAdmin={true} />;
  }
  