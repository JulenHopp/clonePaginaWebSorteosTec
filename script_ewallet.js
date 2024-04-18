fetch('/userData')
    .then(response => response.json())
    .then(data => {
        document.getElementById('nombre').textContent = data.nombre;
        document.getElementById('apellido').textContent = data.apellido;
        console.log("info en string");
        console.log('Datos del usuario:', data);
    })
    .catch(error => console.error('Error al obtener los datos del usuario:', error));