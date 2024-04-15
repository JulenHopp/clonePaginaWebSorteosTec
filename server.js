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
  const query = 'SELECT p.psswrd FROM PasswordUsuarios p WHERE p.email_user = ?';
  connection.query(query, [email], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).send('Error interno del servidor');
      return;
    }

    // Comparación de la contraseña y manejo de la respuesta
    if (results.length > 0 && password === results[0].psswrd) {
      res.json({ message: 'Autenticación exitosa' });
    } else {
      res.status(401).send('Usuario o contraseña incorrectos');
    }
  });
});

// Endpoint POST para registrar una nueva cuenta, incluyendo nombre, apellido, email y contraseña
app.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Verificación de completitud de los campos requeridos
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send('Todos los campos son requeridos.');
  }

  // Transacción SQL para asegurar la consistencia en la creación de cuentas
  connection.beginTransaction(err => {
    if (err) return res.status(500).send('Error al iniciar la transacción');

    // Inserción del usuario en la tabla Usuario
    const insertUserQuery = 'INSERT INTO Usuario (email, nombre, apellido) VALUES (?, ?, ?)';
    connection.query(insertUserQuery, [email, firstName, lastName], (error, results) => {
      if (error) {
        return connection.rollback(() => {
          console.error('Error al insertar en Usuario:', error);
          res.status(500).send('Error al registrar el usuario');
        });
      }

      // Inserción de la contraseña en texto plano en la tabla PasswordUsuarios
      const insertPasswordQuery = 'INSERT INTO PasswordUsuarios (email_user, psswrd) VALUES (?, ?)';
      connection.query(insertPasswordQuery, [email, password], (error) => {
        if (error) {
          return connection.rollback(() => {
            console.error('Error al insertar en PasswordUsuarios:', error);
            res.status(500).send('Error al registrar la contraseña');
          });
        }

        // Finalización de la transacción
        connection.commit(err => {
          if (err) {
            return connection.rollback(() => {
              console.error('Error al hacer commit de la transacción:', err);
              res.status(500).send('Error al completar el registro');
            });
          }
          console.log("Registro completo.");
          res.json({ message: 'Registro exitoso' });
        });
      });
    });
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
