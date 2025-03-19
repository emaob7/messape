import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Container, Box } from "@mui/material";

// Simulación de autenticación
const fakeAuth = {
  isAuthenticated: false,
  login(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100);
  },
  logout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

// Barra de navegación
const Navigation = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Inicio
        </Button>
        <Button color="inherit" component={Link} to="/details/1">
          Detalles
        </Button>
        <Button color="inherit" component={Link} to="/protected">
          Protegido
        </Button>
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

// Página de inicio
const Home = () => (
  <Container>
    <Box textAlign="center" mt={4}>
      <Typography variant="h4">Bienvenido a la App</Typography>
      <Typography variant="body1">Explora nuestras rutas con React Router y Material UI.</Typography>
    </Box>
  </Container>
);

// Página de detalles con parámetros dinámicos
const Details = () => {
  const { id } = useParams();
  return (
    <Container>
      <Box textAlign="center" mt={4}>
        <Typography variant="h4">Detalles del Producto</Typography>
        <Typography variant="body1">Estás viendo el producto con ID: {id}</Typography>
      </Box>
    </Container>
  );
};

// Página protegida
const ProtectedPage = () => (
  <Container>
    <Box textAlign="center" mt={4}>
      <Typography variant="h4">⚡ Página Protegida ⚡</Typography>
      <Typography variant="body1">Solo puedes ver esta página si estás autenticado.</Typography>
    </Box>
  </Container>
);

// Componente de ruta protegida
const PrivateRoute = ({ children }) => {
  return fakeAuth.isAuthenticated ? children : <Navigate to="/login" />;
};

// Página de Login
const Login = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    fakeAuth.login(() => {
      navigate("/protected");
    });
  };

  return (
    <Container>
      <Box textAlign="center" mt={4}>
        <Typography variant="h4">Iniciar Sesión</Typography>
        <Button variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2 }}>
          Ingresar
        </Button>
      </Box>
    </Container>
  );
};

// Componente principal con enrutamiento
const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/protected" element={<PrivateRoute><ProtectedPage /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
