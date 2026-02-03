import { useState } from "react";
import * as XLSX from "xlsx";
import { Button, Tooltip, CircularProgress } from "@mui/material";

const ExcelExportButton = ({
  data,
  fileName = "datos_exportados",
  useLocalData = false,
  localData = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    try {
      setIsLoading(true);

      // Determinar qué datos usar
      const exportData = useLocalData ? localData : data;

      if (!exportData || exportData.length === 0) {
        alert("No hay datos para exportar");
        return;
      }

      // Preparar datos para Excel
      const cleanData = exportData.map((item) => {
        const cleanItem = { ...item };
        // Eliminar campos internos que no queremos exportar
        delete cleanItem.id;
        delete cleanItem.year;
        return cleanItem;
      });

      const worksheet = XLSX.utils.json_to_sheet(cleanData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

      // Crear nombre de archivo con fecha
      const dateStr = new Date().toISOString().slice(0, 10);
      const finalFileName = `${fileName}_${dateStr}.xlsx`;

      XLSX.writeFile(workbook, finalFileName);
    } catch (error) {
      console.error("Error exportando datos:", error);
      alert("Ocurrió un error al exportar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip
      title={
        useLocalData ? "Exportar datos locales" : "Exportar datos actuales"
      }
    >
      <div>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={
            isLoading ||
            (useLocalData && localData.length === 0) ||
            (!useLocalData && data.length === 0)
          }
          fullWidth
          sx={{ height: "56px", position: "relative" }}
        >
          {isLoading ? (
            <>
              Exportando...
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
            `Exportar Excel (${useLocalData ? "Local" : "Actual"})`
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

export default ExcelExportButton;
