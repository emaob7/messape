import { Button, Tooltip, CircularProgress } from "@mui/material";
import html2pdf from "html2pdf.js";
import { useState } from "react";

const PDFExportButton = ({
  data,
  userRole,
  fileName = "reporte",
  useLocalData = false,
  localData = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const hasPermission = ["admin", "verificador"].includes(userRole);

  const handleExport = async () => {
    if (!hasPermission) return;

    try {
      setIsLoading(true);

      // Determinar qué datos usar
      const exportData = useLocalData ? localData : data;

      if (!exportData || exportData.length === 0) {
        alert("No hay datos para exportar");
        return;
      }

      // Ordenar datos por número descendente
      const sortedData = [...exportData].sort((a, b) => b.numero - a.numero);

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
              margin-top: 10px;
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
            .subtitle {
              font-size: 12px;
              color: #555;
              margin-bottom: 5px;
            }
            .confidencial {
              background-color: #ffebee;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Registro de Documentos - ${
              useLocalData ? "Datos Locales" : "Datos Actuales"
            }</h2>
            <p class="subtitle">Fecha de exportación: ${new Date().toLocaleString()}</p>
            <p class="subtitle">Total de registros: ${sortedData.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Remitente</th>
                <th>Fecha</th>
                <th>Resumen</th>
                <th>Usuario</th>
                <th>Seguimiento</th>
                <th>Última Modificación</th>
              </tr>
            </thead>
            <tbody>
              ${sortedData
                .map(
                  (item) => `
                <tr class="${item.confidencial ? "confidencial" : ""}">
                  <td>${item.numero || ""}</td>
                  <td>${item.remitente || ""}</td>
                  <td>${item.fecha || ""}</td>
                  <td>${
                    item.resumen
                      ? item.resumen.substring(0, 50) +
                        (item.resumen.length > 50 ? "..." : "")
                      : ""
                  }</td>
                  <td>${item.userName || ""}</td>
                  <td>${item.seguimiento || "pendiente"}</td>
                  <td>${
                    item.lastModified
                      ? new Date(item.lastModified).toLocaleString()
                      : "N/A"
                  }</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;

      // Configuración de html2pdf
      const options = {
        margin: 10,
        filename: `${fileName}_${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "landscape",
        },
      };

      // Generar PDF
      await html2pdf().from(content).set(options).save();
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Ocurrió un error al generar el PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip
      title={
        !hasPermission
          ? "No tienes permisos para esta acción"
          : useLocalData
          ? "Exportar PDF con datos locales"
          : "Exportar PDF con datos actuales"
      }
    >
      <div>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={
            !hasPermission ||
            isLoading ||
            (useLocalData && localData.length === 0) ||
            (!useLocalData && data.length === 0)
          }
          fullWidth
          sx={{
            height: "56px",
            position: "relative",
            backgroundColor: useLocalData ? "#e3f2fd" : undefined,
          }}
        >
          {isLoading ? (
            <>
              Generando PDF...
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  right: "16px",
                  color: "inherit",
                }}
              />
            </>
          ) : (
            `PDF (${useLocalData ? "Local" : "Actual"})`
          )}
        </Button>
        {useLocalData && localData.length > 0 && (
          <small
            style={{ display: "block", textAlign: "center", marginTop: "4px" }}
          >
            {localData.length} registros locales
          </small>
        )}
      </div>
    </Tooltip>
  );
};

export default PDFExportButton;
