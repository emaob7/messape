import { Button, Tooltip } from '@mui/material';
import html2pdf from 'html2pdf.js';

const PDFExportButton = ({ data, userRole }) => {
    const hasPermission = ['admin', 'verificador'].includes(userRole);
  const handleExport = () => {
    if (data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear contenido HTML para el PDF
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 4px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .header {
            text-align: center;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Registro de Documentos</h2>
          <p>Fecha de exportación: ${new Date().toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Remitente</th>
              <th>Usuario Registrador</th>
              <th>Fecha Registro</th>
              <th>Último Usuario Modificador</th>
              <th>Última Modificación</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                <td>${item.numero || ''}</td>
                <td>${item.remitente || ''}</td>
                <td>${item.userName || ''}</td>
                <td>${item.fecha ? new Date(item.fecha).toLocaleDateString() : ''}</td>
                <td>${item.userName2 || ''}</td>
                <td>${item.lastModified ? new Date(item.lastModified).toLocaleString() : ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Configuración de html2pdf
    const options = {
      margin: 10,
      filename: 'registro_documentos.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4',
        orientation: 'landscape' // Hoja horizontal
      }
    };

    // Generar PDF
    html2pdf().from(content).set(options).save();
  };

  return (
  <Tooltip title={!hasPermission ? "No tienes permisos para esta acción" : ""}>
      <span> {/* Wrap necesario para el tooltip con elementos deshabilitados */}
        <Button 
          variant="contained" 
          onClick={handleExport}
          disabled={!hasPermission}
      fullWidth
      sx={{ height: '56px' }}
    >
      Reporte de cambios
    </Button>
     </span>
    </Tooltip>
  );
};

export default PDFExportButton;