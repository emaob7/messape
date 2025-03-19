import React from 'react';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Asegúrate de importar tu configuración de Firestore
import * as XLSX from 'xlsx';

const DownloadExcelButton = ({userRole}) => {
  // Función para obtener los datos de Firestore y generar el Excel
  const handleDownload = async () => {
    try {
      // Obtener los documentos de la colección "formularios" ordenados por "numero"
      const q = query(collection(db, 'formularios'), orderBy('numero'));
      const querySnapshot = await getDocs(q);

      // Convertir los documentos a un array de objetos
      let data = querySnapshot.docs.map((doc) => doc.data());

      // Verificar si hay datos
      if (data.length === 0) {
        alert('No hay datos para descargar.');
        return;
      }

      // Filtrar los datos según el rol del usuario
      if (userRole === 'admin') {
        // Si es admin, descargar todos los datos (incluidos los confidenciales)
        data = data; // No se filtra nada
      } else {
        // Si no es admin, descargar solo los datos no confidenciales
        data = data.filter((row) => !row.confidencial);
      }
      // Crear una hoja de cálculo con los datos
      const worksheet = XLSX.utils.json_to_sheet(data);

        // Ajustar el ancho de las columnas
        worksheet['!cols'] = [
            { wch: 5 }, // Ancho para la columna "numero"
            { wch: 10 }, // Ancho para la columna "fecha"
            { wch: 20 }, // Ancho para la columna "remitente"
            { wch: 50 }, // Ancho para la columna "descripcion" (más ancha)
            { wch: 50 }, // Ancho para la columna "observacion" (más ancha)
            // Ajusta el ancho de otras columnas según sea necesario
          ];

      // Crear un libro de trabajo y agregar la hoja de cálculo
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Formularios');

      // Generar el archivo Excel
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      // Crear un Blob y descargar el archivo
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'formularios.xlsx'; // Nombre del archivo
      link.click();

      // Liberar el objeto URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar los datos: ', error.message);
      alert('Hubo un error al descargar los datos: ' + error.message);
    }
  };

  return (
   
        


<Button
onClick={handleDownload}
variant="text" // Esto hace que sea solo texto
color="inherit"
endIcon={<DownloadIcon />} // Acá le agregás el icono a la izquierda
sx={{
    textTransform: 'none',
    padding: 0,
    minWidth: 'auto',
    marginLeft:2
   // gap: 0.5, // Espaciado entre el icono y el texto (opcional)
}}
>
EXCEL
</Button>
     
  );
};

export default DownloadExcelButton;