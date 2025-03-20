import React from 'react';
import * as XLSX from 'xlsx';
import { Button, TextField, Grid, Box } from '@mui/material';

const ExcelExportButton = ({ data, year,setYear,userRole }) => {
  const handleExport = () => {
    // Filtrar los datos por el año seleccionado
    const filteredData = data.filter((row) => {
      const rowYear = new Date(row.fecha).getFullYear();
      return rowYear === parseInt(year, 10);
    });

       // Filtrar los datos según el rol del usuario
       let finalData = filteredData;
       if (userRole !== 'admin') {
         finalData = filteredData.filter((row) => !row.confidencial); // Solo datos no confidenciales
       }

        // Verificar si hay datos después del filtrado
    if (finalData.length === 0) {
      alert('No hay datos para descargar para el año seleccionado.');
      return;
    }

    // Crear un nuevo libro de Excel
    const ws = XLSX.utils.json_to_sheet(finalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');

    // Descargar el archivo Excel
    XLSX.writeFile(wb, `datos_${year}.xlsx`);
  };

  return (
<Grid container spacing={2}>
  {/* Campo de año - Ocupa 3 columnas */}
  <Grid item xs={12} sm={6}>
    <TextField
      label="Elige año a exportar"
      variant="outlined"
      type="number"
      fullWidth
      margin="normal"
      value={year}
      onChange={(e) => setYear(e.target.value)}
    />
  </Grid>

  {/* Botón de exportar - Ocupa 3 columnas */}
  <Grid item xs={12} sm={6}>
  <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
    <Button variant="contained" color="primary"  sx={{ height: "56px", mt: 1 }} onClick={handleExport} fullWidth>
      Exportar a Excel
    </Button>
    </Box>
  </Grid>
</Grid>
  );
};

export default ExcelExportButton;