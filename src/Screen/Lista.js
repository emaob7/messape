function ListaProductos() {
    const productos = [
      { id: "a1", nombre: "Laptop" },
      { id: "b2", nombre: "Mouse" },
      { id: "c3", nombre: "Teclado" },
    ];
  
    return (
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>{producto.nombre}</li>
        ))}
      </ul>
    );
  }
  
  export default function Lista() {
    return <ListaProductos />;
  }
  