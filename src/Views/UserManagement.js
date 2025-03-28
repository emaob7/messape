import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Grid
} from '@mui/material';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    pin: '',
    name: '',
    role: 'carga',
  });
  const [editingUser, setEditingUser] = useState(null); // Estado para el usuario en edición
  const [editPin, setEditPin] = useState(''); // Estado para el nuevo PIN
  const [editName, setEditName] = useState(''); // Estado para el nuevo nombre

  // Obtener la lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  // Manejar cambios en el formulario de nuevo usuario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Agregar un nuevo usuario
  const handleAddUser = async () => {
    try {
      await addDoc(collection(db, 'users'), newUser);
      alert('Usuario agregado exitosamente');
      setNewUser({ pin: '', name: '', role: 'carga' }); // Limpiar el formulario
      // Actualizar la lista de usuarios
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error al agregar usuario:', error.message);
      alert('Hubo un error al agregar el usuario: ' + error.message);
    }
  };


  //eliminar user

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
    
    if (!confirmDelete) {
      return; // Si el usuario cancela, se detiene la ejecución
    }
  
    try {
      await deleteDoc(doc(db, 'users', id));
      alert('Usuario eliminado exitosamente');
  
      // Actualizar la lista de usuarios
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error al eliminar usuario:', error.message);
      alert('Hubo un error al eliminar el usuario: ' + error.message);
    }
  };
  

  // Iniciar la edición de un usuario
  const handleEditUser = (user) => {
    setEditingUser(user.id); // Establecer el ID del usuario en edición
    setEditPin(user.pin); // Establecer el PIN actual en el campo de edición
    setEditName(user.name); // Establecer el nombre actual en el campo de edición
  };

  // Guardar los cambios del usuario
  const handleSaveUser = async (id) => {
    try {
      await updateDoc(doc(db, 'users', id), {
        pin: editPin,
        name: editName, // Actualizar el nombre
      });
      alert('Usuario actualizado exitosamente');
      setEditingUser(null); // Salir del modo de edición
      // Actualizar la lista de usuarios
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error.message);
      alert('Hubo un error al actualizar el usuario: ' + error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>
      <Typography variant="subtitle2" paragraph>
  <strong>a -</strong> El <strong>Admin</strong> tiene acceso completo a todas las funciones, y <strong>es el unico que podrá acceder</strong> a los datos de las Notas Confidenciales y a la sección de Gestión de Usuarios, también es el unico que podra eliminar datos.
</Typography>

<Typography variant="subtitle2" paragraph>
  <strong>b -</strong> El Rol <strong>Alterno</strong> tiene acceso a todas las funciones de carga, providencia, ver datos cargados y descarga de Excel <strong>sin los datos de Notas Confidenciales.</strong>
</Typography>

<Typography variant="subtitle2" paragraph>
  <strong>c -</strong> El Rol <strong>Carga</strong> solo tendrá acceso a cargar la seccion de inicio y ver los datos cargados y descarga de Excel <strong>sin los datos de Notas Confidenciales.</strong>
</Typography>
<Typography variant="subtitle2" paragraph>
  <strong>c -</strong> El Rol <strong>Verificador</strong> solo tendrá acceso para ver los datos cargados, podra verificar el estado pendiente y finalizado de las notas y descargar un Excel segun el filtro que aplique<strong>sin los datos de Notas Confidenciales.</strong>
</Typography>
      <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}> 
    <Grid item xs={12} sm={3}> 
      <TextField
        label="PIN"
        name="pin"
        value={newUser.pin}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Grid>

    <Grid item xs={12} sm={3}>
      <TextField
        label="Nombre"
        name="name"
        value={newUser.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Grid>

    <Grid item xs={12} sm={3}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Rol</InputLabel>
        <Select name="role" value={newUser.role} onChange={handleChange}>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="carga">Carga</MenuItem>
          <MenuItem value="alterno">Alterno</MenuItem>
          <MenuItem value="verificador">Verificador</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    </Grid>
        <Button variant="contained" color="primary" onClick={handleAddUser}>
         + Agregar Usuario
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PIN</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {editingUser === user.id ? (
                    <TextField
                      value={editPin}
                      onChange={(e) => setEditPin(e.target.value)}
                      size="small"
                    />
                  ) : (
                    user.pin
                  )}
                </TableCell>
                <TableCell>
                  {editingUser === user.id ? (
                    <TextField
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      size="small"
                    />
                  ) : (
                    user.name
                  )}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {editingUser === user.id ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveUser(user.id)}
                        sx={{ mr: 1 }}
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setEditingUser(null)}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditUser(user)}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserManagement;