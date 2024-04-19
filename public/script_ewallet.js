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
