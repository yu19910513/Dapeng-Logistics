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
