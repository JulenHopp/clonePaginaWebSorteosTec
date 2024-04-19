//funcion para user data 
fetch('/userData')
    .then(response => response.json())
    .then(data => {
        document.getElementById('nombre').textContent = data[0].nombre;
        document.getElementById('apellido').textContent = data[0].apellido;
        console.log("info en string");
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

// Opciones depositos
fetch('/paymentMethods')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('paymentMethod'); // Seleccionar el elemento <select>
        data.forEach(paymentMethod => {
            var option = document.createElement("option");
            option.text = paymentMethod.nombre; // Acceder al valor 'nombre'
            select.add(option);
        });
    })
    .catch(error => console.error('Error al obtener los métodos de pago:', error));


// Event listener for the "Depositar a la e-Wallet" button
document.getElementById("depositButton").addEventListener("click", openDepositModal);

// Event listener for the "Confirm Deposit" button inside the modal
//document.getElementById("confirmDeposit").addEventListener("click", depositToEWallet);
