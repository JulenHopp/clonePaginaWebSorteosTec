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
  console.log(data.admins);
  if (data.admins == 1) {
    document.getElementById('admin-modal').style.display = 'block';
  }
  hideLogin();  // Cierra el modal de inicio de sesión
})
.catch(error => {
  console.error('Error al autenticar:', error);
});
}

function hideAdmin() {
  document.getElementById('admin-modal').style.display = 'none';
}

// Función para manejar el registro de la cuenta
function register(event) {
  event.preventDefault();  // Previene la recarga de la página
  var firstName = document.getElementById('first-name').value;
  var lastName = document.getElementById('last-name').value;
  var email = document.getElementById('register-email').value;
  var password = document.getElementById('register-password').value;
  var stateId = document.getElementById('register-state').value; // Recolecta el estado

  if (!validatePassword(password)) {
    return; // Detiene la ejecución si la contraseña no es válida
  }

  registerAccount(firstName, lastName, email, password, stateId);
}

// Función para validar la contraseña
function validatePassword(password) {
  var errors = [];
  if (password.length < 8) {
    errors.push("Tu contraseña debe tener al menos 8 caracteres.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Tu contraseña debe contener al menos una letra mayúscula.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Tu contraseña debe contener al menos una letra minúscula.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Tu contraseña debe contener al menos un número.");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Tu contraseña debe contener al menos un símbolo (ej: @, !, #, etc.).");
  }
  if (errors.length > 0) {
    alert(errors.join("\n"));
    return false; // Retorna falso si hay errores
  }
  return true; // Retorna verdadero si la contraseña es válida
}

// Función para enviar datos de nueva cuenta al servidor
function registerAccount(firstName, lastName, email, password, stateId) {
  const newUser = {
    "nombre": firstName,
    "apellido": lastName,
    "email": email,
    "psswrd": password,
    "admins": 0,
    "id_estado": stateId // Asegurarse de incluir el estado
  };

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

function editAccount() {
  // Esta función podría redirigir al usuario a una página de edición de perfil o mostrar un formulario de edición en un modal
  console.log('Editar cuenta');
  // Por ejemplo, puedes abrir otro modal para editar la cuenta:
  document.getElementById('edit-account-modal').style.display = 'block';
  hideUserOptions();  // Opcional: ocultar el modal de opciones del usuario
}

function logout() {
  // Función para manejar el cierre de sesión del usuario
  console.log('Cerrar sesión');
  // Aquí implementarías la lógica para cerrar la sesión, como limpiar cookies o localStorage
  window.location.href = '/';  // Redireccionar al usuario a la página de inicio de sesión
  hideUserOptions();  // Ocultar el modal de opciones del usuario
}

function hideUserOptions() {
  document.getElementById('user-options-modal').style.display = 'none';  // Oculta el modal de opciones del usuario
}
