// Importación de módulos necesarios para el servidor
const { error } = require('console');
const express = require('express');
const mysql = require('mysql2');
const path = require("path");

// Creación de la aplicación Express
const app = express();
const PORT = 3000;

//creacion de vairable de sesion
let identityKey = null;

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

app.get('/get-identityKey', (req, res) => {
  if (!identityKey) {
    return res.status(200).json({ identityKey: null, message: 'No identity key set' });
  }
  res.status(200).json({ identityKey: identityKey, message: 'Identity key retrieved successfully' });
});

app.post('/logout', (req, res) => {
  identityKey = null;  // Resetea la identityKey
  res.status(200).json({ message: 'Logout successful' });
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
  const query = 'SELECT * FROM Usuario WHERE email = ? ';
  connection.query(query, [email], (error, results) => {
      if (error) {
          console.error('Error al ejecutar la consulta:', error);
          res.status(500).send('Error interno del servidor');
          return;
      }
      // Check if results exist and have at least one row
      if (results && results.length > 0) {
          // Comparación de la contraseña y manejo de la respuesta
          if (password === results[0].psswrd) {
            identityKey = results[0].email;
              res.json({ message: 'Autenticación exitosa', firstName: results[0].nombre ,admins: results[0].admins });
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
  // Llamar al procedimiento almacenado en la base de datos
  connection.query('CALL Crear_cuenta(?, ?, ?, ?, ?, ?)', [nombre, apellido, email, psswrd, admins, id_estado], (error, results, fields) => {
    if (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      if (error.errno === 1644) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    identityKey = email;
    res.status(200).json({ message: 'Cuenta creada exitosamente' });
  });
});

// Usar identityKey para obtener el nombre y apellido del usuario
app.get('/userData', (req, res) => {
  const query = 'SELECT * FROM Usuario WHERE email = ?';
  connection.query(query, [identityKey], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json(results);
  });
});

// Endpoint GET para obtener el balance de un usuario
app.get('/saldo', (req, res) => {
  console.log("Entro a saldo")
  // Check if eWallet exists for the user
  const checkQuery = 'SELECT id_usuario FROM Usuario WHERE email = ?';
  connection.query(checkQuery, [identityKey], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error al verificar la existencia de la eWallet:', checkError);
      return res.status(500).send('Error interno del servidor');
    }

    if (checkResults.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    const userId = checkResults[0].id_usuario;
    
    const eWalletQuery = 'SELECT saldo FROM eWallet WHERE id_usuario = ?';
    connection.query(eWalletQuery, [userId], (eWalletError, eWalletResults) => {
      if (eWalletError) {
        console.error('Error al obtener el saldo de la eWallet:', eWalletError);
        return res.status(500).send('Error interno del servidor');
      }

      if (eWalletResults.length > 0) {
        // eWallet exists, return balance
        res.json({ saldo: eWalletResults[0].saldo });
      }
    });
  });
});


app.get('/paymentMethods', (req, res) => {
  // Check if eWallet exists for the user
  const checkQuery = 'SELECT id_usuario FROM Usuario WHERE email = ?';
  connection.query(checkQuery, [identityKey], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error al verificar la existencia de la eWallet:', checkError);
      return res.status(500).send('Error interno del servidor');
    }
    if (checkResults.length === 0) {
      // If user doesn't exist, return error
      return res.status(404).send('Usuario no encontrado');
    }
    const id_usuario = checkResults[0].id_usuario;
    // Consulta para obtener los métodos de pago asociados con la eWallet del usuario
    const idwalletQuery = 'SELECT id_wallet FROM eWallet WHERE id_usuario = ?';
    connection.query(idwalletQuery, [id_usuario], (errorWallet, walletResults) => {
      if (errorWallet) {
        console.error('Error al obtener los métodos de pago:', errorWallet);
        return res.status(500).send('Error interno del servidor');
      }
      const idwallet = walletResults[0].id_wallet;

      // Consulta corregida para obtener los métodos de pago
      const methodsQuery = 'SELECT nombre, numero_tarjeta FROM Métodos_Pago WHERE id_wallet = ?';
      connection.query(methodsQuery, [idwallet], (errorMethods, methodsResults) => {
        if (errorMethods) {
          console.error('Error al obtener los métodos de pago:', errorMethods);
          return res.status(500).send('Error interno del servidor');
        }
        res.json(methodsResults);
      });
    });
  });
});

app.post('/insertarMetodoPago', (req, res) => {
  // Extraer los datos de la solicitud
  const { usuario_email, nombre, numero_tarjeta } = req.body;

  // Llamar al procedimiento almacenado en la base de datos
  connection.query('CALL Insertar_metodo_pago(?, ?, ?)', [identityKey, nombre, numero_tarjeta], (error, results, fields) => {
    if (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      if (error.code === 'PROCEDURE_ERROR') {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
    res.status(200).json({ message: 'Método de pago insertado exitosamente' });
  });
});


// Endpoint POST para editar una cuenta
app.post('/editar-cuenta', (req, res) => {
  const { viejo_email, nuevo_nombre, nuevo_apellido, nuevo_email, nueva_psswrd, nuevo_id_estado } = req.body;

  connection.query('CALL Editar_cuenta(?, ?, ?, ?, ?, ?)', [viejo_email, nuevo_nombre, nuevo_apellido, nuevo_email, nueva_psswrd, nuevo_id_estado], (error, results, fields) => {
    if (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    console.log('Cuenta editada exitosamente');
    res.status(200).json({ message: 'Cuenta editada exitosamente' });
  });
});

// Endpoint POST para registrar una transacción real
app.post('/registrar-transaccion-real', (req, res) => {
  const { usuario_email, cantidad, metodo } = req.body;

  connection.query('CALL Registrar_transaccion_real(?, ?, ?)', [identityKey, cantidad, metodo], (error, results, fields) => {
    if (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    console.log('Transacción registrada exitosamente');
    res.status(200).json({ message: 'Transacción registrada exitosamente' });
  });
});

// Endpoint POST para registrar una compra de cupones
app.post('/registrar-compra-cupones', (req, res) => {
  const { usuario_email, id_cupon } = req.body;

  connection.query('CALL Registrar_compra_cupones(?, ?)', [usuario_email, id_cupon], (error, results, fields) => {
    if (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    console.log('Compra de cupones registrada exitosamente');
    res.status(200).json({ message: 'Compra de cupones registrada exitosamente' });
  });
});

// Endpoint POST para registrar una compra de juegos
app.post('/registrar-compra-juegos', (req, res) => {
  const { usuario_email, costo, id_juego } = req.body;

  connection.query('CALL Registrar_compra_juegos(?, ?, ?)', [usuario_email, costo, id_juego], (error, results, fields) => {
    if (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    console.log('Compra de juegos registrada exitosamente');
    res.status(200).json({ message: 'Compra de juegos registrada exitosamente' });
  });
});

///////////////////////////
// APIS BUSCABORREGOS /////
///////////////////////////

// VARIABLES GLOBALES
let dinero_inicial_buscaBorrego = 10;
let minas_buscaBorrego = 5;
const id_buscaborrego = 1;

// Endpoint para obtener las variables globales
app.get('/buscaBorrego/variables', (req, res) => {
  console.log("Entro a variables");
  res.json({
      dinero_inicial_buscaBorrego: dinero_inicial_buscaBorrego,
      minas_buscaBorrego: minas_buscaBorrego
  });
});

// Endpoint para actualizar las variables globales
app.post('/buscaBorrego/variables', (req, res) => {
  const { dinero, minas } = req.body;
  if (dinero !== undefined) dinero_inicial_buscaBorrego = dinero;
  if (minas !== undefined) minas_buscaBorrego = minas;
  res.status(200).send("Variables actualizadas correctamente");
});


app.post('/buscaBorrego/registrarCompraJuego', (req, res) => {
  console.log("Entro a registrarCompraJuego");
  const sql = 'CALL Registrar_compra_juegos(?, ?, ?)';
  connection.query(sql, [identityKey, dinero_inicial_buscaBorrego, id_buscaborrego], (error, results, fields) => {
    if (error) {
      console.error('Error en la base de datos:', error);
      return res.status(500).send('Error al procesar la compra del juego');
    }
    res.send('Compra registrada correctamente');
  });
});

app.post('/buscaBorrego/ingresarGanancia', (req, res) => {
  console.log("Entro a ingresarGanancia");
  const { cantidad } = req.body;
  
  if (!cantidad) {
      return res.status(400).send('La cantidad es necesaria para procesar la transacción.');
  }

  const sql = 'CALL Registrar_compra_juegos(?, ?, ?)';
  connection.query(sql, [identityKey,  -1 * cantidad, id_buscaborrego], (error, results, fields) => {
      if (error) {
          console.error('Error al ejecutar el procedimiento almacenado:', error);
          return res.status(500).send('Error interno del servidor');
      }
      res.send('Transacción registrada correctamente');
  });
});

///////////////////////////
// APIS BORREGO TOWER /////
///////////////////////////
let dinero_inicial_borregoTower = 10;
const id_borregoTower = 2;

app.post('/borregoTower/registrarCompraJuego', (req, res) => {
  console.log("Entro a registrarCompraJuego");
  const sql = 'CALL Registrar_compra_juegos(?, ?, ?)';
  connection.query(sql, [identityKey, dinero_inicial_borregoTower, id_borregoTower], (error, results, fields) => {
    if (error) {
      console.error('Error en la base de datos:', error);
      return res.status(500).send('Error al procesar la compra del juego');
    }
    res.send('Compra registrada correctamente');
  });
});

app.post('/borregoTower/ingresarGanancia', (req, res) => {
  console.log("Entro a ingresarGanancia");
  const { cantidad } = req.body;
  
  if (!cantidad) {
      return res.status(400).send('La cantidad es necesaria para procesar la transacción.');
  }

  const sql = 'CALL Registrar_compra_juegos(?, ?, ?)';
  connection.query(sql, [identityKey,  -1 * cantidad, id_borregoTower], (error, results, fields) => {
      if (error) {
          console.error('Error al ejecutar el procedimiento almacenado:', error);
          return res.status(500).send('Error interno del servidor');
      }
      res.send('Transacción registrada correctamente');
  });
});


///////////////////////////
// APIS BORREGO JUMP /////
///////////////////////////

///////////////////////////
// COSAS DEL SERVIDOR /////
///////////////////////////

// Iniciación del servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});