//fetch makeAdmin
function makeAdmin(event) {
    event.preventDefault();
    const email = event.target.querySelector('#admin-email').value;
    const postData = {
        email: email
    };
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    };
    fetch('/makeAdmin', fetchOptions)
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