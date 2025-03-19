import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fakeAuth } from './Auth'; // Importar fakeAuth
import { TextField, Button, Box, Typography, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = ({ setUpdate }) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true); // Activa el estado de carga
    await fakeAuth.login(pin, navigate, setUpdate); // Simula el login
    setLoading(false); // Desactiva el estado de carga
  };

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" gutterBottom>
        Iniciar Sesión
      </Typography>
      <TextField
        label="Ingrese su PIN"
        variant="outlined"
        type={showPin ? 'text' : 'password'}
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // Detectar la tecla Enter
        inputProps={{ maxLength: 5 }}
        style={{ marginBottom: '20px' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPin(!showPin)} edge="end">
                {showPin ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <br />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleLogin} 
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Ingresar'}
      </Button>
    </Box>
  );
};

export default Login;
