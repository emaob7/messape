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
  Button,
  IconButton,
} from "@mui/material";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import ExcelExportButton from "../Components/ExcelExportButton";
import PDFExportButton from "../Components/PDFExportButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { openDB } from "idb";

// Configuración de IndexedDB
const setupLocalDB = async () => {
  return openDB("firestoreCache", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("documents")) {
        db.createObjectStore("documents", { keyPath: ["year", "numero"] });
      }
    },
  });
};

const DataView = ({ onRowClick, userRole, userName }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [usingCache, setUsingCache] = useState(true);
  const [needsUpdate, setNeedsUpdate] = useState(false);

  // Cargar datos locales al inicio
  useEffect(() => {
    const loadLocalData = async () => {
      try {
        const localDB = await setupLocalDB();
        const allCachedData = await localDB.getAll("documents");
        const yearData = allCachedData.filter(
          (doc) => doc.year === selectedYear
        );

        setLocalData(yearData);
        if (yearData.length > 0) {
          setData(yearData);
        } else {
          setUsingCache(false);
          fetchData();
        }
      } catch (error) {
        console.error("Error loading local data:", error);
        fetchData();
      }
    };

    loadLocalData();
  }, [selectedYear]);

  // Obtener los datos de Firestore
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, selectedYear), orderBy("numero", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        year: selectedYear,
        ...doc.data(),
      }));

      // Guardar en caché local
      const localDB = await setupLocalDB();
      const tx = localDB.transaction("documents", "readwrite");

      fetchedData.forEach((doc) => {
        tx.store.put(doc);
      });

      await tx.done;

      // Filtrar los datos si el usuario no es admin
      const finalData =
        userRole !== "admin"
          ? fetchedData.filter((row) => !row.confidencial)
          : fetchedData;

      setData(finalData);
      setLocalData(finalData);
      setUsingCache(false);
      setNeedsUpdate(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para forzar actualización desde Firestore
  const handleForceRefresh = () => {
    setUsingCache(false);
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
  const sortedData = filteredData.sort((a, b) => b.numero - a.numero);
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setPage(0);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Vista de Datos - {selectedYear} {usingCache && "💾"}
      </Typography>

      <Grid container spacing={2} alignItems="center">
        {/* Búsqueda general */}
        <Grid item xs={12} sm={3}>
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
        {/* Botón de actualización */}
        <Grid item xs={12} sm={1}>
          <IconButton
            onClick={handleForceRefresh}
            color="primary"
            aria-label="actualizar"
            disabled={isLoading}
            title="Forzar actualización desde Firestore"
          >
            <RefreshIcon />
          </IconButton>
          {needsUpdate && (
            <Typography variant="caption" color="error">
              Actualización disponible
            </Typography>
          )}
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

      {usingCache && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Mostrando datos en caché. Haz clic en el botón de actualización para
          sincronizar con Firestore.
        </Typography>
      )}
    </Container>
  );
};

export default DataView;
