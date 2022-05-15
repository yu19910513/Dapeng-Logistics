//password update
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
};

//bulk archieve//
const bulkSelect = document.getElementById('statusChange');
const daysPS = document.getElementById('maintenance').querySelector('input');
function proceed_archieve() {
 const statusValue = bulkSelect.value;
 const code = prompt('Please enter the passcode to proceed the change')
 if (daysPS.value > 0 && code == '0523') {
    const time = new Date().getTime() - daysPS.value*24*3600*1000;
    if (statusValue == 98) {
        chinaBoxUpdate(time);
     } else if (statusValue == 99) {
        chinaBoxDelete(time);
    }
 } else {
     alert('negative # of days is prohibited!')
 }
};
async function chinaBoxDelete (time){
    const response = await fetch(`/api/box/remove/${time}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        amazonContainerDelete(time);
    }
};
async function  amazonContainerDelete (time){
    const response = await fetch(`/api/container/remove/${time}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        location.reload()
    }
}
async function chinaBoxUpdate (time){
    const response = await fetch(`/api/box/archieve/${time}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        amazonContainerUpdate(time);
    }
};
async function  amazonContainerUpdate(time){
    const response = await fetch(`/api/container/archieve/${time}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        location.reload()
    }
}
