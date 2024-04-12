const express = require('express');
const mysql = require('mysql2');
const path = require("path");
const app = express();
const bcrypt = require('bcrypt'); 

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'mysql-10a96c3c-tec-c540.a.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_fdzJuC0JCx7_xHQ6v-R',
  database: 'proyecto',
  port: 13026,

});
app.use(express.json());
// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión establecida correctamente.');
});

app.get("/", (req,res) => {

    res.sendFile(path.join(__dirname, "/public/index.html"));
    app.use(express.static(path.join(__dirname,"public")));
    app.use((err, req, res, next) => {
    console. error("Error:" , err);
    res.status(500).send("ocurrio un error servidor")

    })
})

// Endpoint para obtener datos de la base de datos
app.post('/authenticate', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT u.email, p.psswrd FROM Usuario u JOIN PasswordUsuarios p ON u.ID_usuario = p.id_user WHERE u.email = ?';
  connection.query(query, [email], async (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).send('Error interno del servidor');
      return;
    }

    if (results.length > 0) {
      // Compara la contraseña proporcionada con el hash almacenado en la base de datos
      const match = await bcrypt.compare(password, results[0].psswrd);
      if (match) {
        res.json({ message: 'Autenticación exitosa' });
      } else {
        res.status(401).send('Usuario o contraseña incorrectos');
      }
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  });

});

// Endpoint para registrar una nueva cuenta
app.post('/register', (req, res) => {
  const { email, password, nombre, apellidos } = req.body;
  
  if (!email || !password || !nombre || !apellidos) {
    return res.status(400).send('Todos los campos son requeridos.');
  }

  // Inicia una transacción para asegurar la atomicidad
  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).send('Error al iniciar la transacción');
    }

    // Inserta primero en la tabla Usuario
    const insertUserQuery = 'INSERT INTO Usuario (email, nombre, apellidos, admin) VALUES (?, ?, ?, 0)';
    connection.query(insertUserQuery, [email, nombre, apellidos], (error, results) => {
      if (error) {
        return connection.rollback(() => {
          console.error('Error al insertar en Usuario:', error);
          res.status(500).send('Error al registrar el usuario');
        });
      }

      const userId = results.insertId; // ID generado para el usuario

      // Encripta la contraseña
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return connection.rollback(() => {
            console.error('Error al hashear la contraseña:', err);
            res.status(500).send('Error al procesar la contraseña');
          });
        }

        // Inserta en la tabla PasswordUsuarios
        const insertPasswordQuery = 'INSERT INTO PasswordUsuarios (id_user, psswrd) VALUES (?, ?)';
        connection.query(insertPasswordQuery, [userId, hashedPassword], (error) => {
          if (error) {
            return connection.rollback(() => {
              console.error('Error al insertar en PasswordUsuarios:', error);
              res.status(500).send('Error al registrar la contraseña');
            });
          }

          // Si todo va bien, realiza el commit
          connection.commit(err => {
            if (err) {
              return connection.rollback(() => {
                console.error('Error al hacer commit de la transacción:', err);
                res.status(500).send('Error al completar el registro');
              });
            }
            res.json({ message: 'Registro exitoso' });
          });
        });
      });
    });
  });
});

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
// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
