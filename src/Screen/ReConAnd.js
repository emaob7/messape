function Notificacion({ tieneMensajes }) {
    return (
      <div>
        <h1>Bienvenido</h1>
        {tieneMensajes && <p>Tienes nuevos mensajes</p>}
      </div>
    );
  }
  
  export default function App() {
    return <Notificacion tieneMensajes={true} />;
  }
  