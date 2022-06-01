const today = new Date().toLocaleDateString("en-US");//****//
const newAccountInput = document.getElementById('newAccountInput');//****//
const accountSelect = document.getElementById('account');//****//
const date = document.getElementById('today');
const loader = document.getElementById('loader'); // loader
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
var itemCount = 0;
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
    document.getElementById("scanDiv").style.display = 'none';
    fetch(`/api/user/account_per_user`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data_u) {
        const data = data_u[client_list.value]
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
    };
};

var checker = false
var tempCost = 0;
function containerChecker(cNumber) {
    fetch(`/api/container/amazon_container/${cNumber}`, {
        method: 'GET'
    }).then(function (response) {
        if (response.status == 500) {
            document.getElementById('uniqueMark').innerHTML = `&#10004;`;
        }
        return response.json();
    }).then(function (data) {
        if (data.id && client_list.value == data.user_id && accountSelect.value == data.account_id) {
            alert('This box is already assocaited with this account! Please use refill mode to add more items')
            let code = prompt('Please enter the passcode to override the restriction');
            if(code == '0523') {
                checker = true;
                amazon_box.id = data.id;
                amazon_box.user_id = data.user_id;
                amazon_box.account_id = data.account_id;
                tempCost = data.cost;
                length.value = (data.length/2.54).toFixed(2);
                width.value = (data.width/2.54).toFixed(2);
                height.value = (data.height/2.54).toFixed(2);
            } else {
                container_number.value = null;
            }
        } else if (data.id && client_list.value == data.user_id) {
            alert(`This box is already associated with the account: ${data.account.name}! Please use a new amazon box #`);
            let code = prompt('Please enter the passcode to override the restriction');
            if(code == '0523') {
                checker = true;
                amazon_box.id = data.id;
                amazon_box.user_id = data.user_id;
                amazon_box.account_id = data.account_id;
                tempCost = data.cost;
                length.value = (data.length/2.54).toFixed(2);
                width.value = (data.width/2.54).toFixed(2);
                height.value = (data.height/2.54).toFixed(2);
            } else {
                container_number.value = null;
            }
        } else if (data.id) {
            alert(`This box is already associated with a client ${data.user.name}! Please use a new amazon box #`);
            container_number.value = null;
        }
    })
};

var amazon_box = new Object();
var newClient = new Object();
var newAccount = new Object();
function amazonCreate() {
    if (itemCount < 1 && !confirm('No item was scanned! Continue to create an empty amazon box?')) {
        return
    };
    loader.style.display = '';
    const length = document.getElementById('new_len');
    amazon_box.description = description.value.trim();
    amazon_box.length = length.value.trim()*2.54;
    amazon_box.width = width.value.trim()*2.54;
    amazon_box.height = height.value.trim()*2.54;
    amazon_box.volume = amazon_box.length * amazon_box.width * amazon_box.height;
    amazon_box.container_number = container_number.value.trim().toUpperCase();
    amazon_box.cost = itemCount;
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
    } else if (newAccountName) {
        amazon_box.user_id = client_list.value;
        newAccount.user_id = client_list.value;
        newAccount.prefix = newAccountName.substring(0,3);
        newAccount.name = newAccountName;
        accountCreate(newAccount)
    } else if (checker) {
        amazon_box.cost += tempCost;
        updateCost(amazon_box.cost, amazon_box.id);
        itemCreate();
    } else {
        amazon_box.user_id = client_list.value;
        amazon_box.account_id = accountSelect.value;
        boxCreate(amazon_box)
    }
};
async function userCreate(data, data_2) {
    console.log('user created');
    const response = await fetch('/api/user/newUser', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
      });

      if (response.ok) {
       console.log("user inserted");
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
        console.log('user_id fetched');
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
    console.log('account created');
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
    fetch(`/api/user/accountsbyuser_id/${id}`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log('account_id fetched');
        for (let i = 0; i < data.length; i++) {
            accouuntMap.set(data[i].name, data[i].id)
        };
        amazon_box.account_id = accouuntMap.get(newAccount.name);
        console.log(amazon_box);
        boxCreate(amazon_box)
    })
};
async function boxCreate(data) {
    console.log('boxCreate');
    const response = await fetch('/api/batch/amazon_box', {
        method: 'post',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
       console.log("amazon box inserted");
       findContainerId(data.container_number);
      } else {
        alert('try again')
   }
};
function findContainerId(c_number) {
    console.log('getting container_id');
    fetch(`/api/container/amazon_container/${c_number}`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log('container_id fetched');
       amazon_box.id = data.id
       itemCreate()
    })
};
function itemCreate() {
    console.log('itemCreate');
    var rows = sku_table.rows;
    for (let i = 1; i < rows.length; i++) {
        var item = new Object()
        item.item_number = rows[i].cells[0].innerHTML;
        item.qty_per_sku = parseInt(rows[i].cells[1].innerHTML);
        item.user_id = amazon_box.user_id;
        item.account_id = amazon_box.account_id;
        item.container_id = amazon_box.id;
        item.description = amazon_box.description;
        loadingItems(item);
    };
    loader.style.display = 'none';
    alert(`1 container(#${amazon_box.container_number}) with ${itemCount} items is inserted to client_id: ${amazon_box.user_id}!`)
    resetBoxSku();
};
function loadingItems(data) {
    fetch('/api/item/new', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });
};


//tools
function resetBoxSku() {
    if (accountSelect.value == 0) {
        location.reload();
    } else {
        sku_list.querySelectorAll('tr').forEach(i => i.remove());
        container_number.value = null;
        skuArr = [];
        itemCount = 0;
        skuMap.clear();
        masterCheck();
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
    const sku_number = document.getElementById('scan');
    sku_number.value = null;
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
    if (description_d && length_d && width_d && height_d && container_d.substring(0,2).toUpperCase() == 'AM' && container_d.length == 8 && client_list_d && account_d && validation(client_list_d, account_d)) {
        containerChecker(container_d);
        document.getElementById('order_pre-check').style.display = '';
        document.getElementById('fake').style.display = 'none';
    } else {
        document.getElementById('uniqueMark').innerHTML = '';
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
function updateCost(cost, id) {
    fetch(`/api/container/updateCost/${cost}&${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'}
    });
};



//////////scanned items\\\\\\\\\\\
var skuArr = [];
var skuMap = new Map()
function itemInput() {
    const skuValue = sku.value.trim().toUpperCase();
   if ((skuValue.substring(0,1) == 'X' && skuValue.length == 10) || (skuValue.length > 6 && skuValue.substring(0,1) != '-')) {
    if (skuArr.includes(skuValue)) {
        itemCount++;
        const skuAmount = document.getElementById(`${skuValue}c`);
        const totalAmount = parseInt(skuAmount.innerHTML) + 1;
        skuAmount.innerHTML = totalAmount;
        skuMap.set(skuValue, totalAmount);
    } else {
        itemCount++;
        skuArr.push(skuValue);
        skuMap.set(skuValue, 1);
        const trTag = document.createElement('tr');
        const skuLabel = document.createElement('td');
        const skuInit = document.createElement('td');
        trTag.appendChild(skuLabel);
        trTag.appendChild(skuInit);
        sku_list.prepend(trTag);
        trTag.setAttribute('id', `${skuValue}t`)
        skuInit.setAttribute('id', `${skuValue}c`);
        skuInit.innerHTML = 1;
        skuLabel.innerHTML = skuValue;
    };
    sku.value = null;
   } else if (skuValue.substring(0,1) == '-' && skuValue.length > 6) {
        const newSku = skuValue.substring(1, skuValue.length);
        const skuAmount = document.getElementById(`${newSku}c`);
        if (skuAmount) {
            itemCount--;
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

};
function scanSKU() {
    const sku_number = document.getElementById('scan');
    fetch(`/api/item/infoPerNumber/${sku_number.value}`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data.item_number){
            document.getElementById("scanDiv").style.display = 'none';
            unattachUser();
            const user = document.createElement('option');
            user.innerHTML = data.user.name;
            user.setAttribute('value', data.user_id);
            client_list.appendChild(user);
            client_list.disabled = true;
            const account = document.createElement('option');
            account.innerHTML = data.account.name;
            account.setAttribute('value', data.account_id);
            accountSelect.appendChild(account);
            if (data.description) {
                description.value = data.description
            }
        } else {
            unattachUser();
            const selectOption = document.createElement('option');
            selectOption.innerHTML = 'select client';
            const zero = document.createElement('option');
            zero.innerHTML = '--- create new client ---';
            zero.setAttribute('value', 0);
            client_list.appendChild(selectOption);
            client_list.appendChild(zero);
            client_data();
        }
    })
};
function unattachUser() {
    const old_user = client_list.querySelectorAll('option');
    old_user.forEach(i => i.remove());
    accountSelect.disabled = false;
};

const creater_form = document.getElementById('creator_form');
const quick_form = document.getElementById('qucik_receiving');
const scanned_item = document.getElementById('scanned_item');
const clientName_q = document.getElementById('clientName_q');
const accountName_q = document.getElementById('accountName_q');
const containerNumber_q = document.getElementById('containerNumber_q');
const inserted_item = document.getElementById('inserted_item');
function modeChange() {
    if (mode.innerHTML == 'Create') {
      localStorage.setItem('amazon_mode', 'Q');
      mode.innerHTML = 'Refill';
      creater_form.style.display = 'none';
      quick_form.style.display ='';
      document.getElementById("badge").classList.add('bg-danger');
      document.getElementById("badge").classList.remove('bg-success');
    } else {
      localStorage.setItem('amazon_mode', 'C')
      mode.innerHTML = 'Create';
      creater_form.style.display = '';
      quick_form.style.display ='none';
      document.getElementById("badge").classList.add('bg-success');
      document.getElementById("badge").classList.remove('bg-danger');
    }
};
var quickContainerObj = new Object();
function quickReceiving() {
    const scannedBox = scanned_item.value.trim().toUpperCase();
    if (scannedBox.substring(0,2) == 'AM' && scannedBox.length == 8) {
        fetch(`/api/container/amazon_container/${scannedBox}`, {
            method: 'GET'
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            quickContainerObj.user_id = data.user_id;
            quickContainerObj.account_id = data.account_id;
            quickContainerObj.container_id = data.id;
            quickContainerObj.cost = data.cost;
            quickContainerObj.container_number = scannedBox;
            clientName_q.innerHTML = data.user.name;
            accountName_q.innerHTML = data.account.name;
            containerNumber_q.innerHTML = scannedBox;
            scanned_item.value = null;
        })
    } else if (scannedBox.length > 4 && !scannedBox.includes('-')){
        if (quickContainerObj.user_id) {
            quickContainerObj.cost++;
            quickContainerObj.item_number = scannedBox;
            updateCost(quickContainerObj.cost, quickContainerObj.container_id);
            duplicatationValidator(quickContainerObj);
            // loadingItems(quickContainerObj);
            scanned_item.value = null;
            const newsku = document.createElement('div');
            inserted_item.prepend(newsku);
            newsku.innerHTML = `Insert <b>${scannedBox}</b> into <b>${quickContainerObj.container_number}</b>`
        } else {
            alert('You need to scan the existed amazon box first!');
            scanned_item.value = null;
        }

    }
};
var timer = null;
function delay(fn){
    clearTimeout(timer);
    timer = setTimeout(fn, 100)
};

var itemchecker = false
function duplicatationValidator(obj) {
    fetch(`/api/item/findAllPerContainer/${obj.container_id}`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (item) {
        for (let i = 0; i < item.length; i++) {
            var uniqueItemN = item[i];
            if(uniqueItemN.item_number == obj.item_number) {
                uniqueItemN.qty_per_sku++
                updateExistedItem(obj, uniqueItemN.qty_per_sku);
                itemchecker = true
            };
        };
        if (itemchecker == false) {
            loadingItems(obj);
        } itemchecker = false;
    });
};
async function updateExistedItem(obj, newSkuQ) {
    const load = await fetch(`/api/item/updateQty_ExistedItem/${obj.container_id}&${obj.item_number}`, {
        method: 'PUT',
        body: JSON.stringify({
            qty_per_sku: newSkuQ
        }),
        headers: {'Content-Type': 'application/json'}
    })
};

//reload
function reconciliation() {
    location.reload();
};

if (localStorage.getItem('amazon_mode') == 'Q') {
    document.getElementById('badge').click();
}


var allContainerArr = [];
var emptyArr = [];
function removeEmptyContainer() {
    fetch(`/api/item/allItemAdmin`, {
        method: 'GET'
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if(!allContainerArr.includes(item.container_id)) {
                allContainerArr.push(item.container_id)
            };

        };
        fetch(`/api/container/allContainerAdmin`, {
            method: 'GET'
          }).then(function (response) {
            return response.json();
          }).then(function (data) {
            for (let i = 0; i < data.length; i++) {
                const container = data[i];
                if(!allContainerArr.includes(container.id) && container.cost == 0) {
                    emptyArr.push(container.container_number)
                }; //cost == 0 means the empty box has been recently billed and ready to get reset

            };
            if (!emptyArr.length) {
                alert('No empty container was found in the database')
            } else {
                console.log(emptyArr);
                // removeEmpty(emptyArr);
            }
          })
      });
};
// async function removeEmpty(Arr) {
//     const response = await fetch(`/api/container/destroyBulk/`, {
//         method: 'DELETE',
//         body: JSON.stringify({
//             id: Arr
//         }),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });

//     if (response.ok) {
//         alert(`Successfully remove ${Arr.length} empty containers! `)
//     }
// }
