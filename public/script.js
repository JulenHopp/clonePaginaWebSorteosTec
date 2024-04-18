// Funciones para mostrar y ocultar modales
// Muestra el modal de inicio de sesión.
function showLogin() {
  document.getElementById('login-pop').style.display = 'block';
}

// Oculta el modal de inicio de sesión.
function hideLogin() {
  document.getElementById('login-pop').style.display = 'none';
}

// Muestra el modal de creación de cuenta.
function showCreateAccount() {
  document.getElementById('create-account-pop').style.display = 'block';
}

// Oculta el modal de creación de cuenta.
function hideCreateAccount() {
  document.getElementById('create-account-pop').style.display = 'none';
}

// Función para obtener datos desde el servidor para propósitos de prueba.
function prueba() {
  fetch('/datos')
    .then(response => response.json())
    .then(data => {
      // Muestra los datos recibidos en la consola para depuración.
      console.log('Datos de la base de datos:', data);
    })
    .catch(error => console.error('Error al obtener datos:', error));
};

// Función para enviar solicitud de autenticación al servidor.
function autenticarUsuario(email, password) {
  const userCredentials = {
    "email": email,
    "password": password
  };

  // Realiza una solicitud POST al endpoint de autenticación.
  fetch('/authenticate', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userCredentials)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la autenticación');
    }
    return response.json();
  })
  .then(data => {
    console.log('Autenticación exitosa:', data);
    const usuarioElement = document.getElementById('usuario');
    usuarioElement.innerText = `Bienvenido, ${firstName}`;
  })
  .catch(error => {
    console.error('Error al autenticar:', error);
  });
}

// Función para registrar una nueva cuenta.
function registerAccount() {
  var firstName = document.getElementById('first-name').value;
  var lastName = document.getElementById('last-name').value;
  var email = document.getElementById('new-email').value;
  var password = document.getElementById('new-password').value;

  const newUser = {
    "nombre": firstName,
    "apellido": lastName,
    "email": email,
    "psswrd": password,
    "admins": 0,
    "id_estado": 1// cambiar para que se ponga el estado posteriormente
  };

  // Envía la información del nuevo usuario al servidor para registrarla.
  fetch('/Crear-cuenta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en el registro');
    }
    return response.json();
  })
  .then(data => {
    console.log('Registro exitoso:');
    const usuarioElement = document.getElementById('usuario');
        usuarioElement.innerText = `Bienvenido, ${firstName}`;
    hideCreateAccount(); // Cierra el modal de registro tras un registro exitoso.
  })
  .catch(error => {
    console.error('Error al registrar:', error);
  });
}

// Eventos de formulario
// Previene la recarga de la página y maneja la autenticación.
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); 
  var email = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  hideLogin();
  autenticarUsuario(email, password);
});

// Previene la recarga de la página y maneja el registro de cuenta.
document.getElementById('create-account-form').addEventListener('submit', function(event) {
  event.preventDefault();
  registerAccount();
});