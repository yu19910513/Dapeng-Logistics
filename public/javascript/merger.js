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
        containerUpdate({
            account_id,
            account_id_2
        });
        itemUpdate({
            account_id,
            account_id_2
        });
        batchUpdate({
            user_id,
            account_id,
            account_id_2
        })
      } else {
        containerUpdate({
            account_id,
            account_id_2
        });
        itemUpdate({
            account_id,
            account_id_2
        });
        batchUpdate({
            user_id,
            account_id,
            account_id_2
        })
      }
    } else {
        alert('missing information; please revise and try again')
    }
};
async function batchUpdate(data) {
    const response = await fetch(`/api/batch/account_merge`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        accountDelete(data.account_id)
        alert('batch and boxes are merged!')
        location.reload()
      } else {
        accountDelete(data.account_id)
        alert('boxes are merged!')
        location.reload()
      }
};
function containerUpdate(data) {
    fetch(`/api/container/account_merge`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
};
function itemUpdate(data) {
    fetch(`/api/item/account_merge`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
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
//helper functions
const manual_input = document.getElementById('manualChecker');
var timer = null;
function delay(fn){
    var time;
    if (manual_input.checked) {
        time = 2000
    } else {
        time = 50
    };
    clearTimeout(timer);
    timer = setTimeout(fn, time)
};
function error() {
  var audio = new Audio('../media/wrong.mp3');
  audio.play();
};
function getContainer(input, div) {
    fetch(`/api/container/amazon_container/${input}`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (!data.length) {
            error();
            div.querySelector('input').value = null;
        } else {
            const container = new Object();
            div.querySelectorAll('p').forEach(i => i.remove());
            if (containerMap.get(input)) {
                div.querySelector('input').value = null;
                error();
            } else {
                div.querySelector('input').disabled = true;
                const notes = document.createElement('p');
                div.appendChild(notes);
                notes.innerHTML = `User: ${data.user.name}, Account: ${data.account.name}`;
                localStorage.setItem(div.id, input);
                container.user_id = data.user_id;
                container.account_id = data.account_id;
                container.id = data.id;
                container.cost = data.cost;
                containerMap.set(input, container);
            }
            if(containerMap.size == 2) {
                document.getElementById('ataBtn').style.display = '';
                document.getElementById('pBtn').style.display = '';
            }
        }
    });
};
//container merger
const fromDiv = document.getElementById('fromContainer');
const toDiv = document.getElementById('toContainer');
var containerMap = new Map();
function fromInput() {
    const input = fromDiv.querySelector('input').value.toUpperCase().trim();
    getContainer(input, fromDiv);
    toDiv.querySelector('input').disabled = false;
};
function toInput() {
    const input = toDiv.querySelector('input').value.toUpperCase().trim();
    getContainer(input, toDiv);
};
async function ataMerge() {
    const fromData = containerMap.get(localStorage.getItem('fromContainer'));
    const toData = containerMap.get(localStorage.getItem('toContainer'));
    const response = await fetch(`/api/item/container_merge`, {
        method: 'PUT',
        body: JSON.stringify({
            fromData,
            toData
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        //need to remove empty container (ensure it's billed)
        //need to reconcile the items (merge item qty)
        location.reload();
    }
};
