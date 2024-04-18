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
function getBalance() {
    fetch('/balance')
        .then(response => response.json())
        .then(data => {
            document.getElementById('balance').textContent = data[0].balance;
            console.log('Balance:', data);
        })
        .catch(error => console.error('Error al obtener el balance:', error));
}