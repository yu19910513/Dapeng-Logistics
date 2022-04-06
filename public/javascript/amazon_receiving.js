const today = new Date().toLocaleDateString("en-US");
const newAccountInput = document.getElementById('newAccountInput');
const accountSelect = document.getElementById('account');
const accountDiv = document.getElementById('accountDiv');
const date = document.getElementById('today');
const client_list = document.getElementById("user");
const username = document.getElementById('newUserName');
const password = document.getElementById('newPassword');

const height = document.getElementById('new_hei');
const length = document.getElementById('new_len');
const width = document.getElementById('new_wid');
const container_number = document.getElementById('new_container');
const sku = document.getElementById('sku');
const sku_list = document.getElementById('sku_list')

date.value = today;
var masterMap = new Map();

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
};
client_data();

function account_data() {
    unattach();
    fetch(`/api/user/account_per_user`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (account_data) {
        let data = account_data[client_list.value];
        if (!data) {
            newAccountInput.style.display = '';
            accountSelect.style.display = 'none'
        } else {
            newAccountInput.style.display = 'none';
            accountSelect.style.display = '';
            accountSelect.disabled = false;
            for (let i = 0; i < data.length; i++) {
                const account = document.createElement('option');
                account.innerHTML = data[i].name;
                account.setAttribute('value', data[i].id);
                accountSelect.appendChild(account)
            };
        }
    });
};

function accountSelection() {
    if (accountSelect.value == 0) {
        newAccountInput.style.display = '';
        accountSelect.style.display = 'none'
    }
};

function unattach() {
    if (client_list.value == 0) {
        password.style.display = '';
        username.style.display = ''
    } else {
        password.style.display = 'none';
        username.style.display = 'none'
    };
    const old_account = accountSelect.querySelectorAll('option');
    old_account.forEach(i => i.remove());
    const selectOption = document.createElement('option');
    selectOption.innerHTML = 'select account';
    const zero = document.createElement('option');
    zero.innerHTML = '--- create new account ---';
    zero.setAttribute('value', 0);
    accountSelect.appendChild(selectOption);
    accountSelect.appendChild(zero)
};

var skuArr = [];
var skuMap = new Map()
function itemInput() {
    const skuValue = sku.value.trim().toUpperCase();
   if (skuValue.substring(0,1) == 'X' && skuValue.length == 10) {
    if (skuArr.includes(skuValue)) {
        const skuAmount = document.getElementById(`${skuValue}c`);
        const totalAmount = parseInt(skuAmount.innerHTML) + 1;
        skuAmount.innerHTML = totalAmount;
        skuMap.set(skuValue, totalAmount);
    } else {
        skuArr.push(skuValue);
        skuMap.set(skuValue, 1);
        const trTag = document.createElement('tr');
        const skuLabel = document.createElement('td');
        const skuInit = document.createElement('td');
        trTag.appendChild(skuLabel);
        trTag.appendChild(skuInit);
        sku_list.appendChild(trTag);
        trTag.setAttribute('id', `${skuValue}t`)
        skuInit.setAttribute('id', `${skuValue}c`);
        skuInit.innerHTML = 1;
        skuLabel.innerHTML = skuValue;
    };
    sku.value = null;
   } else if (skuValue.substring(0,1) == '-' && skuValue.length == 11) {
        const newSku = skuValue.substring(1, skuValue.length);
        const skuAmount = document.getElementById(`${newSku}c`);
        const totalAmount = parseInt(skuAmount.innerHTML) - 1;
        const trTag = document.getElementById(`${newSku}t`)
        if (totalAmount < 1) {
            trTag.remove();
            skuMap.delete(newSku);
            skuArr = skuArr.filter(i => i != newSku);
            sku.value = null;
        } else {
            skuAmount.innerHTML = totalAmount;
            skuMap.set(newSku, totalAmount);
            sku.value = null;
        }
   }

}


// skuValue.substring(0,2) == 'AM' && !isNaN(skuValue.substring(2,skuValue.length)) && skuValue.length == 8
