//pasar nombre y apellido
fetch('/userData')
    .then(response => response.json())
    .then(data => {
        document.getElementById('nombre').textContent = data[0].nombre;
        document.getElementById('apellido').textContent = data[0].apellido;
        console.log('Datos del usuario:', data);
    })
    .catch(error => console.error('Error al obtener los datos del usuario:', error));

function openBuscaBorrego(dineroIncial, numeroMinas) {
    // Preparar los datos a enviar en la solicitud POST
    const postData = {
        dinero: dineroIncial,
        minas: numeroMinas
    };

    // Usar la API fetch para enviar la solicitud POST
    fetch('/buscaBorrego/variables', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (response.ok) {
            // Si la solicitud POST fue exitosa, abrir el juego en una ventana emergente
            const features = "width=1440,height=810,left=200,top=200,menubar=no,toolbar=no,location=no,status=no,resizable=yes";
            window.open(`/buscaBorrego/index.html`, 'BuscaBorrego', features);
        } else {
            // Si hubo un problema con la solicitud POST, loguear el error
            console.error('Failed to update game variables');
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(error => {
        // Loguear cualquier error que ocurrió durante el fetch
        console.error('Error during fetch:', error);
    });
}


