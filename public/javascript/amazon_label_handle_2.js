console.log("type_2");
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
        id_generator(tbody, i, (qty_ans*merging_ratio), skuFilter(item_number), qty_ans, merging_ratio);
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

const skuFilter = (input) => {
    var index;
    oldsku?index=oldsku.indexOf(input):index=-1;
    if (index>-1 && filterAuthFunction() && newsku[index]) {
        return newsku[index]
    } else {
        return input
    }
};
const allowCheckBox = document.getElementById('allowFilter');
const filterAuthFunction = () => {
    if (allowCheckBox.checked) {
        return true
    } else {
        return false
    }
}

filterLoader (10);
