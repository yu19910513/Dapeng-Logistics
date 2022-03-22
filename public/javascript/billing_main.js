const client_list = document.getElementById('client_list');
const account_list = document.getElementById('account_list');
function client_data() {
    fetch(`/api/user/`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
        const user = document.createElement('option');
        user.innerHTML = data[i].name;
        user.setAttribute('value', data[i].id);
        client_list.appendChild(user)
        };
    });
};
client_data();

function client() {
 if (client_list.value != 0) {
    document.getElementById('account_list').style.display = '';
    document.getElementById('client_list').disabled = true;
    account_data(client_list.value)
 }
}
function account() {
    if (account_list.value !=0 ) {
        document.getElementById('month_list').style.display = '';
    } else {
        document.getElementById('month_list').style.display = 'none';
    }
}

function account_data(user_id) {
    fetch(`/api/user/account_per_user`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            if (data[i].user.id == user_id) {
            const account = document.createElement('option');
            account.innerHTML = data[i].name;
            account.setAttribute('value', data[i].id);
            account_list.appendChild(account)
            }
        };
    });
}
