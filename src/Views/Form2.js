import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Grid,
  Tabs,
  Tab,
  Box,
  Checkbox, 
  FormControlLabel
} from '@mui/material';
import {
  AddHome as InicioIcon, // Icono para la pestaña "Inicio"
  Verified as MientrasIcon, // Icono para la pestaña "Mientras"
  Grading as FinIcon, // Icono para la pestaña "Fin"
} from '@mui/icons-material';
import { db } from '../firebaseConfig';
import { doc, setDoc, deleteDoc } from 'firebase/firestore'; // Importa setDoc, deleteDoc y getDoc
import DeleteIcon from '@mui/icons-material/Delete'; // Icono para el botón de eliminar
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import html2pdf from 'html2pdf.js'; // Importar html2pdf
import logo from '../assets/logo.png';

const Form2 = ({ selectedRow, userRole }) => {
  const [formData, setFormData] = useState({
    numero: '',
    fecha: '',
    remitente: '',
    resumen: '',
    nroRecepcion: '',
    fechaRecepcion: '',
    descripcion: '',
    estado: '',
    seguimiento:'',
    destinatarios: '',
    providencia: '',
    recepcion: '',
    ME: '',
    docsol: '',
    ndic: '',
    nres: '',
    docsol2: '',
    destinatario2: '',
    cargo: '',
    dependencia: '',
    recepcion2: '',
    observacion: '',
    confidencial: false, // Nuevo campo para indicar si es confidencial
  });
  const [userName, setUsername] = useState("01");
  const [tabValue, setTabValue] = useState(0);
  const [folio, setFolio] = useState("01");

    // Cargar los datos seleccionados en el formulario
    useEffect(() => {
      if (selectedRow) {
        setFormData(selectedRow);
        setUsername(selectedRow.userName)
      }
    }, [selectedRow]);

      // Ajustar el valor de `tabValue` cuando cambia el rol

  

      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: type === 'checkbox' ? checked : value, // Manejar checkbox
        }));
      };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };





// Función para guardar un registro
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.numero || !formData.remitente) {
    alert('Complete los campos obligatorios');
    return;
  }

  let finalUserName = userName;
  
  if (!finalUserName || finalUserName.trim() === "") {
    const input = window.prompt("Por favor ingresa el nombre del usuario que cargo esta nota en MAYÚSCULAS:");
    if (!input || input.trim() === "") {
      alert('Debes ingresar un nombre de usuario');
      return;
    }
    finalUserName = input.toUpperCase();
  }

  try {
    await setDoc(doc(db, 'formularios', formData.numero), {
      ...formData,
      userName: finalUserName
    });
    alert('Guardado exitoso');
    limpiar();
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
// limpiar

const limpiar = () =>{
   setFormData({
    numero: '',
    fecha: '',
    remitente: '',
    resumen: '',
    nroRecepcion: '',
    fechaRecepcion: '',
    descripcion: '',
    estado: '',
    seguimiento:'',
    destinatarios: '',
    providencia: '',
    recepcion: '',
    ME: '',
    docsol: '',
    ndic: '',
    nres: '',
    docsol2: '',
    destinatario2: '',
    cargo: '',
    dependencia: '',
    recepcion2: '',
    observacion: '',
    confidencial: false, // Nuevo campo para indicar si es confidencial
  });
}
// Función para eliminar un registro
const handleDelete = async () => {
  try {
    if (!formData.numero) {
      alert('No hay un registro seleccionado para eliminar.');
      return;
    }

    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este registro?');
    if (!confirmDelete) {
      return; // Si el usuario cancela, se detiene la ejecución
    }

    // Elimina el documento de Firestore usando el campo "numero" como ID
    await deleteDoc(doc(db, 'formularios', formData.numero));
    alert('Registro eliminado exitosamente');

    // Limpia el formulario
    limpiar();
  } catch (error) {
    console.error('Error al eliminar el registro: ', error.message);
    alert('Hubo un error al eliminar el registro: ' + error.message);
  }
};


  // Función para generar el PDF
  const generatePDF = () => {
    // Crear el contenido HTML dinámico
    const content = `
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carátula M.E.</title>
    <style>
        body {
                font-family: Arial, sans-serif;
                margin: 10px;
                padding: 10px;
                font-size: calc(100% - 2px); /* Reduce el tamaño de la fuente en 2px */
                position: relative; /* Necesario para posicionar el membrete */
            }
        h2 {
                text-align: center;
                text-transform: uppercase;
                margin-top: 65px; /* Margen superior para evitar superposición con la imagen */
            }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        td, th {
            border: 0.5px solid gray; 
            border-width: 0.5px; 
            padding: 8px;
            text-align: left;
        }
        th, td {
            border: 0.5px solid gray; 
            border-width: 0.5px; 
            padding: 8px;
            text-align: left;
            height: 20px; /* Alto fijo para todas las celdas */
        }
        .bold {
            font-weight: bold;
        }
        .center {
            text-align: center;
        }
        .spacer {
            height: 20px;
        }
            th {
    background-color: #bdbdbd; /* Gris claro */
}
     .logo {
                position: absolute; /* Posiciona la imagen de manera absoluta */
                top: 5px; /* Distancia desde la parte superior */
                left: 5px; /* Distancia desde la izquierda */
                width: 140px; /* Ajusta el tamaño de la imagen */
                height: auto; /* Mantiene la proporción de la imagen */
            }
    </style>
</head>
<body>
    <div>
     <img class="logo" src="${logo}" alt="Logo" />
    </div>
    <h2>Providencia y Remisión de Notas Internas del Rectorado - Año: 2025</h2>
    <table>
        <!-- Fila 1: Título combinado -->
        <tr>
            <th colspan="4" class="bold center">DATOS DE LA NOTA RECIBIDA</th>
        </tr>

        <!-- Fila 2: Fecha de Recepción y Recibido por -->
        <tr>
            <td class="bold">Fecha de Recepción:</td>
            <td>${formData.fecha}</td>
            <td class="bold">Recibido por:</td>
            <td>${userName}</td>
        </tr>

        <!-- Fila 3: M.E. REC. N° y Presentado por -->
        <tr>
            <td class="bold">M.E. REC. N°:</td>
            <td>${formData.numero}</td>
            <td class="bold">Presentado por:</td>
            <td>${formData.remitente}</td>
        </tr>

        <!-- Fila 4: Folio y celdas vacías -->
        <tr>
            <td class="bold">Folio:</td>
            <td>${folio} HOJA</td>
            <td></td>
            <td></td>
        </tr>

        <!-- Fila 5: Breve Resumen -->
        <tr>
            <td class="bold">Breve Resumen:</td>
            <td colspan="3">${formData.resumen}</td>
        </tr>

        <!-- Fila 6: Antecedente -->
        <tr>
            <td class="bold">Antecedente: ${formData.ME}</td>
            <td colspan="3"></td>
        </tr>
    </table>

    <h3>Remitir a:</h3>
    <table>
        <tr>
            <th>N°</th>
            <th>Dependencia</th>
            <th>Remitido para</th>
            <th>M.E. N° Recepción</th>
            <th>Fecha Recepción</th>
            <th>Hora Recepción</th>
            <th>Firma de Recepción de Nota</th>
            <th>Aclaración Firma</th>
        </tr>
        <tr>
            <td>1.</td><td></td><td></td><td></td><td>____/___/___</td><td>____:____</td><td></td><td></td>
        </tr>
        <tr>
            <td>2.</td><td></td><td></td><td></td><td>____/___/___</td><td>____:____</td><td></td><td></td>
        </tr>
        <tr>
            <td>3.</td><td></td><td></td><td></td><td>____/___/___</td><td>____:____</td><td></td><td></td>
        </tr>
        <tr>
            <td>4.</td><td></td><td></td><td></td><td>____/___/___</td><td>____:____</td><td></td><td></td>
        </tr>
        <tr>
            <td>5.</td><td></td><td></td><td></td><td>____/___/___</td><td>____:____</td><td></td><td></td>
        </tr>
    </table>

    <h3>Datos de la Encargada/o de Preparar y Remitir Nota</h3>
    <table>
        <tr>
            <th class="bold">Preparado por</th>
            <th class="bold">Firma</th>
            <th class="bold">Recibido por</th>
            <th class="bold">Firma</th>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <h3>Otras Dependencias</h3>
    <table>
        <tr>
            <th>N°</th>
            <th>Remitido para</th>
            <th>N° de remisión</th>
        </tr>
        <tr>
            <td>1.</td><td></td><td></td>
        </tr>
         <tr>
            <td>2.</td><td></td><td></td>
            </tr>
             <tr>
            <td>3.</td><td></td><td></td>
            </tr>
             <tr>
            <td>4.</td><td></td><td></td>
            </tr>
             <tr>
            <td>5.</td><td></td><td></td>
        </tr>
    </table>

    <h3>Datos de la Encargada/o de Redacción de Notas</h3>
    <table>
        <tr>
            <th class="bold">Funcionario/a</th>
            <th class="bold">Firma</th>
        </tr>
        <tr>
            <td></td>
            <td></td>
        </tr>
    </table>

</body>
</html>
    `;

    // Configuración de html2pdf
    const options = {
      margin: 10,
      filename: 'caratula_me.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: [216, 356] , orientation: 'portrait' },
    };

    // Generar el PDF
    html2pdf().from(content).set(options).save();
  };


  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Registro de Mesas de Entradas
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange}>
      <Tab
          label={
            <Box display="flex" alignItems="center">
              <InicioIcon fontSize="small" sx={{ mr: 1 }} /> {/* Icono pequeño */}
              Inicio
            </Box>
          }/>
    {userRole !== 'carga' && (
          
            <Tab
              label={
                <Box display="flex" alignItems="center">
                  <MientrasIcon fontSize="small" sx={{ mr: 1 }} /> {/* Icono pequeño */}
                  Prov. sin Nota
                </Box>
              }
            />
          )}
            {userRole !== 'carga' && (
            <Tab
              label={
                <Box display="flex" alignItems="center">
                  <FinIcon fontSize="small" sx={{ mr: 1 }} /> {/* Icono pequeño */}
                  Prov. con Nota
                </Box>
              }
            />
          
        )}


      </Tabs>
      <form onSubmit={handleSubmit}>
      <Box hidden={tabValue !== 0}>
  <Grid container spacing={3}>
    {/* Primera fila: tres campos en tres columnas */}
    {userRole === 'admin' && (
    <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="confidencial"
                    checked={formData.confidencial}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Nota confidencial"
              />
            </Grid>
    )}
    <Grid item xs={12} md={3}>
          <TextField
            label="Número de M.E."
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            helperText={'Este campo es obligatorio'}
      
          />
        </Grid>
        
    <Grid item xs={12} md={3}>
      <TextField
        label="Fecha recibido"
        name="fecha"
        type="date"
        value={formData.fecha}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <TextField
        label="Remitente (Quien Presenta)"
        name="remitente"
        value={formData.remitente}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
            helperText={'Este campo es obligatorio'}
      />
    </Grid>
    <Grid item xs={12} md={3}>
    <TextField
  label="Folio"
  name="folio"
  value={folio}
  onChange={(e) => setFolio(e.target.value)} // Maneja el cambio directamente
  fullWidth
  margin="normal"
/>
    </Grid>
   

    {/* Segunda fila: un campo que ocupa tres columnas */}
    <Grid item xs={12} md={12}>
      <TextField
        label="Resumen"
        name="resumen"
        value={formData.resumen}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline // Permite múltiples líneas
    rows={2} // Número mínimo de filas visibles
      />
    </Grid>
   

  </Grid>
</Box>
<Box hidden={tabValue !== 1}>

  <Grid container spacing={3}>
    {/* Primera fila: cuatro campos en cuatro columnas */}
   
    <Grid item xs={12} md={3}>
      <TextField
        label="Destinatarios"
        name="destinatarios"
        value={formData.destinatarios}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <TextField
        label="Providencia"
        name="providencia"
        value={formData.providencia}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <TextField
        label="Recepción"
        name="recepcion"
        value={formData.recepcion}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Grid>

    <Grid item xs={12} md={3}>
      <TextField
        label="M.E. Antecedente y/o Precedente"
        name="ME"
        value={formData.ME}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Grid>

    {/* Segunda fila: un campo que ocupa todo el ancho */}
   

    {/* Tercera fila: un campo que ocupa todo el ancho */}
    <Grid item xs={12} md={3}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Documento solicitado</InputLabel>
        <Select
          name="docsol"
          value={formData.docsol}
          onChange={handleChange}
        >
          <MenuItem value=""></MenuItem>
          <MenuItem value="Dictamen">Dictamen</MenuItem>
          <MenuItem value="Dictamen Conjunto">Dictamen Conjunto</MenuItem>
          <MenuItem value="Resolución Rectorado">Resolución Rectorado</MenuItem>
          <MenuItem value="Resolución Consejo Superior">Resolución Consejo Superior</MenuItem>
          <MenuItem value="Convenio">Convenio</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} md={3}>
      <TextField
        label="Numero de Documento"
        name="ndic"
        value={formData.ndic}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Grid>

    <Grid item xs={12} md={3}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Documento solicitado 2</InputLabel>
        <Select
          name="docsol2"
          value={formData.docsol2}
          onChange={handleChange}
        >
          <MenuItem value=""></MenuItem>
          <MenuItem value="Dictamen">Dictamen</MenuItem>
          <MenuItem value="Dictamen Conjunto">Dictamen Conjunto</MenuItem>
          <MenuItem value="Resolución Rectorado">Resolución Rectorado</MenuItem>
          <MenuItem value="Resolución Consejo Superior">Resolución Consejo Superior</MenuItem>
          <MenuItem value="Convenio">Convenio</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} md={3}>
      <TextField
        label="Numero de Documento"
        name="nres"
        value={formData.nres}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Seguimiento</InputLabel>
        <Select
          name="seguimiento"
          value={formData.seguimiento}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Ninguno</em>
          </MenuItem>
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="finalizado">Finalizado</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  </Grid>
</Box>
<Box hidden={tabValue !== 2}>
  <Grid container spacing={3}>
    {/* Primera fila: cuatro campos en cuatro columnas */}
    <Grid item xs={12} md={3}>
      <TextField
        label="Número de Referencia"
        name="nroRecepcion"
        value={formData.nroRecepcion}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <TextField
        label="Fecha de Recepción"
        name="fechaRecepcion"
        type="date"
        value={formData.fechaRecepcion}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Grid>
    
    <Grid item xs={12} md={6}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Estado</InputLabel>
        <Select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        >
          <MenuItem value="Pendiente"></MenuItem>
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="finalizado">Finalizado</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* Segunda fila: un campo que ocupa todo el ancho */}
    <Grid item xs={12} md={3}>
      <TextField
        label="Destinatario"
        name="destinatario2"
        value={formData.destinatario2}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Grid>

    {/* Tercera fila: un campo que ocupa todo el ancho */}
    <Grid item xs={12} md={3}>
      <TextField
        label="Cargo"
        name="cargo"
        value={formData.cargo}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Grid>

    {/* Cuarta fila: un campo que ocupa todo el ancho */}
    <Grid item xs={12} md={3}>
      <TextField
        label="Dependencia"
        name="dependencia"
        value={formData.dependencia}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Grid>

    {/* Quinta fila: un campo que ocupa todo el ancho */}
    <Grid item xs={12} md={3}>
      <TextField
        label="Recepción 2"
        name="recepcion2"
        value={formData.recepcion2}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        label="Descripción"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline // Permite múltiples líneas
    rows={2} // Número mínimo de filas visibles
      />
    </Grid>
    {/* Sexta fila: un campo que ocupa todo el ancho */}
    <Grid item xs={12} md={6}>
      <TextField
        label="Observación"
        name="observacion"
        value={formData.observacion}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline // Permite múltiples líneas
    rows={2} // Número mínimo de filas visibles
      />
    </Grid>
  </Grid>
</Box>
<Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
<Button
            variant="contained"
            color="#cddc39"
            onClick={generatePDF} // Botón para generar el PDF
          >
            Generar PDF
          </Button>
          <Button type="submit" variant="contained" color="primary" >
            Guardar
          </Button>
          <Button
            startIcon={<CleaningServicesIcon />} // Icono de eliminar
            onClick={limpiar} // Función de eliminar
          >
            Limpiar
          </Button>
          {userRole === 'admin' && (
          <Button
            color="error" // Color rojo para indicar peligro
            startIcon={<DeleteIcon />} // Icono de eliminar
            onClick={handleDelete} // Función de eliminar
          >
            Eliminar
          </Button>
          )}
         
        </Box>
      </form>
    </Container>
  );
};

export default Form2;