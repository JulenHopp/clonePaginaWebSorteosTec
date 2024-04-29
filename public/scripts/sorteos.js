function accionBoleto(numeroBoleto) {
    const postData = {
        cupon_id: numeroBoleto
    };

    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    };

    fetch('/registrar-compra-cupones', fetchOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Saldo insuficiente');
            }
            return response.json();  // Sólo intenta parsear como JSON si la respuesta fue exitosa
        })
        .then(data => {
            if (data.error) {
                alert(data.message);  // Mostrar el mensaje de error en un pop-up
            } else {
                alert('Compra realizada con éxito!');  // Confirmación de compra exitosa
            }
        })
        .catch(error => {
            console.error('Error en la compra:', error);
            alert('Error en la compra: ' + error.message);
        });
}
