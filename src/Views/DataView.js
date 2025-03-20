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
  Grid
} from '@mui/material';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Asegúrate de importar tu configuración de Firestore
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import ExcelExportButton from '../Components/ExcelExportButton';

const DataView = ({ onRowClick, userRole, userName }) => {
  const navigate = useNavigate(); // Hook para navegación programática
  const [data, setData] = useState([]); // Datos extraídos de Firestore
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [page, setPage] = useState(0); // Página actual
  const [rowsPerPage, setRowsPerPage] = useState(10); // Filas por página
  const [year, setYear] = useState(new Date().getFullYear()); // Estado para el año seleccionado

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
      navigate('/form2'); // Navegar al formulario
    };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Vista de Datos
      </Typography>

      <Grid container spacing={2}>
  {/* Campo de búsqueda - Ocupa 8 columnas */}
  <Grid item xs={12} sm={6}>
    <TextField
      label="Buscar"
      variant="outlined"
      fullWidth
      margin="normal"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </Grid>

  {/* Botón de exportar a Excel - Ocupa 4 columnas */}
  <Grid item xs={12} sm={6}>
    <ExcelExportButton data={data} year={year} setYear={setYear} />
  </Grid>
</Grid>
      {/* Tabla de datos */}
      <TableContainer component={Paper}>
      <Table sx={{ '& .MuiTableCell-root': { fontSize: '0.875rem', padding: '8px' } }}>
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Remitente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Resumen</TableCell>
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
                <TableCell sx={{ fontSize: '0.875rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>{row.resumen}</TableCell>
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