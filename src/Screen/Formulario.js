import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const Formulario = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [errores, setErrores] = useState({});

  const validarFormulario = () => {
    let nuevosErrores = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }
    if (!email.includes("@")) {
      nuevosErrores.email = "El email no es válido";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      alert("Formulario enviado correctamente");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h5">Formulario con Material UI</Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nombre"
          variant="outlined"
          margin="normal"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          error={!!errores.nombre}
          helperText={errores.nombre}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errores.email}
          helperText={errores.email}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Enviar
        </Button>
      </form>
    </Container>
  );
};

export default Formulario;
