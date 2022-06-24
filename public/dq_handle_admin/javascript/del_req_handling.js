const pageType = location.href.split('/').splice(-1)[0].split('&')[0];
console.log('del_req_handling.js', pageType);
const select = document.querySelector('select');
const table = document.querySelector('table');
const rows = table.rows;
const scan_input = document.getElementById('scanInput');
const checkboxes = table.querySelectorAll('input');
const infoPanel = document.getElementById('info');
const containerIdMap = new Map();
const primaryTargets = [];
const secondaryTargets = [];
/////////////////////////////////////
for (let i = 1; i < rows.length; i++) {
    var primaryItem = rows[i].cells[2].innerText.toUpperCase();
    if (pageType == 'sku') {
        primaryItem = primaryItem.split('-').pop();
    } else if (pageType == 'container') {
        containerIdMap.set(rows[i].cells[2].innerText, rows[i].cells[2].id);
    }
    primaryTargets.push(primaryItem);
};
var timer = null;
function delay(){
    var time = 1200;
    clearTimeout(timer);
    timer = setTimeout(()=>{scan_input.value = null}, time)
};
////////////////////////////////////
const displayInfo = () => {
    const scan_value = scan_input.value.toUpperCase().trim();
    const index = primaryTargets.indexOf(scan_value);
    if (pageType == 'chinabox' && index > -1) {
        checkboxes[index].checked = true;
        scan_input.value = null;
    } else if (pageType == 'container' && index > -1) {
        checkboxes[index].checked = true;
        scan_input.value = null;
    } else if (pageType == 'sku' && index > -1) {
        checkboxes[index].checked = true;
        scan_input.value = null;
    } else {
        delay();
    }
};
/////////////////////////////////////
const proceed = () => {
    const passcode = prompt('Enter passcode to proceed')
    if (passcode != '0523') {
        alert('Incorrect password');
        return
    };
    const promises = [];
    var count = 0;
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            count++;
            const data_number = rows[i+1].cells[2].innerText;
            if (pageType == 'chinabox') {
                if (select.value == 99) {
                    promises.push(boxProcess(data_number))
                } else if (select.value == -1) {
                    promises.push(reverseReq('c',data_number))
                }
            } else if (pageType == 'container') {
                if (select.value == 99) {
                    promises.push(containerProcess(data_number));
                    promises.push(containerProcess_itemRemove(data_number))
                } else if (select.value == -1) {
                    promises.push(reverseReq('a',data_number))
                }
            } else if (pageType == 'sku') {
                if (select.value == 99) {
                    promises.push(skuProcess(data_number))
                } else if (select.value == -1) {
                    const pre_modified = data_number.split('-').pop();
                    promises.push(reverseReq('s',pre_modified))
                }
            };
        };
    };
    if (count > 0) {
        Promise.all(promises).then(() => {
            location.reload();
        }).catch((e) => {console.log(e)})
    } else if (fee) {
        const xc_number = location.href.split('/').splice(-1)[0].split('&')[1];
        const description = document.getElementById('xcNewNotes').value.trim();
        const data = new Object();
        if (qty.value <= 0 || !qty.value) {
            qty.value = 1;
            total.value = qty.value*fee.value
        };
        if (fee.value <= 0 || !fee.value) {
            fee.value = 1;
            total.value = qty.value*fee.value
        };
        if (pageType == 'chinabox') {
            data.order = fee.value;
            data.qty_per_box = qty.value;
            data.cost = total.value;
            data.description = description
            updateCharge_china(data, xc_number)
        } else {
            data.unit_fee = fee.value;
            data.qty_of_fee = qty.value;
            data.cost = total.value;
            data.description = description
            updateCharge_amazon(data, xc_number)
        }
    } else {
        alert('No item was selected')
    }
};



//// all of PUTS & DELETE functions
const skuProcess = async (item_number) => {
    const response = await fetch(`/api/item/dq_confirm/${item_number}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        console.log(`${item_number} has been removed from the database!`)
      } else {
        alert('try again')
    }
};
const containerProcess = async (container_number) => {
    const response = await fetch(`/api/container/dq_confirm/${container_number}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        console.log(`${container_number} has been put into the billing queue for final billing!`)
      } else {
        alert('try again')
    }
};
const containerProcess_itemRemove = async (container_number) => {
    const container_id = containerIdMap.get(container_number);
    const response = await fetch(`/api/item/destroyPerContainer/${container_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        console.log(`${container_id} has been removed from the database!`)
      } else {
        alert('try again')
    }
};
const boxProcess = async (box_number) => {
    const response = await fetch(`/api/box/dq_confirm/${box_number}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        console.log(`${box_number} has been put into the billing queue for final billing!`)
      } else {
        alert('try again')
    }
};
const reverseReq = async (code, eachNumber) => {
    if (code == 'c') {
        const response = await fetch(`/api/box/reversal_archive/${eachNumber}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
          });
          if (response.ok) {
            console.log(`${eachNumber} is reversed back to status 1!`)
          } else {
            alert(`fail to delete ${eachNumber}`)
        }
    } else if (code == 'a') {
        const response = await fetch(`/api/container/reversal_archive/${eachNumber}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
          });
          if (response.ok) {
            console.log(`${eachNumber} is reversed back to status 1!`)
          } else {
            alert(`fail to delete ${eachNumber}`)
        }
    } else if (code == 's') {
        const response = await fetch(`/api/item/reversal_archive/${eachNumber}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
          });
          if (response.ok) {
            console.log(`${eachNumber} is reversed back to status 1!`)
          } else {
            alert(`fail to delete ${eachNumber}`)
        }
    }
};
/////////////////////////////////////
//xc charge//
const fee = document.getElementById('fee_per_unit');
const qty = document.getElementById('unit');
const total = document.getElementById('total');
const calculator = () => {
    total.value = fee.value*qty.value
};
if (fee) {
    document.querySelectorAll('option').forEach(i => i.remove());
    document.querySelectorAll('p').forEach(i => i.remove());
    document.getElementById('scanGroup').remove();
    document.getElementById('info').remove();
    select.innerHTML = `<option value="4" selected disabled>Add Charge<option> `
    document.querySelector('thead').remove();
};
const updateCharge_china = async (data, box_number) => {
    const response = await fetch(`/api/box/xc_addCharge/${box_number}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        console.log(`${box_number} has been put into the billing queue for xc billing!`);
        location.replace('/delete_queue_admin')
      } else {
        alert('try again')
    }
};
const updateCharge_amazon = async (data, container_number) => {
    const response = await fetch(`/api/container/xc_addCharge/${container_number}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        console.log(`${container_number} has been put into the billing queue for xc billing!`);
        location.replace('/delete_queue_admin')
      } else {
        alert('try again')
    }
};
