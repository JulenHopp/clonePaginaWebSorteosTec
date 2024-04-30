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

fetch('/paymentMethods')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('metodo'); // Select the <select> element
        data.forEach(metodo => {
            var option = document.createElement("option");
            let numeroTarjeta = metodo.numero_tarjeta.toString();
            console.log(numeroTarjeta);
            option.text = metodo.nombre + " *" + numeroTarjeta.slice(12, 16); 
            select.add(option);
        });
    })
    .catch(error => console.error('Error fetching payment methods:', error));
 


// Event listener for the "Depositar a la e-Wallet" button
document.getElementById("depositButton").addEventListener("click", openDepositModal);
// Event listener for the "Añadir Método de Pago" button
document.getElementById("addPaymentButton").addEventListener("click", openPaymentModal);
// Event listener for the "Ver Métodos de Pago" button
document.getElementById("viewPaymentButton").addEventListener("click", openViewPaymentModal);
// Event listener for the "Ver Boletos Comprados" button in the modal window
document.getElementById("viewCuponsButton").addEventListener("click", openViewCuponsModal);

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

function openViewCuponsModal() {
    var modal = document.getElementById("viewCuponsModal");
    modal.style.display = "block";

    // Close the modal when the close button or outside the modal is clicked
    var closeButton = document.getElementsByClassName("close")[3];
    window.onclick = function(event) {
        if (event.target == modal || event.target == closeButton) {
            modal.style.display = "none";
        }
    }
    cuponesComprados();
}

function insertarYChecar(event) {
    insertarMetodoDatos(event);
    checarFecha(event);
}


// Función para guardar métodos de pago
function insertarMetodoDatos(event) {
    console.log("entro a insertar metodo");
    //var nombre = document.getElementById('nombre').value;
    var nombre = event.target.querySelector('#nombre').value;
    var numero_tarjeta = event.target.querySelector('#numero_tarjeta').value;
    if (numero_tarjeta.length != 16) {
        alert("El número de tarjeta debe tener 16 dígitos");
        return;
    }
    //var numero_tarjeta = document.getElementById('numero_tarjeta').value;
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

function checarFecha(event) {
    var mes = event.target.querySelector('#mes').value;
    var anio = event.target.querySelector('#anio').value;
    var today = new Date();
    var expiry = new Date(anio, mes - 1); // Subtract 1 from month since it is zero-based
    if (today > expiry) {
        alert("La tarjeta ha expirado");
        return;
    }
}
// Función para guardar depositos
function depositarSaldo(event) {
    console.log("entro a depositar");
    var cantidad = event.target.querySelector('#cantidad').value;
    var metodoT = event.target.querySelector('#metodo').value;
    var metodo = metodoT.split(" ")[0];
    depositar(cantidad, metodo);
}

function depositar(cantidad, metodo) {
    console.log("entro a depositar 2")
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
        const tbody = tabla.querySelector('tbody');

        // Clear existing table content
        tbody.innerHTML = '';

        data.forEach(metodo => {
            var row = tbody.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = metodo.nombre;
            cell2.innerHTML = metodo.numero_tarjeta;
        });
    })
    .catch(error => console.error('Error al obtener los métodos de pago:', error));
}

function cuponesComprados() {
    fetch('/Verificar-compra-cupones')
    .then(response => response.json())
    .then(data => {
        const tabla = document.getElementById('tablaCupones');
        const tbody = tabla.querySelector('tbody');

        // Clear existing table body content
        tbody.innerHTML = '';

        data.forEach(temp_cupones => {
            var row = tbody.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = temp_cupones.id_compra;
            cell2.innerHTML = temp_cupones.nombre;
            cell3.innerHTML = temp_cupones.costo;
        });
    })
    .catch(error => console.error('Error al obtener los cupones comprados:', error));
}

