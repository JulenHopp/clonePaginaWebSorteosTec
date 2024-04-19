//funcion para user data 
fetch('/userData')
    .then(response => response.json())
    .then(data => {
        document.getElementById('nombre').textContent = data[0].nombre;
        document.getElementById('apellido').textContent = data[0].apellido;
        console.log('Datos del usuario:', data);
    })
    .catch(error => console.error('Error al obtener los datos del usuario:', error));

// funcion para obtener balance
fetch('/saldo')
    .then(response => response.json())
    .then(data => {
        document.getElementById('saldo').textContent = data.saldo;            
        console.log('Saldo:', data);
    })
     .catch(error => console.error('Error al obtener el Saldo:', error));

// Opciones depositos
fetch('/paymentMethods')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('metodo'); // Seleccionar el elemento <select>
        data.forEach(metodo => {
            var option = document.createElement("option");
            option.text = metodo.nombre; // Acceder al valor 'nombre'
            select.add(option);
        });
    })
    .catch(error => console.error('Error al obtener los métodos de pago:', error));


// Event listener for the "Depositar a la e-Wallet" button
document.getElementById("depositButton").addEventListener("click", openDepositModal);
// Event listener for the "Añadir Método de Pago" button
document.getElementById("addPaymentButton").addEventListener("click", openPaymentModal);
// Event listener for the "Ver Métodos de Pago" button
document.getElementById("viewPaymentButton").addEventListener("click", openViewPaymentModal);

// Function to handle opening the modal window
function openDepositModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    // Close the modal when the close button or outside the modal is clicked
    var closeButton = document.getElementsByClassName("close")[0];
    window.onclick = function(event) {
        if (event.target == modal || event.target == closeButton) {
            modal.style.display = "none";
        }
    }
}

// Funcion para abrir el modal de metodos de pago
function openPaymentModal() {
    var modal = document.getElementById("addPaymentModal");
    modal.style.display = "block";

    // Close the modal when the close button or outside the modal is clicked
    var closeButton = document.getElementsByClassName("close")[1];
    window.onclick = function(event) {
        if (event.target == modal || event.target == closeButton) {
            modal.style.display = "none";
        }
    }
}

function openViewPaymentModal() {
    var modal = document.getElementById("viewPaymentModal");
    modal.style.display = "block";

    // Close the modal when the close button or outside the modal is clicked
    var closeButton = document.getElementsByClassName("close")[2];
    window.onclick = function(event) {
        if (event.target == modal || event.target == closeButton) {
            modal.style.display = "none";
        }
    }
    mostrarMetodos();
}


// Función para guardar métodos de pago
function insertarMetodoDatos(event) {
    console.log("entro a insertar metodo");
    //var nombre = document.getElementById('nombre').value;
    var nombre = event.target.querySelector('#nombre').value;
    var numero_tarjeta = event.target.querySelector('#numero_tarjeta').value;
    console.log(nombre);
    //var numero_tarjeta = document.getElementById('numero_tarjeta').value;
    console.log(numero_tarjeta);
    insertarMetodo(nombre, numero_tarjeta);
}

function insertarMetodo(nombre, numero_tarjeta) {
    const metodoPago = {
        nombre: nombre,
        numero_tarjeta: numero_tarjeta
    };
    fetch('/insertarMetodoPago', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(metodoPago)
    })
    console.log("paso el fetch")
    
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al insertar el método de pago');
        }
        return response.json();
    })
    .then(data => {
        console.log('Método de pago insertado exitosamente:', metodoPago);
    })
    .catch(error => {
        console.error('Error al insertar el método de pago:', error);
    });
}

// Función para guardar depositos
function depositarSaldo(event) {
    console.log("entro a depositar");
    var cantidad = event.target.querySelector('#cantidad').value;
    var metodo = event.target.querySelector('#metodo').value;
    depositar(cantidad, metodo);
}

function depositar(cantidad, metodo) {
    const deposito = {
        cantidad: cantidad,
        metodo: metodo
    };
    fetch('/registrar-transaccion-real', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(deposito)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al depositar');
        }
        return response.json();
    })
    .then(data => {
        console.log('Deposito exitoso:', deposito);
    })
    .catch(error => {
        console.error('Error al depositar:', error);
    });
}

function mostrarMetodos() {
    fetch('/paymentMethods')
    .then(response => response.json())
    .then(data => {
        const tabla = document.getElementById('tablaMetodos');
        data.forEach(metodo => {
            var row = tabla.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = metodo.nombre;
            cell2.innerHTML = metodo.numero_tarjeta;
        });
    })
    .catch(error => console.error('Error al obtener los métodos de pago:', error));
}