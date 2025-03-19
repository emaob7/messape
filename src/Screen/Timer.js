import React, { useState, useEffect} from 'react';

function Timer() {
    const [time, setTime] = useState (0);

    useEffect(() => {
        const interval = setInterval (() => {
            setTime ((prevTime) => prevTime + 1);
        },1000);

        return () => clearInterval (interval); // Limpieza
    }, []);

    return <p>Tiempo trancurrido: {time} segundos</p>;
}

export default Timer