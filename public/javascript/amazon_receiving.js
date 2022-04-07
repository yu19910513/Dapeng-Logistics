const today = new Date().toLocaleDateString("en-US");//****//
const newAccountInput = document.getElementById('newAccountInput');//****//
const accountSelect = document.getElementById('account');//****//
const date = document.getElementById('today');
const client_list = document.getElementById("user");//****//
const username = document.getElementById('newUserName');//****//
const password = document.getElementById('newPassword');//****//
const height = document.getElementById('new_hei');//****//
const length = document.getElementById('new_len');//****//
const width = document.getElementById('new_wid');//****//
const description = document.getElementById('new_des');//****//
const container_number = document.getElementById('new_container');//****//
const sku = document.getElementById('sku');
const sku_list = document.getElementById('sku_list');
const sku_table = document.getElementById('sku_table');//****//
///////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
date.value = today;
var masterMap = new Map();
var userMap = new Map();
var accouuntMap = new Map();
//////////////////////////user_data\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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
//////////////////////////account_data\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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
    masterCheck();
    if (accountSelect.value == 0) {
        newAccountInput.style.display = '';
        accountSelect.style.display = 'none'
    }
};

var amazon_box = new Object();
var newClient = new Object();
var newAccount = new Object();
function amazonCreate() {
    const length = document.getElementById('new_len');
    amazon_box.description = description.value.trim();
    amazon_box.length = length.value.trim();
    amazon_box.width = width.value.trim();
    amazon_box.height = height.value.trim();
    amazon_box.container_number = container_number.value.trim();
    const newAccountName = newAccountInput.value.trim();
    const username_d = username.value.trim();
    const password_d = password.value.trim();

    if (username_d && password_d) {
        newClient.name = username_d;
        newClient.username = username_d;
        newClient.password = password_d;
        newAccount.prefix = newAccountName.substring(0,3);
        newAccount.name = newAccountName;
        userCreate(newClient, newAccount)
    }
};

async function userCreate(data, data_2) {
    const response = await fetch('/api/user/newUser', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
      });

      if (response.ok) {
       console.log("user created");
       user_data(data.name, data_2);
      } else {
        alert('try again')
   }
};
function user_data(name, data_2) {
    fetch(`/api/user/`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        for (let i = 0; i < data.length; i++) {
        userMap.set(data[i].name, data[i].id)
        };
        amazon_box.user_id = userMap.get(name);
        accountCreate({
         name: data_2.name,
         prefix: data_2.prefix,
         user_id: amazon_box.user_id
        })
    });
};
async function accountCreate(data) {
    const response = await fetch('/api/account/amazon_newAccount', {
        method: 'post',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
       console.log("account inserted");
       findAccountId(data.user_id)
      } else {
        alert('try again')
   }
};
function findAccountId(id) {
    fetch(`/api/user/${id}`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        for (let i = 0; i < data.length; i++) {
            accouuntMap.set(data[i].name, data[i].id)
        };
        amazon_box.account_id = accouuntMap.get(newAccount.name);
        console.log(amazon_box);
        boxCreate(amazon_box)
    })
};
async function boxCreate(data) {
    const response = await fetch('/api/batch/amazon_box', {
        method: 'post',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
       console.log("amazon box inserted");
       /////////////////////// need to find box_id to insert sku
       location.reload()
      } else {
        alert('try again')
   }
}


//tools
function unattach() {
    if (client_list.value == 0) {
        password.style.display = '';
        username.style.display = ''
    } else {
        password.style.display = 'none';
        username.style.display = 'none'
    };
    newAccountInput.value = null;
    username.value = null;
    password.value = null;
    const old_account = accountSelect.querySelectorAll('option');
    old_account.forEach(i => i.remove());
    const selectOption = document.createElement('option');
    selectOption.innerHTML = 'select account';
    const zero = document.createElement('option');
    zero.innerHTML = '--- create new account ---';
    zero.setAttribute('value', 0);
    accountSelect.appendChild(selectOption);
    accountSelect.appendChild(zero);
    document.getElementById('order_pre-check').style.display = 'none';
    document.getElementById('fake').style.display = '';
};
function masterCheck() {
    const description_d = description.value.trim();
    const length_d = length.value.trim();
    const width_d = width.value.trim();
    const height_d = height.value.trim();
    const container_d = container_number.value.trim();
    const client_list_d = client_list.value;
    const account_d = accountSelect.value;
    if (description_d && length_d && width_d && height_d && container_d && client_list_d && account_d && validation(client_list_d, account_d) ) {
        document.getElementById('order_pre-check').style.display = '';
        document.getElementById('fake').style.display = 'none';
    } else {
        document.getElementById('order_pre-check').style.display = 'none';
        document.getElementById('fake').style.display = '';
    }
};
function validation(c, a) {
    if (c == 0) {
        if (username.value.trim() && password.value.trim() && newAccountInput.value.trim()) {
            return true
        } else {
            return false
        }
    } else if (a == 0) {
        if (newAccountInput.value) {
            return true
        } else {
            return false
        }
    } else {
        return true
    }
};



//////////scanned items\\\\\\\\\\\
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

};


// skuValue.substring(0,2) == 'AM' && !isNaN(skuValue.substring(2,skuValue.length)) && skuValue.length == 8
