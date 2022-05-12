const client_list = document.getElementById("user");//****//
const passwordTag = document.getElementById('password');

function client_data() {
    fetch(`/api/user/masterAll`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        for (let i = 0; i < data.length; i++) {
        const user = document.createElement('option');
        user.innerHTML = data[i].name;
        user.setAttribute('value', data[i].id);
        client_list.appendChild(user)
        };
    });
};client_data();

async function proceed() {
    const password = passwordTag.querySelector('input').value.trim();
    const id = client_list.value;
    const code = prompt('Please enter the passcode to proceed the change')
    if (password && id && code == '0523') {
        const response = await fetch(`/api/user/newPassword/${id}`, {
            method: 'Post',
            body: JSON.stringify({
                password: password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert(`The password has been updated successfully to "${password}"`)
            location.reload();
        }
    } else {
        alert('Missing information or incorrect passcode!')
    }
}
