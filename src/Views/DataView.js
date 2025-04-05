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
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select
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
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

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

 // Función de filtrado unificada
 const filteredData = data.filter((row) => {
  // Filtro por búsqueda general
  const matchesSearch = searchTerm === '' || 
    Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  // Filtro por año
  const matchesYear = !yearFilter || 
    new Date(row.fecha).getFullYear() === parseInt(yearFilter, 10);
  
    const statusConsideredPending = [undefined, null, '', 'pendiente'];
    const matchesStatus = statusFilter === 'todos' || 
                         (statusFilter === 'pendiente' && (!row.seguimiento || statusConsideredPending.includes(row.seguimiento))) ||
                         (statusFilter === 'finalizado' && row.seguimiento === 'finalizado');
  
  // Filtro por confidencialidad
  const matchesConfidentiality = userRole === 'admin' || !row.confidencial;
  
  return matchesSearch && matchesYear && matchesStatus && matchesConfidentiality;
});

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
  onRowClick({ ...row, userName: row.userName }); // Pasar los datos al formulario, incluyendo userName
  navigate('/form2'); // Navegar al formulario form2
};

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Vista de Datos
      </Typography>

      <Grid container spacing={2}>
  {/* Búsqueda general */}
  <Grid item xs={12} sm={6}>
    <TextField
      label="Buscar"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </Grid>
  
   {/* Filtro por año - Versión mejorada */}
   <Grid item xs={12} sm={2}>
    <TextField
      label="Año"
      type="number"
      fullWidth
      value={yearFilter || new Date().getFullYear()}
      onChange={(e) => setYearFilter(e.target.value)}
      InputProps={{
        inputProps: { 
          min: 2000, 
          max: new Date().getFullYear() + 1,
        },
      }}
      sx={{
        '& input[type=number]': {
          '-moz-appearance': 'textfield',
        },
        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0,
        },
      }}
    />
  </Grid>
  
  <Grid item xs={12} sm={2}>
  <FormControl fullWidth>
    <InputLabel>Seguimiento</InputLabel>
    <Select
      value={statusFilter}
      label="Seguimiento"
      onChange={(e) => setStatusFilter(e.target.value)}
      disabled={!(userRole === 'admin' || userRole === 'verificador')}
    >
      <MenuItem value="todos">Todos</MenuItem>
      <MenuItem value="pendiente">Pendiente</MenuItem>
      <MenuItem value="finalizado">Finalizado</MenuItem>
    </Select>
  </FormControl>
</Grid>
  
  {/* Botón exportar */}
  <Grid item xs={12} sm={2}>
    <ExcelExportButton 
      data={filteredData} // Pasamos los datos ya filtrados
    />
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
            onClick={() => handleRowClick(row)}
            sx={{
              cursor: 'pointer',
              borderLeft: 
                !row.seguimiento || row.seguimiento === 'pendiente' ? '4px solid #FFA726' :
                row.seguimiento === 'finalizado' ? '4px solid #66BB6A' :
                row.confidencial ? '4px solid #42A5F5' : 'none',
              backgroundColor: row.confidencial ? '#b3e5fc' : 'inherit',
            }}
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