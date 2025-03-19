import { useState } from "react";

function TodoList (){
    const [todos, setTodos] = useState ([]);
    const [task, setTask] = useState ("");

    const addTask = () => {
        setTodos ([... todos, task]);
        setTask("");
    };

    return (
        <div>
            <input value={task} onChange={(e) => setTask(e.target.value)}/>
            <button onClick={addTask}>Añadir Tarea </button>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>{todo}</li>
                ))}
            </ul>
        </div>
    )
}

export default TodoList