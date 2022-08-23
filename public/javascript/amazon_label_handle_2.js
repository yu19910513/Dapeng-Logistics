console.log("type_2");
const promises = [];
function deleteConfirm(id) {
    const code =  prompt(`Please enter the passcode to confirm the deletion of REQ box (id: ${id})`);
    if (code == '0523') {
        if (confirm('Friednly reminder: all items assocaited with this REQ box will be removed!')) {
            updateReqContainer(id);
        }
    } else {
        alert('Incorrect passcode!')
    }
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
        alert('this requested container has been confirmed for deletion!');
        location.reload();
    }

};
//////////////////////////
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *charactersLength));
    }
   return result;
};
const id_generator = (parent, num, qty_per_box, item_number, qpb, qpu) => {
    var pad = "000";
    var ans = pad.substring(0, pad.length - num.toString().length) + num.toString();
    var instance = parseInt(parent.id) + makeid(3) + ans;
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    const td_1 = document.createElement('td');
    const td_2 = document.createElement('td');
    parent.appendChild(tr);
    tr.appendChild(td);
    tr.appendChild(td_1);
    tr.appendChild(td_2);
    td.innerHTML = `SP${instance}`;
    td_1.innerHTML = item_number;
    td_2.innerHTML = `<b>${qty_per_box}</b> (${qpu} x ${qpb})`;
    spMap.set(`SP${instance}`, item_number);
    skuNewMap.set(item_number, qty_per_box);
    spArr.push(`SP${instance}`);
}
const skuArr = [];//check old items
const spArr = [];//create a series of new SP box
const skuOldMap = new Map();//update old inventory
const skuNewMap = new Map();//create new item
const spMap = new Map();//create new relation with item
const evt_trigger = (item_number, int, container_id, item_id) => {
    console.log(item_number, int);
    getXC(container_id)
    var merging_ratio = prompt(`Total Quantity: ${int} items of ${item_number}. How many item will be merged into EACH UNIT (choose a whole number between 1 to ${int}; default: 1 item = 1 unit)?`).trim();//important question
    if (parseInt(merging_ratio)>0 && parseInt(merging_ratio)<=int) {
        merging_ratio=parseInt(merging_ratio)
    } else {
        merging_ratio=1
    }
    var qty_ans = prompt(`Total Units: ${parseInt(int/merging_ratio)} units of packed (${merging_ratio}) ${item_number}. How many units will be placed into EACH SP BOX  (choose a whole number between 1 to ${parseInt(int/merging_ratio)}; default: 1 box)?`).trim();//important question
    if (parseInt(qty_ans)>0 && parseInt(qty_ans)*merging_ratio <= int) {
        qty_ans=parseInt(qty_ans)
    } else {
        qty_ans=1
    }
    const thisCard = document.getElementById(`radio_${item_id}_${container_id}`).parentElement.parentElement.parentElement.parentElement.parentElement;
    const create_form = thisCard.querySelector('form');
    const tbody = create_form.querySelector('tbody');
    skuArr.push(item_id);
    const cardCollection = document.querySelectorAll('.card_collection');
    cardCollection.forEach(i => {i.id==`thisCard_${container_id}`?console.log('keep'):i.remove();});
    const number_of_box =  Math.floor(int/(qty_ans*merging_ratio));
    const remainder = int % (qty_ans*merging_ratio);
    skuOldMap.set(item_id, remainder);
    for (let i = 0; i < number_of_box; i++) {
        id_generator(tbody, i, (qty_ans*merging_ratio), skuFilter(item_number, qty_ans*merging_ratio), qty_ans, merging_ratio);
    };
    remainder>0?alert(`${remainder} items are insufficient for another SP box or unit`):null;
    document.getElementById(`qty_${item_id}`).innerHTML = remainder;
    create_form.style.display = '';
    console.log(`The end of the calculation for ${item_number}`);
    document.getElementById(`radio_${item_id}_${container_id}`).onclick = null;
}
///////////
var oldsku,newsku
const filterLoader = async (n) => {
    await fetch(`/api/record/skufilter/${n}`, {
        method: 'GET'
    }).then(function (response) {
        if (response.status != 200){
            return null
        } else {
            return response.json();
        }
    }).then(function (data) {
        if (data.length) {
            loadingFilterOp(data);
        }
    })
};
const mapinngOptions = document.getElementById('mapping options')
const loadingFilterOp = (dataArr) => {
    for (let i = 0; i < dataArr.length; i++) {
        const tr = document.createElement('tr');
        const td_1 = document.createElement('td');
        const td_2 = document.createElement('td');
        const item = dataArr[i];
        const input = document.createElement('input');
        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.innerHTML =item.action_notes;
        input.className = 'form-check-input';
        input.type = 'radio';
        input.name = 'mappingOptions';
        input.value = item.action_notes;
        input.setAttribute('onclick',`initskuchange(${item.action_notes}, ${item.id})`);
        tr.appendChild(td_1);
        tr.appendChild(td_2);
        td_1.appendChild(input);
        td_2.appendChild(label);
        mapinngOptions.appendChild(tr);
        if (i == 0 && !localStorage.getItem('filter_history')) {
            localStorage.setItem('filter_history', item.id)
            input.checked = true//default checked filter is the most recent linkage
            initskuchange(JSON.parse(item.action_notes), item.id)
        } else {
            if (item.id == localStorage.getItem('filter_history')) {
                input.checked = true;
                initskuchange(JSON.parse(item.action_notes), item.id)
            }
        }
    }
}
const initskuchange = (str, id) => {
    console.log(`swtich to ${str}`);
    localStorage.setItem('filter_history', id)
    var arr = str.split('=>');
    oldsku = arr[0].split(',');
    newsku = arr[1].split(',');
}

///main sku replacement occurs here
const skuFilter = (input, n) => {
    var index;
    oldsku?index=oldsku.indexOf(input):index=-1;
    if (index>-1 && filterAuthFunction() && newsku[index]) {
        xcQtyCount = xcQtyCount + n;
        return newsku[index]
    } else {
        return input
    }
};

///filter yes or no
const allowCheckBox = document.getElementById('allowFilter');
const filterAuthFunction = () => {
    if (allowCheckBox.checked) {
        return true
    } else {
        return false
    }
};


////master check function//////
let length, height, weight, width;
function masterCheck () {
    length = document.getElementById('new_len');
    height = document.getElementById('new_hei');
    weight = document.getElementById('new_wei');
    width = document.getElementById('new_wid');
    if (length.value && height.value && weight.value && width.value) {
        document.getElementById('order_pre-check').style.display = '';
        document.getElementById('fake').style.display = 'none';
        printCheck = false;
    } else {
        document.getElementById('order_pre-check').style.display = 'none'
        document.getElementById('fake').style.display = '';
    }
};

//////get additional charge
var xcQtyCount = 0;
var xcExist = false;
const getXC = async (container_id) => {
    await fetch(`/api/container/fba/LR${container_id}`, {
        method: 'GET'
    }).then(function (response) {
        if (response.status != 200) {
            return null
        } else {
            return response.json();
        };
    }).then(function (data) {
        if (data) {
            xcExist = true;
            xcQtyCount = parseInt(data.qty_of_fee);
            console.log(xcQtyCount);
        };
        console.log('no xc yet');
    })
};
filterLoader (10);

const shipment_init = (container_id, user_id, account_id) => {
    const foregin_key = new Object();
    foregin_key.container_id = container_id;
    foregin_key.user_id = user_id;
    foregin_key.account_id = account_id;
    for (let i = 0; i < spArr.length; i++) {
       shippmentCreate(spArr[i], foregin_key)
    };
    update_init();
    xcQtyCount>0?promises.push(xcGenerator(foregin_key)):console.log('no label change');
    Promise.all(promises).then(() => {
        console.log('done');
    }).catch((e) => {console.log(e)})

};

function shippmentCreate(sp_number, foregin_key) {
    const sp_box = new Object();
    sp_box.length = length.value.trim()*2.54;
    sp_box.width = width.value.trim()*2.54;
    sp_box.height = height.value.trim()*2.54;
    sp_box.weight = weight.value.trim()*0.45;
    sp_box.volume = sp_box.width*sp_box.height*sp_box.length;
    sp_box.container_number = sp_number;
    sp_box.type = 3;
    sp_box.user_id = foregin_key.user_id;
    sp_box.account_id = foregin_key.account_id;
    sp_box.tracking = foregin_key.container_id;
    promises.push(boxCreate(sp_box))
};
async function boxCreate(data) {
    console.log('boxCreate');
    boxCreateIndex++;
    const response = await fetch('/api/container/amazon_box', {
        method: 'post',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
       console.log("amazon box inserted");
       findContainerId(data);
      } else {
        alert('try again')
   }
};
const xcGenerator = async (data) => {
    if (xcExist) {
        const newfba = `LR${data.container_id}`
        const response = await fetch('/api/container/xc_LabelChangeUpdate', {
            method: 'PUT',
            body: JSON.stringify({
                fba:newfba,
                qty_of_fee: xcQtyCount,
                description: `AM Relabel Services - ${xcQtyCount} Items: ${JSON.stringify(spArr)}`,////could be more deatil
                notes: `Label Change (Qty: ${xcQtyCount}); Batch# ${data.container_id}`,

            }),
            headers: { 'Content-Type': 'application/json' }
        });
        response.ok?console.log('xc_charge updated sucessfully'):console.log('fail to update the xc_chagre');
    } else {
        const ref_code = "AC" + parseInt(String(new Date().valueOf() + Math.floor(1000000000 + Math.random() * 9000000000)).substring(4, 11));
        const response = await fetch('/api/container/xc_LabelChange', {
            method: 'post',
            body: JSON.stringify({
                user_id: data.user_id,
                account_id: data.account_id,
                container_number: ref_code,
                qty_of_fee: xcQtyCount,
                description: `AM Relabel Services - ${xcQtyCount} Items`,
                notes: `Label Change (Qty: ${xcQtyCount}); Batch# ${data.container_id}`,
                fba: 'LR' + data.container_id,
            }),
            headers: { 'Content-Type': 'application/json' }
          });
          if (response.ok) {
           console.log("new xc_charge is inserted");
          } else {
            alert('try again')
       }
    }
};
function findContainerId(sp_object) {
    console.log('getting container_id');
    fetch(`/api/container/amazon_container/${sp_object.container_number}`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log('container_id fetched');
        sp_object.id = data.id
        console.log(data.id);
        itemCreate(sp_object)
    })
};
function itemCreate(sp) {
    console.log('itemCreate');
    const item = new Object()
    item.item_number = spMap.get(sp.container_number);
    item.qty_per_sku = parseInt(skuNewMap.get(item.item_number));
    item.user_id = sp.user_id;
    item.account_id = sp.account_id;
    item.container_id = sp.id;
    item.description = sp.description;
    promises.push(loadingItems(item))
};
async function loadingItems(data) {
    finishlineIndex++;
    const response = await fetch('/api/item/new', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });
    if (response.ok) {
        console.log('finished new item insert');
        beforeRefresh();
    }
};

const update_init = () => {
    console.log('update qty/remove 0-qty item init!');
    for (let j = 0; j < skuArr.length; j++) {
        const item_id = skuArr[j];
        if (skuOldMap.get(item_id) == 0) {
           promises.push(deleteItem(item_id))
        } else {
           promises.push(updateItem(item_id))
        }
    }
};
const deleteItem = async (item_id) => {
    console.log('bulk removal');
    const response = await fetch(`/api/item/bulkDestroy/`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: item_id
        }),
      headers: {'Content-Type': 'application/json'}
    });
    response.ok?console.log("item with id: " + item_id + " removed"):console.log('failed to remove 0-qty item');
};
const updateItem = async (item_id) => {
    const response = await fetch(`/api/item/updateQtyPerItemId/${item_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          qty_per_sku: skuOldMap.get(item_id)
          }),
        headers: {'Content-Type': 'application/json'}
    });
    response.ok?console.log(`item qty with id ${item_id} has been updated to ${skuOldMap.get(item_id)}`):console.log("failed to update qty");
}

var boxCreateIndex = 0;
var finishlineIndex = 0;
const beforeRefresh = () => {
 if (boxCreateIndex == finishlineIndex) {
    location.reload();
 }
}

async function self_destroy(container_id) {
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