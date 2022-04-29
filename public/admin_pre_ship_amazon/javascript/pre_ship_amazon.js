const container_id = location.href.split('/').slice(-1)[0];
const pre_shipN = document.getElementById('pre-shipN');
const notes = document.getElementById('notes');
const input = document.getElementById("scanned_item");
const sku_list = document.getElementById('sku_list');
const length = document.getElementById('new_len');
const height = document.getElementById('new_hei');
const weight = document.getElementById('new_wei');
const width = document.getElementById('new_wid');
const newContainerTable = document.getElementById('sku_table');
var item_numberMap = new Map();
var id_qtyMap = new Map();
var iidArr = [];
var user_id, account_id;
var selectedSkuArr = [];
var skuArr = [];

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
            notes.innerHTML = data[0].notes;
            const descriptionArr = document.querySelectorAll('h5');
            const tableArr = document.querySelectorAll('table')
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
                const box_number = description.split(':')[0];
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

function pre_check() {
    document.getElementById('alert').innerHTML = null;
    const value = input.value.trim();
    const all_td = document.querySelectorAll('#pre_confirmTable td');
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
    } else if (skuArr.includes(`${value}-${localStorage.getItem('selectedBox')}`) && !selectedSkuArr.includes(`${value}-${localStorage.getItem('selectedBox')}`) && document.getElementById(localStorage.getItem('selectedBox')).getAttribute('class') == 'lead text-center rounded shadow-sm bg-info') {
        const qtyPerSKu = document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`);
        if (qtyPerSKu) {
            const newQty = parseInt(qtyPerSKu.innerHTML)-1;
            const iid = item_numberMap.get(`${value}-${localStorage.getItem('selectedBox')}`);
            if (newQty > 0) {
                document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`).innerHTML = newQty;
                id_qtyMap.set(iid,newQty);
                iidArr.push(iid);
                eachBoxContent(null, value);
                input.value = null;
            } else if (newQty == 0) {
                eachBoxContent(null, value);
                iidArr.filter(id => id != iid)
                document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`).innerHTML = newQty;
                document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`).parentElement.setAttribute('class','bg-info');
                selectedSkuArr.push(`${document.getElementById(`${value}_${localStorage.getItem('selectedBox')}`).innerHTML}-${localStorage.getItem('selectedBox')}`);
                input.value = null;
            }
        } else {
            error();
            document.getElementById('alert').innerHTML = `${value} is not associated with the box: ${localStorage.getItem('selectedBox')}; please scan the right box first`;
            input.value = null;
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
    amazon_box.volume = length.value*width.value*height.value;
    amazon_box.container_number = pre_shipN.innerHTML;
    amazon_box.type = 3;
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
        var instance = new Date().valueOf().toString().substring(5,13)+container_id;
        pre_shipN.innerHTML = `SP${instance}`
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
    location.reload()
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



function printable() {
    const displayElement = document.getElementById('assignFunction');
    const notesElement = document.getElementById('notesFunction');
    if (displayElement.style.display == 'none') {
        notesElement.style.display = '';
        displayElement.style.display = ''
    } else {
        displayElement.style.display = 'none';
        notesElement.style.display = 'none';
        window.print();
        notesElement.style.display = '';
        displayElement.style.display = ''
    }

}
function error() {
    var audio = new Audio('../media/wrong.mp3');
    audio.play();
};
function masterCheck () {
    if (length.value && height.value && weight.value && width.value) {
        document.getElementById('order_pre-check').style.display = '';
        document.getElementById('fake').style.display = 'none';
    } else {
        document.getElementById('order_pre-check').style.display = 'none'
        document.getElementById('fake').style.display = '';
    }
};
var skuQtyMap = new Map();
var tdSkuArr = [];
function eachBoxContent (arr, input) {
    if (arr) {
        const newTr = document.createElement('tr');
        const newBoxSku = document.createElement('td');
        newBoxSku.setAttribute('contenteditable', true);
        const newBoxQty = document.createElement('td');
        newTr.appendChild(newBoxSku);
        newTr.appendChild(newBoxQty);
        const tdPerRow = arr.querySelectorAll('td');
        newBoxSku.innerHTML = tdPerRow[0].innerText;
        newBoxQty.innerHTML = tdPerRow[1].innerText;
        // newBoxSku.setAttribute('onkeyup', `idChanger(${tdPerRow[0].innerText})`);
        if (tdPerRow[1].innerHTML != "0") {
            sku_list.appendChild(newTr);
            tdPerRow[1].innerHTML = 0;
        } else {
            error()
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
            sku_list.appendChild(newTr);
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
var instance = new Date().valueOf().toString().substring(5,13)+container_id;
pre_shipN.innerHTML = `SP${instance}`;
document.getElementById('image').src = `http://bwipjs-api.metafloor.com/?bcid=code128&text=SP${instance}`;

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
}
