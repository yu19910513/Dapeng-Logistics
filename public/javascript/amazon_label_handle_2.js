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
const id_generator = (parent, num, qty_per_box, item_number) => {
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
    td_2.innerHTML = qty_per_box;
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
    const qty_ans = prompt(`Total Qty: ${int} of ${item_number}. How many per SP box?`);
    const thisCard = document.getElementById(`radio_${item_id}_${container_id}`).parentElement.parentElement.parentElement.parentElement.parentElement;
    const create_form = thisCard.querySelector('form');
    const tbody = create_form.querySelector('tbody');
    if (parseInt(qty_ans)>0 && parseInt(qty_ans)<= int) {
        skuArr.push(item_id);
        const cardCollection = document.querySelectorAll('.card_collection');
        cardCollection.forEach(i => {i.id==`thisCard_${container_id}`?console.log('keep'):i.remove();});
        const number_of_box =  Math.floor(int/parseInt(qty_ans));
        const remainder = int % parseInt(qty_ans);
        skuOldMap.set(item_id, remainder);
        for (let i = 0; i < number_of_box; i++) {
            id_generator(tbody, i, qty_ans, item_number);
        };
        remainder>0?alert(`${remainder} left outside the box`):null;
        create_form.style.display = '';
        document.getElementById(`radio_${item_id}_${container_id}`).onclick = null;
    } else {
        alert('invalid number!')
    }
}
