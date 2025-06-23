import { useState, useEffect } from "react";
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
  Select,
} from "@mui/material";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import ExcelExportButton from "../Components/ExcelExportButton";
import PDFExportButton from "../Components/PDFExportButton";

const DataView = ({ onRowClick, userRole, userName }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  ); // Año actual por defecto
  const [isLoading, setIsLoading] = useState(false);

  // Obtener los datos de Firestore según el año seleccionado
  useEffect(() => {
    fetchData();
  }, [userRole, selectedYear]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Usamos la colección correspondiente al año seleccionado
      const q = query(collection(db, selectedYear), orderBy("numero", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filtrar los datos si el usuario no es admin
      if (userRole !== "admin") {
        const filteredData = fetchedData.filter((row) => !row.confidencial);
        setData(filteredData);
      } else {
        setData(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      setData([]); // En caso de error, establecer datos vacíos
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar el cambio de año
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Función para actualizar manualmente los datos
  const handleRefresh = () => {
    fetchData();
  };

  // Función de filtrado unificada
  const filteredData = data.filter((row) => {
    const matchesSearch =
      searchTerm === "" ||
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesYear =
      !yearFilter ||
      new Date(row.fecha).getFullYear() === Number.parseInt(yearFilter, 10);

    const statusConsideredPending = [undefined, null, "", "pendiente"];
    const matchesStatus =
      statusFilter === "todos" ||
      (statusFilter === "pendiente" &&
        (!row.seguimiento ||
          statusConsideredPending.includes(row.seguimiento))) ||
      (statusFilter === "finalizado" && row.seguimiento === "finalizado");

    const matchesConfidentiality = userRole === "admin" || !row.confidencial;

    return (
      matchesSearch && matchesYear && matchesStatus && matchesConfidentiality
    );
  });

  // Calcular los datos paginados
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Resto de las funciones permanecen igual...
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (row) => {
    onRowClick({ ...row, userName2: row.userName });
    navigate("/form2");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Vista de Datos - {selectedYear}
      </Typography>

      <Grid container spacing={2} alignItems="center">
        {/* Botón de actualización 
        <Grid item xs={12} sm={1}>
          <IconButton
            onClick={handleRefresh}
            color="primary"
            aria-label="actualizar"
            disabled={isLoading}
          >
            <RefreshIcon />
          </IconButton>
        </Grid>
        */}

        {/* Búsqueda general */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Buscar"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>

        {/* Selector de colección por año */}
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel>Colección</InputLabel>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              label="Colección"
            >
              {[
                2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
                2035,
              ].map((year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel>Seguimiento</InputLabel>
            <Select
              value={statusFilter}
              label="Seguimiento"
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={!(userRole === "admin" || userRole === "verificador")}
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
            data={filteredData}
            fileName={`datos-${selectedYear}`}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <PDFExportButton
            data={filteredData}
            userRole={userRole}
            fileName={`reporte-${selectedYear}`}
          />
        </Grid>
      </Grid>

      {/* Indicador de carga */}
      {isLoading && (
        <Typography variant="body1" sx={{ my: 2 }}>
          Cargando datos...
        </Typography>
      )}

      {/* Tabla de datos */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table
          sx={{
            "& .MuiTableCell-root": { fontSize: "0.875rem", padding: "8px" },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Remitente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Resumen</TableCell>
              <TableCell>Observación</TableCell>
              <TableCell>Usuario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow
                key={row.numero}
                hover
                onClick={() => handleRowClick(row)}
                sx={{
                  cursor: "pointer",
                  borderLeft:
                    !row.seguimiento || row.seguimiento === "pendiente"
                      ? "4px solid #FFA726"
                      : row.seguimiento === "finalizado"
                      ? "4px solid #66BB6A"
                      : row.confidencial
                      ? "4px solid #42A5F5"
                      : "none",
                  backgroundColor: row.confidencial ? "#b3e5fc" : "inherit",
                }}
              >
                <TableCell>{row.numero}</TableCell>
                <TableCell>{row.remitente}</TableCell>
                <TableCell>{row.fecha}</TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.875rem",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  {row.resumen}
                </TableCell>
                <TableCell>{row.observacion}</TableCell>
                <TableCell>{row.userName}</TableCell>
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
