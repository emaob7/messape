import './App.css';
import React, { useState } from 'react';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import Form1 from './Views/Form1';
import Form2 from './Views/Form2';
import DownloadExcelButton from './Components/DownloadExcelButton';
import DataView from './Views/DataView';
import LogoutIcon from '@mui/icons-material/Logout';
import UserManagement from './Views/UserManagement';
import Login from './Sesion/Login';
import { fakeAuth } from './Sesion/Auth'; // Importar fakeAuth
import "@fontsource/roboto"; // Importa Roboto

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});



// Barra de navegación (solo se muestra si está logueado)
const Navigation = ({ setUpdate }) => {
  const navigate = useNavigate(); // Obtener `navigate`

  return (
    <AppBar position="fixed">
      <Toolbar>
     
{fakeAuth.userRole !== 'verificador' && (
  <Button color="inherit" component={Link} to="/form1">
    Registrar
  </Button>
)}
       
        <Button color="inherit" component={Link} to="/datos">Ver Datos</Button>


        {/* {fakeAuth.userRole === 'admin' && <DownloadExcelButton />} */}
        {fakeAuth.userRole !== 'verificador' && (
          <DownloadExcelButton
          userRole = {fakeAuth.userRole}
          />
        )}

        {/* Botón de logout */}
        <Box sx={{ marginLeft: 'auto' }} />
        {fakeAuth.userRole === 'admin' && (
  <Button color="inherit" component={Link} to="/gestion-usuarios">
    Gestión de Usuarios
  </Button>
)}
        <Button
          color="inherit"
          endIcon={<LogoutIcon/>}
          onClick={() => fakeAuth.logout(navigate, setUpdate)} // Pasar `setUpdate` como argumento
        >
          Salir
        </Button>
      </Toolbar>
    </AppBar>
  );
};



// Componente principal con lógica condicional
const App = () => {
  const [selectedRow, setSelectedRow] = useState(null); // Registro seleccionado
  const [update, setUpdate] = useState(false); // Estado para forzar la actualización

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ mt: 10 }}>
    <Router>
      {fakeAuth.isAuthenticated ? (
        // Si está logueado, muestra la barra y las rutas protegidas
        <>
          <Navigation setUpdate={setUpdate} />
          <Routes>
            <Route path="/" element={<Navigate to="/form1" />} />
            <Route
             path="/gestion-usuarios"
              element={
              fakeAuth.userRole === 'admin' ? (
               <UserManagement />
                ) : (
                <Navigate to="/form1" />
                )
                }
                />

<Route
  path="/form1"
  element={
    fakeAuth.userRole === 'verificador' ? (
      <Navigate to="/datos" replace />
    ) : (
      <Form1
        userRole={fakeAuth.userRole}
        userName={fakeAuth.userName}
      />
    )
  }
/>

<Route
  path="/form2"
  element={
    fakeAuth.userRole === 'verificador' ? (
      <Navigate to="/datos" replace />
    ) : (
      <Form2
        selectedRow={selectedRow}
        userRole={fakeAuth.userRole}
        userName={fakeAuth.userName}
      />
    )
  }
/>
            <Route
              path="/form1"
              element={
                  <Form1
                    userRole={fakeAuth.userRole} // Pasar el rol del usuario
                    userName={fakeAuth.userName} // Pasar el nombre del usuario
                  />
              }
              
            />
            <Route
              path="/form2"
              element={
                  <Form2
                    selectedRow={selectedRow}
                    onCancel={() => setSelectedRow(null)}
                    userRole={fakeAuth.userRole} // Pasar el rol del usuario
                    userName={fakeAuth.userName} // Pasar el nombre del usuario
                  />
              }
              
            />
            {/* Ruta para ver datos (todos los usuarios) */}
            <Route
              path="/datos"
              element={
                <DataView
                  onRowClick={(row) => setSelectedRow(row)}
                  userRole={fakeAuth.userRole} // Pasar el rol del usuario
                />
              }
            />
           
            <Route path="*" element={<Navigate to="/form1" />} />
          </Routes>
        </>
      ) : (
        // Si NO está logueado, solo muestra el login y nada más
        <Routes>
          <Route path="/" element={<Login setUpdate={setUpdate} />} />
          <Route path="/login" element={<Login setUpdate={setUpdate} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
    </Box>
    </ThemeProvider>
  );
};

export default App;