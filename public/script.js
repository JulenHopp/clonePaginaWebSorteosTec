// Funciones para mostrar y ocultar los modales
function showLogin() {
  document.getElementById('login-modal').style.display = 'block';
}

function hideLogin() {
  document.getElementById('login-modal').style.display = 'none';
}

function showRegister() {
  hideLogin();  // Cierra el modal de inicio de sesión si está abierto
  document.getElementById('register-modal').style.display = 'block';
}

function hideRegister() {
  document.getElementById('register-modal').style.display = 'none';
}

// Función para manejar el inicio de sesión
function login(event) {
  event.preventDefault();  // Previene la recarga de la página
  var email = document.getElementById('login-username').value;
  var password = document.getElementById('login-password').value;
  autenticarUsuario(email, password);
}

// Función para enviar solicitud de autenticación al servidor
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
  const usuarioElement = document.getElementById('auth-container');
  usuarioElement.innerHTML = `<button onclick="openUserProfile()">Bienvenido, ${data.firstName}</button>`;
  hideLogin();  // Cierra el modal de inicio de sesión
})
.catch(error => {
  console.error('Error al autenticar:', error);
});
}

// Función para manejar el registro de la cuenta
function register(event) {
  event.preventDefault();  // Previene la recarga de la página
  var firstName = document.getElementById('first-name').value;
  var lastName = document.getElementById('last-name').value;
  var email = document.getElementById('register-email').value;
  var password = document.getElementById('register-password').value;

  registerAccount(firstName, lastName, email, password);
}

// Función para enviar datos de nueva cuenta al servidor
function registerAccount(firstName, lastName, email, password) {
const newUser = {
  "nombre": firstName,
  "apellido": lastName,
  "email": email,
  "psswrd": password,
  "admins": 0,
  "id_estado": 1
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
  const usuarioElement = document.getElementById('auth-container');
  usuarioElement.innerHTML = `<button onclick="openUserProfile()"><img src="images\perfil.svg" alt="Imagen iniciar sección" > Bienvenido, ${firstName}</button>`;
  hideRegister();  // Cierra el modal de creación de cuenta
})
.catch(error => {
  console.error('Error al registrar:', error);
});
}

// Función para abrir el perfil del usuario
function openUserProfile() {
  // Aquí puedes agregar cualquier lógica previa necesaria antes de mostrar el modal
  document.getElementById('user-options-modal').style.display = 'block';  // Muestra el modal de opciones del usuario
}
