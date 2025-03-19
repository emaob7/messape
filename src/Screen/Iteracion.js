function ListaUsuarios({ usuarios }) {
    return (
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>{usuario.nombre}</li>
        ))}
      </ul>
    );
  }
  
  export default function Iteracion() {
    const usuarios = [
      { id: 1, nombre: "Juan" },
      { id: 2, nombre: "Ana" },
      { id: 3, nombre: "Luis" },
    ];
  
    return <ListaUsuarios usuarios={usuarios} />;
  }
  