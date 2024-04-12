// Funciones para mostrar y ocultar modales
function showLogin() {
  document.getElementById('login-pop').style.display = 'block';
}

function hideLogin() {
  document.getElementById('login-pop').style.display = 'none';
}

function showCreateAccount() {
  document.getElementById('create-account-pop').style.display = 'block';
}

function hideCreateAccount() {
  document.getElementById('create-account-pop').style.display = 'none';
}
//Funcion para realizar pruebas
function prueba() {
  fetch('/datos')
    .then(response => response.json())
    .then(data => {
      // Manipular los datos recibidos y actualizar la interfaz de usuario
      console.log('Datos de la base de datos:', data);
    })
    .catch(error => console.error('Error al obtener datos:', error));
};

// Función para enviar solicitud de autenticación
function autenticarUsuario(email, password) {
  const userCredentials = {
    "email": email,
    "password": password
  };

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
    // Redirección o manejo del token aquí
  })
  .catch(error => {
    console.error('Error al autenticar:', error);
  });
}

// Función para registrar una nueva cuenta
function registerAccount() {
  var firstName = document.getElementById('first-name').value;
  var lastName = document.getElementById('last-name').value;
  var email = document.getElementById('new-email').value;
  var password = document.getElementById('new-password').value;

  const newUser = {
    "firstName": firstName,
    "lastName": lastName,
    "email": email,
    "password": password
  };

  fetch('/register', {
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
    console.log('Registro exitoso:', data);
    hideCreateAccount(); // Cierra el modal de registro
  })
  .catch(error => {
    console.error('Error al registrar:', error);
  });
}

// Eventos de formulario
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); 
  var email = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  hideLogin();
  autenticarUsuario(email, password);
});

document.getElementById('create-account-form').addEventListener('submit', function(event) {
  event.preventDefault();
  registerAccount();
});