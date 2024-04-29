let userData = {
  nombre: null,
  apellido: null,
  saldo: null,
  admin: false
};

function updateButtons() {
  const usuarioElement = document.getElementById('auth-container');

  if (!userIdentityKey || !userData.nombre) {
      // Si identityKey es nula o no tenemos nombre, se muestra el botón de iniciar sesión
      usuarioElement.innerHTML = `
        <button id="login-btn" onclick="showLogin()">
          <img src="/images/perfil.svg" alt="Imagen iniciar sección">Iniciar Sesión
        </button>`;
  } else {
      // Si identityKey y userData están completos, muestra la interfaz de usuario logueada
      usuarioElement.innerHTML = `
        <div id="userLogged-container">
          <span id="ewallet-saldo">Saldo: ${userData.saldo}</span>
          <button onclick="openUserProfile()">
            <img src="/images/perfil.svg" alt="Imagen iniciar sección"> Bienvenido, ${userData.nombre}
          </button>
        </div>`;
  }
}
// Función principal para verificar la identityKey y actualizar la interfaz de usuario
function checkIdentityAndLoadData() {
  fetch('/get-identityKey')
    .then(response => response.json())
    .then(data => {
      const usuarioElement = document.getElementById('auth-container');
      if (!data.identityKey) {
        // Si identityKey es nula, se muestra el botón de iniciar sesión
        usuarioElement.innerHTML = `
          <button id="login-btn" onclick="showLogin()">
            <img src="/images/perfil.svg" alt="Imagen iniciar sección">Iniciar Sesión
          </button>`;
      } else {
        // Si identityKey no es nula, se hacen fetch a /userData y /saldo
        Promise.all([
          fetch('/userData').then(response => response.json()),
          fetch('/saldo').then(response => response.json())
        ]).then(([userDataResponse, saldoResponse]) => {
          // Actualiza userData con los datos recibidos
          userData = {
            nombre: userDataResponse[0].nombre,
            apellido: userDataResponse[0].apellido,
            saldo: saldoResponse.saldo,
            admin: userDataResponse[0].admins,
          };
          // Actualiza la interfaz de usuario con los datos del usuario
          usuarioElement.innerHTML = `
            <div id="userLogged-container">
              <span id="ewallet-saldo">Saldo: ${userData.saldo}</span>
              <button onclick="openUserProfile()">
                <img src="/images/perfil.svg" alt="Imagen iniciar sección"> Bienvenido, ${userData.nombre}
              </button>
            </div>`;
          console.log('Datos del usuario:', userData.admin);
          if(userData.admin == 1){
            createAdminButton();
          }
        }).catch(error => {
          console.error('Error fetching user data or saldo:', error);
        });
      }
    })
    .catch(error => {
      console.error('Error fetching identityKey:', error);
    });
}

// Ejecuta la función principal al cargar la página o según sea necesario
document.addEventListener('DOMContentLoaded', checkIdentityAndLoadData);

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
  checkIdentityAndLoadData();
  if (data.admins == 1) {
    userData.admin = true;
    document.getElementById('admin-modal').style.display = 'block';
    hideLogin();  // Cierra el modal de inicio de sesión
    //createAdminButton();
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

function createAdminButton() {
  // Selecciona la lista dentro de la navbar
  const navbarList = document.querySelector('.header-navbar .navbar-items'); 
  if (!navbarList) {
    console.error('Navbar list not found!');
    return;
  }

  // Crea un nuevo elemento de lista <li> y un enlace <a>
  const listItem = document.createElement('li');
  const button = document.createElement('a');
  
  // Configura el contenido del botón y el href inicial
  button.textContent = 'Admin Panel';
  button.href = '/html/admin.html';  // Configura el enlace directo a la página de admin

  // Añade un escuchador de eventos si necesitas funcionalidad adicional cuando se haga clic
  button.addEventListener('click', (event) => {
    // Evita la navegación directa si es necesario manejar lógica adicional
    event.preventDefault();

    // Aquí puedes agregar cualquier funcionalidad adicional, por ejemplo mostrar un modal de administración
    console.log('Admin button clicked!');
    window.location.href = button.href;  // Navega al enlace después de cualquier lógica adicional
  });

  // Añade el botón al elemento de lista <li> y luego el <li> a la lista <ul>
  listItem.appendChild(button);
  navbarList.appendChild(listItem);
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
    checkIdentityAndLoadData();
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
  // Por ejemplo, puedes abrir otro modal para editar la cuenta:
  document.getElementById('edit-account-modal').style.display = 'block';
  hideUserOptions();  // Opcional: ocultar el modal de opciones del usuario
}

function updateAccount(event) {
  event.preventDefault();

  // Obtener los valores del formulario y convertir cadenas vacías en null
  const firstName = document.getElementById('edit-first-name').value || null;
  const lastName = document.getElementById('edit-last-name').value || null;
  const email = document.getElementById('edit-email').value || null;
  const password = document.getElementById('edit-password').value ? document.getElementById('edit-password').value : null;
  const stateId = document.getElementById('edit-state').value || null;

  // Datos a enviar
  const data = { firstName, lastName, email, password, stateId };

  // Enviar los datos al servidor
  fetch('/api/updateAccount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    alert('Cuenta actualizada con éxito');
    // Actualizar sessionStorage o acciones adicionales
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('Error al actualizar la cuenta');
  });
}



function hideEditAccount() {
  document.getElementById('edit-account-modal').style.display = 'none';
}

function logout() {
  console.log('Cerrar sesión');

  // Enviar una petición al servidor para limpiar identityKey
  fetch('/logout', { method: 'POST' })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to logout');
      }
      return response.json();
    })
    .then(() => {
      // Resetear el estado del usuario en el cliente
      userData = { nombre: null, apellido: null, saldo: null, admin: false};
      userIdentityKey = null;

      // Actualizar los botones/UI
      updateButtons();

      // Redireccionar al usuario a la página de inicio
      window.location.href = '/';
    })
    .catch(error => {
      console.error('Error during logout:', error);
    });
}



function hideUserOptions() {
  document.getElementById('user-options-modal').style.display = 'none';  // Oculta el modal de opciones del usuario
}