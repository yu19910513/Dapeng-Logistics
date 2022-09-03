const today = new Date().toLocaleDateString("en-US");
function skuseeker(id, number) {
 unattach(number);
 fetch(`/api/item/findAllPerContainer/${id}`, {
     method: 'GET'
 }).then(function (response) {
     return response.json();
 }).then(function (data) {
     data.forEach(element => {
        const childElement = document.createElement('li');
        childElement.setAttribute('class','shadow-sm bg-light mb-1 container')
        number.appendChild(childElement);
        childElement.innerHTML = `<div class='row justify-content-around'><div class='col-4'>${element.item_number}</div><div class='col-4'><b>${element.qty_per_sku}</b></div>`
     });
 })
};

async function statusChange(tracking) {
    var description;
    const input = document.getElementById(`input${tracking}`).value;
    if (!input) {
        description = `All tasks completed; shipped.`
    } else {
        description = input;
    };
    if(confirm(`Ready to confirm shipping? Ending Date for billing will be set as ${today}. Admin Notes: ${description}`)){
        const response = await fetch(`/api/container/post-label`, {
            method: 'PUT',
            body: JSON.stringify({
                shipped_date: today,
                tracking: tracking,
                status: 3,
                type: 3,
                description: description
              }),
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {
            alert('Success!')
            location.reload()
        }
    }
};

//helper function
function unattach(number) {
    number.querySelectorAll('li').forEach(i => i.remove())
};

const pallet_info_revise = () => {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const row = table.rows;
        for (let i = 1; i < row.length; i++) {
            if (row[i].cells[0].querySelector('small')) {
            const element = row[i].cells[0].querySelector('small').innerText;
            const elementArr = element.split('*');
            const index = elementArr[0];
            const pId = elementArr[5];
            row[i].cells[0].querySelector('small').innerHTML = `P${index}-${pId}`
            }
        }
    })
};

pallet_info_revise();
