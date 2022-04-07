const accountIn = document.getElementById('accountIn');//****//
const accountOut = document.getElementById('accountOut');//****//
const client_list = document.getElementById("user");//****//

function client_data() {
    fetch(`/api/user/`, {
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
function account_data() {
    unattach();
    fetch(`/api/user/account_per_user`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data_u) {
        const data = data_u[client_list.value]
        if (data) {
            accountIn.disabled = false;
            accountOut.disabled = false;
            for (let i = 0; i < data.length; i++) {
                const accountInOpt = document.createElement('option');
                const accountOutOpt = document.createElement('option');
                accountInOpt.innerHTML = data[i].name;
                accountInOpt.setAttribute('value', data[i].id);
                accountOutOpt.innerHTML = data[i].name;
                accountOutOpt.setAttribute('value', data[i].id);
                accountIn.appendChild(accountInOpt);
                accountOut.appendChild(accountOutOpt)
            };
        }
    });
};
function unattach() {
    if(!client_list.value) {
        accountIn.disabled = true;
        accountOut.disabled = true;
    }
    const old_account = accountIn.querySelectorAll('option');
    const old_account_2 = accountOut.querySelectorAll('option');
    old_account.forEach(i => i.remove());
    old_account_2.forEach(i => i.remove());
    const selectOption = document.createElement('option');
    const selectOption_2 = document.createElement('option');
    selectOption_2.innerHTML = 'select account';
    selectOption.innerHTML = 'select account';
    accountIn.appendChild(selectOption);
    accountOut.appendChild(selectOption_2)
};

async function merge() {
    let code = prompt('Please enter the passcode to confirm the merge');
    const account_id_2 = accountIn.value;
    const account_id = accountOut.value;
    const user_id = client_list.value;
    if (account_id && account_id_2 && user_id && code == '0523') {
      const response = await fetch(`/api/box/account_merge`, {
        method: 'PUT',
        body: JSON.stringify({
            user_id,
            account_id,
            account_id_2
        }),
        headers: {
            'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        accountDelete(account_id)
        batchUpdate({
            user_id,
            account_id,
            account_id_2
        })
      } else {
        accountDelete(account_id)
        batchUpdate({
            user_id,
            account_id,
            account_id_2
        })
      }
    } else {
        alert('missing information; please revise and try again')
    }
}

async function batchUpdate(data) {
    const response = await fetch(`/api/batch/account_merge`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        alert('batch and boxes are merged!')
        location.reload()
      } else {
        alert('boxes are merged!')
        location.reload()
      }
};

function accountDelete(id) {
    fetch(`/api/account/destroy/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
      })
};

function self_delete() {
    if (accountIn.value == accountOut.value) {
        alert('You cannot merge one account to itslef!')
        location.reload();
    }
};
