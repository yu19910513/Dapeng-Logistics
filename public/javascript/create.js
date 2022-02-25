//need to use fetch get to get account
// then use local storage
//use for loop to generate amount of table for amount of boxes
// generate asn and box number front end
// local storeage till confirm then post to server

var asn = "ASN"+String(new Date().valueOf()).substring(3, 13);
document.querySelector('#new_asn').setAttribute("value", asn);
localStorage.setItem('asn',asn);

const account = document.querySelector('#new_account');
const prefix = document.querySelector('#new_prefix');
const savedAccount = localStorage.getItem('account');
const savedPrefix = localStorage.getItem('prefix');
if (savedAccount != "Create New Account") {
    account.setAttribute('value', savedAccount);
    prefix.setAttribute('value', savedPrefix);
} else {
    account.disabled = false;
    prefix.disabled = false;
}



class Box{
    constructor(account, prefix, batch, desscription, length, weight, height, width, total_box, order, qty_per_box, sku){
        this.account = account;
        this.prefix = prefix;
        this.batch = batch;
        this.desscription = desscription;
        this.length = length;
        this.weight = weight;
        this.height = height;
        this.width = width;
        this.total_box = total_box;
        this.order = order;
        this.qty_per_box = qty_per_box;
        this.sku = sku;
    }
}


const fixedInfo = document.getElementById('fixedInfo');
fixedInfo.innerHTML = 'Account:' + savedAccount + "</br>" + 'ASN:' + asn + "</br>" + 'Pending Date: ' + new Date();


function precheck() {
    const desscription = document.querySelector('#new_des').value;
    const length = document.querySelector('#new_len').value;
    const width = document.querySelector('#new_wid').value;
    const height = document.querySelector('#new_hei').value;
    const weight = document.querySelector('#new_wei').value;
    const qty_per_box = document.querySelector('#new_qty').value;
    const sku = document.querySelector('#new_sku').value;
    const total_box = document.querySelector('#new_tot').value.trim();
    for (let i = 1; i <= total_box; i++) {
        const digcode = parseInt(String(new Date().valueOf()).substring(6, 13)) + i;
        const pre_number = 'SW' + savedPrefix + digcode
        const box_number = pre_number.replace(/\s/g, '');
        const box = new Box(savedAccount, savedPrefix, asn, desscription, length, weight, height, width, total_box, i, qty_per_box, sku)
        console.log(box);
        var table = document.querySelector('#ordertable');
        var tag = document.createElement('tr');
        tag.setAttribute('id',`order#${i}`);
        var cell_box_number = document.createElement('td');
        var cell_description = document.createElement('td');
        var cell_SKU = document.createElement('td');
        var cell_qty_per_box = document.createElement('td');
        var cell_box = document.createElement('td');
        var cell_of_box = document.createElement('td');
        var cell_weight = document.createElement('td');
        var cell_length = document.createElement('td');
        var cell_width = document.createElement('td');
        var cell_height = document.createElement('td');

        cell_box_number.setAttribute('id', `box_number${i}`);
        cell_description.setAttribute('id', `description${i}`);
        cell_description.setAttribute('contenteditable', `true` );
        cell_SKU.setAttribute('id', `SKU${i}`);
        cell_SKU.setAttribute('contenteditable', `true` );
        cell_qty_per_box.setAttribute('id', `qty_per_box${i}`);
        cell_qty_per_box.setAttribute('contenteditable', `true` );
        cell_box.setAttribute('id', `box${i}`);
        cell_of_box.setAttribute('id', `of_box${i}`);
        cell_weight.setAttribute('id', `weight${i}`);
        cell_weight.setAttribute('contenteditable', `true`);
        cell_length.setAttribute('id', `lengcell_length${i}`);
        cell_length.setAttribute('contenteditable', `true`);
        cell_width.setAttribute('id', `width${i}`);
        cell_width.setAttribute('contenteditable', `true`);
        cell_height.setAttribute('id', `height${i}`);
        cell_height.setAttribute('contenteditable', `true`);

        cell_box_number.innerHTML = box_number;
        cell_description.innerHTML = box.desscription;
        cell_SKU.innerHTML = box.sku;
        cell_qty_per_box.innerHTML = box.qty_per_box;
        cell_box.innerHTML = box.order;
        cell_of_box.innerHTML = box.total_box;
        cell_weight.innerHTML = box.weight;
        cell_length.innerHTML = box.length;
        cell_width.innerHTML = box.width;
        cell_height.innerHTML = box.height;

        tag.appendChild(cell_box_number);
        tag.appendChild(cell_description);
        tag.appendChild(cell_SKU);
        tag.appendChild(cell_qty_per_box);
        tag.appendChild(cell_box);
        tag.appendChild(cell_of_box);
        tag.appendChild(cell_weight);
        tag.appendChild(cell_length);
        tag.appendChild(cell_width);
        tag.appendChild(cell_height);

        table.appendChild(tag);
    };
}

document.getElementById('order_pre-check').addEventListener('click', precheck);

function reset() {
    location.reload();
}
// var user = JSON.parse(localStorage.getItem('user'));

// If we need to delete all entries of the store we can simply do:

// localStorage.clear();

// $BTN.click(function () {
//     var $rows = $TABLE.find("tr:not(:hidden)");
//     var headers = [];
//     var data = [];

//     // Get the headers (add special header logic here)
//     $($rows.shift())
//       .find("th:not(:empty)")
//       .each(function () {
//         headers.push($(this).text().toLowerCase());
//       });

//     // Turn all existing rows into a loopable array
//     $rows.each(function () {
//       var $td = $(this).find("td");
//       var h = {};

//       // Use the headers from earlier to name our hash keys
//       headers.forEach(function (header, i) {
//         h[header] = $td.eq(i).text();
//       });

//       data.push(h);
//     });

//     // Output the result
//     $EXPORT.text(JSON.stringify(data));
//   });
