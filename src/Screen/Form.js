const { useState } = require("react");

function Form () {
    const [inputValue, setInputValue] = useState ("");

    const handleChange = (event) => {
        setInputValue(event.target.value);

    };

    return (
        <div>
        <input type="text" value={inputValue} onChange={handleChange} />
        <p>Valor: {inputValue} </p>
        </div>
    );
    }
export default Form