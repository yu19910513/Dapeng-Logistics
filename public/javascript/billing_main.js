const client_list = document.getElementById('client_list');
const account_list = document.getElementById('account_list');
const month_list = document.getElementById('month_list');
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
    document.getElementById('account_list').disabled = false;
    document.getElementById('client_list').disabled = true;
    account_data(client_list.value)
 }
};

function account() {
if (account_list.value != 0) {
   document.getElementById('month_list').disabled = false;
}
};

function month() {
if (month_list.value != 0) {
    document.getElementById('proceed_btn').disabled = false;
}
}

function account_data(user_id) {
    fetch(`/api/user/account_per_user`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
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


var cell_table = document.getElementById('cell_table');
function next() {
    document.getElementById('myTable').style.display = '';
    const user_id = document.getElementById('client_list').value;
    const account_id = document.getElementById('account_list').value;
    if (account_id == 0) {
        alert('please select client, then select account!')
    } else
    fetch('/api/user/billing_per_account', {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        const pageData = data[account_id];
        for (let i = 0; i < pageData.length; i++) {
            const container = document.createElement('tr');
            cell_table.appendChild(container);
            const user = document.createElement('td');
            const account = document.createElement('td');
            const box_number = document.createElement('td');
            const description = document.createElement('td');
            const received_date = document.createElement('td');
            const ending_date = document.createElement('td');
            const volume = document.createElement('td');
            const billable = document.createElement('td');
            const cost = document.createElement('td');
            container.appendChild(user);
            container.appendChild(account);
            container.appendChild(box_number);
            container.appendChild(description);
            container.appendChild(received_date);
            container.appendChild(ending_date);
            container.appendChild(volume);
            container.appendChild(billable);
            container.appendChild(cost);
            user.innerHTML = pageData[i].user.name;
            account.innerHTML = pageData[i].account.name;
            box_number.innerHTML = pageData[i].box_number;
            description.innerHTML = pageData[i].description;
            received_date.innerHTML = pageData[i].received_date;
            if (pageData[i].shipped_date) {
                ending_date.innerHTML = pageData[i].shipped_date;
            } else {ending_date.innerHTML = new Date().toLocaleDateString("en-US");};
            volume.innerHTML = pageData[i].volume

        }

    });
}


function thirty_day(ending_date) {
    const today = new Date().toLocaleDateString("en-US");


}
