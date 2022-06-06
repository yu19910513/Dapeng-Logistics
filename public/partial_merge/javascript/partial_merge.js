console.log('partial_merge');
localStorage.clear();
var containerMap = new Map();
function getContainer(input, div) {
    fetch(`/api/container/amazon_container/${input}`, {
        method: 'GET'
    }).then(function (response) {
        if (response.status == 500) {
            return null
        } else {
            return response.json();
        }
    }).then(function (data) {
        localStorage.removeItem(div.id);
        document.getElementById('okBtn').disabled = true;
        if (!data) {
            div.parentElement.querySelectorAll('p').forEach(i => i.remove());
            const notes = document.createElement('p');
            div.parentElement.appendChild(notes);
            notes.innerHTML = `<small class="text-danger">${input} is not eligible for merging</small>`;
        } else {
            const container = new Object();
            div.parentElement.querySelectorAll('p').forEach(i => i.remove());
            const notes = document.createElement('p');
            div.parentElement.appendChild(notes);
            notes.innerHTML = `User: ${data.user.name}, Account: ${data.account.name}`;
            localStorage.setItem(div.id, input);
            container.user_id = data.user_id;
            container.account_id = data.account_id;
            container.id = data.id;
            container.cost = data.cost;
            containerMap.set(input, container);
            if(containerMap.size == 2 && localStorage.getItem('toContainer') != localStorage.getItem('fromContainer')) {
                const toNumber = localStorage.getItem('toContainer');
                const fromNumber = localStorage.getItem('fromContainer')
                if (toNumber[0] != fromNumber[0] && (toNumber[0] == "R" || fromNumber[0] == "R")) {
                    if (fromNumber[0] != "R") {
                        alert('Direct SKU transfer from physical box (AM, SP, and TEMP) to virtual box (REQ) is prohibited!');
                        localStorage.removeItem(div.id);
                        div.value = null;
                        div.parentElement.querySelectorAll('p').forEach(i => i.remove());
                        containerMap.delete(input);
                    } else {
                        document.getElementById('okBtn').disabled = false;
                        document.getElementById('okBtn').href = `/partial_merge/${containerMap.get(localStorage.getItem('fromContainer')).id}&${containerMap.get(localStorage.getItem('toContainer')).id}`
                    }
                } else {
                    document.getElementById('okBtn').disabled = false;
                    document.getElementById('okBtn').href = `/partial_merge/${containerMap.get(localStorage.getItem('fromContainer')).id}&${containerMap.get(localStorage.getItem('toContainer')).id}`
                }
            } else if (localStorage.getItem('toContainer') == localStorage.getItem('fromContainer')) {
                div.value = null;
                div.parentElement.querySelectorAll('p').forEach(i => i.remove());
                localStorage.removeItem(div.id);
            }
        }
    });
};
function findId(params) {
    const inputDiv = document.getElementById(params);
    const input = inputDiv.value.toUpperCase().trim();
    if (input.length >= 5) {
        getContainer(input, inputDiv)
    }
};
function error() {
    var audio = new Audio('../media/wrong.mp3');
    audio.play();
};

const container_id = location.href.split('/').slice(-1)[0].split('&')[0];
const pre_shipN = document.getElementById('pre-shipN');
const notes = document.getElementById('notes');
const input = document.getElementById("scanned_item");
const checkBox = document.getElementById('scanned_whole');
const sku_list = document.getElementById('sku_list');
var sku_list_am;
if (!sku_list) {
    sku_list_am = document.getElementById('to_confirmTable').querySelector('tbody');
    sku_list_am.querySelectorAll('tr').forEach(tr => tr.setAttribute('class', 'bg-secondary'))
};

const newContainerTable = document.getElementById('sku_table');
var item_numberMap = new Map();
var id_qtyMap = new Map();
var iidArr = [];
var user_id, account_id;
var selectedSkuArr = [];
var skuArr = [];
var printCheck = false;
if (!localStorage.getItem('sp_number')) {
    localStorage.setItem('sp_number', 0)
} else {
    localStorage.setItem('sp_number', parseInt(localStorage.getItem('sp_number'))+1)
};

var container_numberArr = [];
function supplemental () {
    fetch(`/api/container/container/${container_id}`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data.length) {
            user_id = data[0].user_id;
            account_id = data[0].account_id;
            console.log(user_id, account_id);
            // notes.innerHTML = data[0].notes;
            const descriptionArr = document.getElementById('from_confirmTable').querySelectorAll('h5');
            const tableArr = document.getElementById('from_confirmTable').querySelectorAll('table')
            for (let i = 0; i < descriptionArr.length; i++) {
                const container_number = descriptionArr[i].innerText.split(':')[0];
                descriptionArr[i].setAttribute('id',container_number);
                tableArr[i].setAttribute('id', `t_${container_number}`);
                container_numberArr.push(container_number);
            };
            itemIdCollection();
        } else {
            window.location.replace('/admin_move_main_amazon');
        }
    })
};supplemental();

function itemIdCollection() {
    fetch(`/api/item/findAllPerContainer/${container_id}`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                const item_number = data[i].item_number;
                const description = data[i].description;
                const item_id = data[i].id;
                var box_number;
                if (!data[i].description || !description.includes(':')) {
                    const descriptionOne = document.querySelector('h5');
                    box_number = descriptionOne.innerText.split(':')[0];
                } else {
                    box_number = description.split(':')[0];
                };
                const itemCode = `${item_number}-${box_number}`;
                item_numberMap.set(itemCode, item_id)
                skuArr.push(itemCode)
            }
        } else {
            console.log('no item in this container! box self-destroyed');
            updateReqContainer(container_id);
        }
    })
};

//helper function for bulk check
function auth() {
    if (checkBox.checked) {
        const passcode = prompt('Please enter passcode to enable bulk-check function');
        if (passcode != '0523') {
            checkBox.checked = false;
            alert('The passcode is incorrect!')
        }
    }
}
//input function
function pre_check() {
    printCheck = false
    document.getElementById('alert').innerHTML = null;
    const value = input.value.trim();
    const all_td = document.querySelectorAll('#from_confirmTable td');
    if (container_numberArr.includes(value) && document.getElementById(value).getAttribute('class') != 'lead text-center rounded shadow-sm bg-info') {
        for (let i = 0; i < container_numberArr.length; i++) {
            document.getElementById(container_numberArr[i]).setAttribute('class', 'lead text-center rounded shadow-sm bg-light')
        };
        document.getElementById(value).setAttribute('class','lead text-center rounded shadow-sm bg-info');
        localStorage.setItem('selectedBox',value);
        const eachTable = document.getElementById(`t_${value}`);
        const rows = eachTable.rows;
        for (let i = 1; i < rows.length; i++) {
            const sku = rows[i].getElementsByTagName("td")[0];
            sku.setAttribute('id',`${sku.innerText}_${value}`)
            const qty = rows[i].getElementsByTagName("td")[1];
            qty.setAttribute('id',`qty_${sku.innerText}_${value}`)
        };
        input.value = null;
    } else if (container_numberArr.includes(value) && document.getElementById(value).getAttribute('class') == 'lead text-center rounded shadow-sm bg-info') {
        if (checkBox.checked) {
            const eachTable = document.getElementById(`t_${value}`);
            const rows = eachTable.rows;
            rows[0].setAttribute('class','bg-info');
            for (let i = 1; i < rows.length; i++) {
                rows[i].setAttribute('class','bg-info')
                const sku = rows[i].getElementsByTagName("td")[0];
                selectedSkuArr.push(`${sku.innerText}-${localStorage.getItem('selectedBox')}`);
                eachBoxContent(rows[i])
            };
            input.value = null;
        } else {
            input.value = null;
        }
    } else if (skuArr.includes(`${value}-${localStorage.getItem('selectedBox')}`) && !selectedSkuArr.includes(`${value}-${localStorage.getItem('selectedBox')}`) && document.getElementById(localStorage.getItem('selectedBox')).getAttribute('class') == 'lead text-center rounded shadow-sm bg-info') {
        const qtyPerSKu = document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`);
        if (qtyPerSKu) {
            const newQty = parseInt(qtyPerSKu.innerHTML)-1;
            const iid = item_numberMap.get(`${value}-${localStorage.getItem('selectedBox')}`);
            if (newQty > 0) {
                document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`).innerHTML = newQty;
                id_qtyMap.set(iid,newQty);
                if (!iidArr.includes(iid)) {
                    iidArr.push(iid); // arr to store updated info for master boxes
                };
                eachBoxContent(null, value);
                input.value = null;
            } else if (newQty == 0) {
                eachBoxContent(null, value);
                iidArr = iidArr.filter(id => id != iid); // remove qty-0 item from upadte arr becuase it will be removed
                document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`).innerHTML = newQty;
                document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`).parentElement.setAttribute('class','bg-info');
                selectedSkuArr.push(`${document.getElementById(`${value}_${localStorage.getItem('selectedBox')}`).innerHTML}-${localStorage.getItem('selectedBox')}`);// deleteArr for 0-qty item
                input.value = null;
            }
        } else {
            error();
            document.getElementById('alert').innerHTML = `${value} is not associated with the box: ${localStorage.getItem('selectedBox')}; please scan the right box first`;
            input.value = null;
        }
    } else if (value[0] == '-') {
        var removeItemMap = new Map();
        var removeArr = [];
        const removedValue = value.substring(1,value.length);
        var rows;
        if (newContainerTable) {
            rows = newContainerTable.rows;
        } else {
            rows = sku_list_am.parentElement.rows;
        }
        for (let r = 1; r < rows.length; r++) {
            console.log(rows.length);
            const itemNumber = rows[r].cells[0].innerHTML;
            const itemQty = parseInt(rows[r].cells[1].innerHTML);
            removeItemMap.set(itemNumber, itemQty);
            removeArr.push(itemNumber);
        };
        if (removeArr.includes(removedValue)) {
            const index = removeArr.indexOf(removedValue) + 1;
            const masterQty =  document.getElementById(`qty_${removedValue}_${localStorage.getItem('selectedBox')}`)
            if (removeItemMap.get(removedValue) > 1 && masterQty) {
                rows[index].cells[1].innerHTML = removeItemMap.get(removedValue) - 1;
                masterQty.innerHTML = parseInt(masterQty.innerHTML) + 1;
                skuQtyMap.set(removedValue, skuQtyMap.get(removedValue) - 1)
            } else if (removeItemMap.get(removedValue) == 1 && masterQty) {
               masterQty.innerHTML = parseInt(masterQty.innerHTML) + 1;
               tdSkuArr = tdSkuArr.filter(i => i != removedValue);
               console.log(tdSkuArr);
               skuQtyMap.delete(removedValue);
               rows[index].remove();
            };
            const iid = item_numberMap.get(`${removedValue}-${localStorage.getItem('selectedBox')}`);
            if(masterQty.parentElement.getAttribute('class') == 'bg-info') {
                masterQty.parentElement.setAttribute('class', '');
                if (!iidArr.includes(iid)) {
                    iidArr.push(iid); // arr to store updated info for master boxes
                };
                id_qtyMap.set(iid,1);
                selectedSkuArr = selectedSkuArr.filter( i => i != `${document.getElementById(`${removedValue}_${localStorage.getItem('selectedBox')}`).innerHTML}-${localStorage.getItem('selectedBox')}`);
            } else {
                id_qtyMap.set(iid,id_qtyMap.get(iid) + 1);
            }
            input.value = null;
        } else if (value[0] == '-' && value.length > 9 && !removeArr.includes(removedValue)){
            input.value = null;
            error();
        }
    } else {
        error();
        document.getElementById('alert').innerHTML = 'incorrect input';
        input.value = null;
    }
};

var timer = null;
function delay(fn){
    clearTimeout(timer);
    timer = setTimeout(fn, 50)
};
async function updateReqContainer(container_id) {
    localStorage.removeItem('sp_number');
    const id = container_id;
    const response = await fetch(`/api/container/destroyBulk`, {
        method: 'DELETE',
        body: JSON.stringify({
            id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        alert('this requested container has been confirmed for shipping!');
        window.location.replace('/admin_move_main_amazon');
    }

};

var amazon_box = new Object();
function shippmentCreate() {
    amazon_box.length = length.value.trim()*2.54;
    amazon_box.width = width.value.trim()*2.54;
    amazon_box.height = height.value.trim()*2.54;
    amazon_box.weight = weight.value.trim()*0.45;
    amazon_box.volume = amazon_box.width*amazon_box.height*amazon_box.length;
    amazon_box.container_number = pre_shipN.innerHTML;
    if (amazon_box.container_number.substring(0,4) == 'TEMP') {
        amazon_box.type = 0;
        amazon_box.description = `${amazon_box.container_number}:N/A`
    } else {
        amazon_box.type = 3;
    }
    amazon_box.user_id = user_id;
    amazon_box.account_id = account_id;
    amazon_box.tracking = container_id;
    boxCreate(amazon_box)
};
async function boxCreate(data) {
    console.log('boxCreate');
    const response = await fetch('/api/container/amazon_box', {
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
        // var instance = new Date().valueOf().toString().substring(5,13)+container_id;
        // pre_shipN.innerHTML = `SP${instance}`
        amazon_box.id = data.id
        console.log(data.id);
        itemCreate()
    })
};
function itemCreate() {
    console.log('itemCreate');
    var rows = newContainerTable.rows;
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
    removeItem();
    console.log('done');
    alert(`1 container(#${amazon_box.container_number}) with ${rows.length-1} items is inserted to client_id: ${amazon_box.user_id}!`)
    if (amazon_box.container_number.substring(0,4) == 'TEMP') {
        location.href = `/admin_pre_ship_amazon/${amazon_box.id}`
    } else {
        location.reload()
    }
};
function loadingItems(data) {
    fetch('/api/item/new', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });
};

//helper functions
// function idChanger(sku) {
//     const input = document.getElementById(sku).innerHTML;
//     skuQtyMap.set(input, skuQtyMap.get(sku));
//     skuQtyMap.delete(sku);
//     tdSkuArr.filter(i => i != sku);
//     tdSkuArr.push(input);
//     document.getElementById(sku).setAttribute('onkeyup', `idChanger(${input})`);
//     document.getElementById(sku).setAttribute('id', input);
// }


// function printable() {
//     const displayElement = document.getElementById('assignFunction');
//     const notesElement = document.getElementById('notesFunction');
//     printCheck = true;
//     if (displayElement.style.display == 'none') {
//         notesElement.style.display = '';
//         displayElement.style.display = ''
//     } else {
//         displayElement.style.display = 'none';
//         notesElement.style.display = 'none';
//         window.print();
//         notesElement.style.display = '';
//         displayElement.style.display = ''
//     }

// }
function error() {
    var audio = new Audio('../media/wrong.mp3');
    audio.play();
};
function masterCheck () {
    if (length.value && height.value && weight.value && width.value) {
        document.getElementById('order_pre-check').style.display = '';
        document.getElementById('fake').style.display = 'none';
        printCheck = false;
    } else {
        document.getElementById('order_pre-check').style.display = 'none'
        document.getElementById('fake').style.display = '';
    }
};
var skuQtyMap = new Map();
var tdSkuArr = [];
function eachBoxContent (arr, input) {
    if (arr) {
        const tdPerRow = arr.querySelectorAll('td');
        const boxSku = tdPerRow[0].innerText;
        const boxQty = tdPerRow[1].innerText;
        // newBoxSku.setAttribute('onkeyup', `idChanger(${tdPerRow[0].innerText})`);
        if (boxQty != "0") {
            tdPerRow[1].innerHTML = 0;
            if(!tdSkuArr.includes(boxSku)) {
                const newTr = document.createElement('tr');
                if(sku_list) {
                    sku_list.appendChild(newTr);
                } else {
                    sku_list_am.appendChild(newTr);
                };
                const newBoxSku = document.createElement('td');
                newBoxSku.setAttribute('contenteditable', true);
                const newBoxQty = document.createElement('td');
                newBoxSku.setAttribute('id', boxSku);
                newBoxQty.setAttribute('id', `${boxSku}q`);
                newTr.appendChild(newBoxSku);
                newTr.appendChild(newBoxQty);
                tdSkuArr.push(boxSku);
                skuQtyMap.set(boxSku, parseInt(boxQty));
                newBoxSku.innerHTML = boxSku;
                newBoxQty.innerHTML = boxQty;

            } else {
                skuQtyMap.set(boxSku, skuQtyMap.get(boxSku)+ parseInt(boxQty))
                document.getElementById(`${boxSku}q`).innerHTML = skuQtyMap.get(boxSku);
            }
        } else {
            error();
        }
    } else {
        if(!tdSkuArr.includes(input)) {
            tdSkuArr.push(input);
            skuQtyMap.set(input, 1);
            const newTr = document.createElement('tr');
            const newBoxSku = document.createElement('td');
            newBoxSku.setAttribute('contenteditable', true);
            newBoxSku.setAttribute('id', input);
            // newBoxSku.setAttribute('onkeyup', `idChanger(${input})`);
            const newBoxQty = document.createElement('td');
            newBoxQty.setAttribute('id', `${input}q`)
            if(sku_list) {
                sku_list.appendChild(newTr);
            } else {
                sku_list_am.appendChild(newTr);
            };
            newTr.appendChild(newBoxSku);
            newTr.appendChild(newBoxQty);
            newBoxSku.innerHTML = input;
            newBoxQty.innerHTML = skuQtyMap.get(input)
        } else {
            skuQtyMap.set(input, skuQtyMap.get(input)+1)
            document.getElementById(`${input}q`).innerHTML = skuQtyMap.get(input);
        }
    }

};

//helper function to make radnom code
// function makeid(length) {
//     var result           = '';
//     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     var charactersLength = characters.length;
//     for ( var i = 0; i < length; i++ ) {
//       result += characters.charAt(Math.floor(Math.random() *
//  charactersLength));
//    }
//    return result;
// };

// function newSP(params) {
//     var pad = "000";
//     var ans = pad.substring(0, pad.length - localStorage.getItem('sp_number').length) + localStorage.getItem('sp_number');
//     // const major_length = container_id.length + ans.length;
//     // var instance = container_id + new Date().valueOf().toString().substring(2 + major_length,13) + ans;
//     var instance = container_id + makeid(3) + ans;
//     pre_shipN.innerHTML = `SP${instance}`;
//     document.getElementById('image').src = `http://bwipjs-api.metafloor.com/?bcid=code128&text=SP${instance}`;

// }
function removeItem() {
    console.log('preparing removal');
    var idarr = [];
    for (let i = 0; i < selectedSkuArr.length; i++) {
        idarr.push(item_numberMap.get(selectedSkuArr[i]))
    };
    removeZeroItem(idarr);
    for (let k = 0; k < iidArr.length; k++) {
        var eachUpdatedItem = new Object();
        eachUpdatedItem.id = iidArr[k];
        eachUpdatedItem.qty_per_sku = id_qtyMap.get(iidArr[k]);
        updateQty(eachUpdatedItem)
    }
};
function removeZeroItem(id) {
    console.log('bulk removal');
    fetch(`/api/item/bulkDestroy/`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: id
        }),
      headers: {'Content-Type': 'application/json'}
    });
};
function updateQty(data) {
    fetch(`/api/item/updateQtyPerItemId/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          qty_per_sku: data.qty_per_sku
          }),
        headers: {'Content-Type': 'application/json'}
    });
};

function pre_create_checker() {
    if (printCheck) {
        shippmentCreate()
    } else {
        printable();
    }
};

// const alt_step = document.getElementById('alt_step')
// function alter() {
//     alt_step.disabled = true;
//     pre_shipN.innerHTML = `TEMP${container_id}`;
//     length.value = 0;
//     height.value = 0;
//     weight.value = 0;
//     width.value = 0;
//     document.getElementById('creator_form').setAttribute('class', 'shadow p-2 py-3 mt-2 rounded border border-danger bg-warning');
//     masterCheck ();
// };

function deleteConfirm() {
    const id = container_id;
    const code =  prompt(`Please enter the passcode to confirm the DELETION of REQ box (id: ${id})`);
    if (code == '0523') {
        if (confirm('Friednly reminder: all items assocaited with this REQ box will be removed!')) {
            updateReqContainer(id);
        }
    } else {
        alert('Incorrect passcode!')
    }
};


const today = new Date().toLocaleDateString("en-US");//****//
const newAccountInput = document.getElementById('newAccountInput');//****//
const accountSelect = document.getElementById('account');//****//
const date = document.getElementById('today');
// const loader = document.getElementById('loader'); // loader
const client_list = document.getElementById("user");//****//
const username = document.getElementById('newUserName');//****//
const password = document.getElementById('newPassword');//****//
const height = document.getElementById('new_hei');//****//
const length = document.getElementById('new_len');//****//
const width = document.getElementById('new_wid');//****//
const description = document.getElementById('new_des');//****//
const container_number = document.getElementById('new_container');//****//
// const sku = document.getElementById('sku');
// const sku_list = document.getElementById('sku_list');
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
    // loader.style.display = '';
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
    // loader.style.display = 'none';
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
// var timer = null;
// function delay(fn){
//     clearTimeout(timer);
//     timer = setTimeout(fn, 100)
// };

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
                    emptyArr.push(container.id)
                }; //cost == 0 means the empty box has been recently billed and ready to get reset

            };
            if (!emptyArr.length) {
                alert('No empty container was found in the database')
            } else {
                removeEmpty(emptyArr);
            }
          })
      });
};
async function removeEmpty(Arr) {
    const response = await fetch(`/api/container/destroyBulk/`, {
        method: 'DELETE',
        body: JSON.stringify({
            id: Arr
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        alert(`Successfully remove ${Arr.length} empty containers! `)
    }
}
