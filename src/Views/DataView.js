import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
} from '@mui/material';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Asegúrate de importar tu configuración de Firestore
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

const DataView = ({ onRowClick, userRole, userName }) => {
  const navigate = useNavigate(); // Hook para navegación programática
  const [data, setData] = useState([]); // Datos extraídos de Firestore
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(10); // Filas por página

  // Extraer los datos de Firestore
// Obtener los datos de Firestore
useEffect(() => {
  const fetchData = async () => {
    const q = query(collection(db, 'formularios'), orderBy('numero', "desc"));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Filtrar los datos si el usuario no es admin
    if (userRole !== 'admin') {
      const filteredData = fetchedData.filter((row) => !row.confidencial);
      setData(filteredData);
    } else {
      setData(fetchedData);
    }
  };

  fetchData();
}, [userRole]);

  // Filtrar los datos basados en el término de búsqueda
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Cambiar de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Cambiar el número de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calcular los datos paginados
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


    // Manejar clic en una fila
    const handleRowClick = (row) => {
      onRowClick(row); // Pasar los datos al formulario
      navigate('/form1'); // Navegar al formulario
    };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Vista de Datos
      </Typography>

      {/* Campo de búsqueda */}
      <TextField
        label="Buscar"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Tabla de datos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Remitente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Observación</TableCell>
              <TableCell>Usuario</TableCell>

              {/* Agrega más columnas según sea necesario */}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow
              key={row.numero}
              hover
              onClick={() => handleRowClick(row)} // Manejar clic en la fila
              style={{ cursor: 'pointer', backgroundColor: row.confidencial ? '#b3e5fc' : 'inherit' }} // R
              >
                <TableCell>{row.numero}</TableCell>
                <TableCell>{row.remitente}</TableCell>
                <TableCell>{row.fecha}</TableCell>
                <TableCell>{row.descripcion}</TableCell>
                <TableCell>{row.observacion}</TableCell>
                <TableCell>{row.userName}</TableCell>
                {/* Agrega más celdas según sea necesario */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default DataView;