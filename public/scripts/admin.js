//fetch makeAdmin
function upgradeAdmin(event) {
    const email = event.target.querySelector('#admin-email').value;
    console.log("1");
    upgradeAdminFetch(email);
}

function upgradeAdminFetch(email) {
    console.log("2");
    const data = {
        email: email
    };

    fetch('/makeAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

        .then(response => {
            if (!response.ok) {
                throw new Error('Error al hacer admin');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert(data.message);
            } else {
                alert('Usuario ahora es admin');
            }
        })
        .catch(error => {
            console.error('Error al hacer admin:', error);
            alert('Error al hacer admin: ' + error.message);
        });
}