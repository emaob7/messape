import { useState } from "react";

function ListaTareas() {
  const [tareas, setTareas] = useState(["Aprender React", "Hacer ejercicio"]);

  const agregarTarea = () => {
    setTareas([...tareas, "Nueva tarea"]);
  };

  return (
    <div>
      <ul>
        {tareas.map((tarea, index) => (
          <li key={index}>{tarea}</li>
        ))}
      </ul>
      <button onClick={agregarTarea}>Agregar tarea</button>
    </div>
  );
}

export default function ListaDi() {
  return <ListaTareas />;
}
