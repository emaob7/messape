import React from 'react';
import * as XLSX from 'xlsx';
import { Button} from '@mui/material';

const ExcelExportButton = ({ data }) => {
  
  const handleExport = () => {
    if (data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, 'datos_exportados.xlsx');
  };

  return (
    <Button 
      variant="contained" 
      onClick={handleExport}
      fullWidth
      sx={{ height: '56px' }}
    >
      Exportar Excel
    </Button>
  );
};

export default ExcelExportButton;