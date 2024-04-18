// Importación de módulos necesarios para el servidor
const express = require('express');
const mysql = require('mysql2');
const path = require("path");

// Creación de la aplicación Express
const app = express();
const PORT = 3000;

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'mysql-10a96c3c-tec-c540.a.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_fdzJuC0JCx7_xHQ6v-R',
  database: 'proyecto',
  port: 13026,
});

// Utilizar middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());//hsdfsdfds

// Establecimiento de la conexión a la base de datos y manejo de errores de conexión
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión establecida correctamente.');
});

// Middleware para servir archivos estáticos, ubicados en el directorio 'public'
app.use(express.static(path.join(__dirname, "public")));

// Middleware global para manejo de errores internos del servidor
app.use((err, req, res, next) => {
  console.error("Error detectado:", err);
  res.status(500).send("Ocurrió un error en el servidor");
});

// Ruta raíz que sirve la página principal desde el directorio 'public'
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Endpoint POST para autenticar a un usuario, validando email y contraseña
app.post('/authenticate', (req, res) => {
  const { email, password } = req.body;

  // Validación de los datos de entrada
  if (!email || !password) {
    return res.status(400).send('Email y contraseña son requeridos.');
  }

  // Consulta SQL para verificar la contraseña del usuario
  const query = 'SELECT p.psswrd, p.admins FROM Usuario p WHERE p.email = ? ';
  connection.query(query, [email], (error, results) => {
      if (error) {
          console.error('Error al ejecutar la consulta:', error);
          res.status(500).send('Error interno del servidor');
          return;
      }
      console.log("entro 1")
      // Check if results exist and have at least one row
      if (results && results.length > 0) {
        console.log("entro 2")
          // Comparación de la contraseña y manejo de la respuesta
          if (password === results[0].psswrd) {
              res.json({ message: 'Autenticación exitosa', admin: results[0].admins });
          } else {
              res.status(401).send('Usuario o contraseña incorrectos');
          }
      } else {
          res.status(401).send('Usuario no encontrado');
      }
  });
  
});

app.post('/Crear-cuenta', (req, res) => {
  // Extraer los datos de la solicitud
  const { nombre, apellido, email, psswrd, admins, id_estado } = req.body;

  console.log("entro 1")

  // Llamar al procedimiento almacenado en la base de datos
  connection.query('CALL Crear_cuenta(?, ?, ?, ?, ?, ?)', [nombre, apellido, email, psswrd, admins, id_estado], (error, results, fields) => {
    console.log("entro")
      if (error) {
          console.error('Error al ejecutar el procedimiento almacenado:', error);
          return res.status(500).json({ error: 'Error interno del servidor' });
      }
      console.log('Cuenta creada exitosamente');
      res.status(200).json({ message: 'Cuenta creada exitosamente' });
  });
});

// Endpoint GET para obtener todos los registros de la tabla PasswordUsuarios
app.get('/datos', (req, res) => {
  connection.query('SELECT * FROM PasswordUsuarios', (error, results, fields) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).send('Error al obtener los datos');
      return;
    }
    res.json(results);
  });
});

// Iniciación del servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
