const client_list = document.getElementById('client_list');
const today = new Date().toLocaleDateString("en-US");
// billing units
const shipping_cost = document.getElementById('shipping_cost');
const receiving_cost = document.getElementById('receiving_cost');
const storage_cost = document.getElementById('storage_cost');
// charge display
const shipping_total = document.getElementById('shipping_total');
const storage_total = document.getElementById('storage_total');
const receiving_total = document.getElementById('receiving_total');
const all_total = document.getElementById('all_total');
const shipping_total_2 = document.getElementById('shipping_total_2');
const storage_total_2 = document.getElementById('storage_total_2');
const receiving_total_2 = document.getElementById('receiving_total_2');

// table
var storage_table = document.getElementById('storage_table');
var received_table = document.getElementById('received_table');
var shipped_table = document.getElementById('shipped_table');


document.getElementById('today').innerHTML = today;
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
};
client_data();

function unlock_select() {
    document.getElementById('client_list').disabled = false;
    document.getElementById('charge_btn').style.display = 'none';
    document.getElementById('reset_btn').style.display = '';
};
//when specific user is selected
function client() {
 if (client_list.value != 0) {
    const user_id = client_list.value
    document.getElementById('client_list').disabled = true;
    localStorage.setItem('user_id', user_id);
    next(user_id);
 }
};

var total_volume = 0;
var total_billable_day = 0;
var receivedCount = 0;
var shippedCount = 0;

/////////////Array to store box_numbers to update their assoicated bill_shipped & bill_received
var shippedBoxArr = [];
var receivedBoxArr = [];
var storageBoxArr = [];

//////////// trigger fetch function to grab data
function next(user_id) {
    document.getElementById('storageTable').style.display = '';
    document.getElementById('receivedTable').style.display = '';
    document.getElementById('shippedTable').style.display = '';
    document.getElementById('r_only').disabled = false;
    document.getElementById('s_only').disabled = false;
    document.getElementById('st_only').disabled = false;
    document.getElementById('all').disabled = false;
    fetch('/api/user/billing_per_user', {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        const pageData = data[user_id];
        localStorage.setItem('user_name', pageData[0].user.name);
        //RECEIVED FOR LOOP
        for (let j = 0; j < pageData.length; j++) {
           if(!pageData[j].bill_received) {
            received_billing(pageData, j);
            receivedCount++;
            receivedBoxArr.push(pageData[j].box_number)
           }
        };
        var received_charge = receivedCount*receiving_cost.value;
        receiving_total.innerHTML = received_charge;
        receiving_total_2.innerHTML = received_charge;

        //STORAGE FOR LOOP
        for (let i = 0; i < pageData.length; i++) {
            if (!pageData[i].shipped_date || monthValidate(pageData[i].shipped_date)) {
                storage_billing_1stStep(pageData, i);
                storageBoxArr.push(pageData[i].box_number);
            };
        };
        var storage_charge = total_billable_day*total_volume*storage_cost.value;
        storage_total.innerHTML = storage_charge.toFixed(5);
        storage_total_2.innerHTML = storage_charge.toFixed(5);

        //SHIPPED FOR LOOP
        for (let k = 0; k < pageData.length; k++) {
            if(!pageData[k].bill_shipped && pageData[k].status == 3) {
                shipped_billing(pageData, k);
                shippedCount++;
                shippedBoxArr.push(pageData[k].box_number)
            }
        };
        var shipped_charge = shippedCount*shipping_cost.value;
        shipping_total.innerHTML = shipped_charge;
        shipping_total_2.innerHTML = shipped_charge;

        //total charge
        var total_charge = shipped_charge + received_charge + storage_charge;
        all_total.innerHTML = total_charge.toFixed(2);
        return shippedBoxArr, receivedBoxArr, storageBoxArr;
    });
};

////////////////////////////// STORAGE FOR LOOP
//function to build the stroage table if pass validation
function storage_billing_1stStep(pageData, i) {
    if (!pageData[i].bill_storage) {
        storage_billing(pageData, i, pageData[i].received_date)
    } else {
        const oldDate = new Date(pageData[i].bill_storage).toLocaleDateString("en-US");
        storage_billing(pageData, i, oldDate);
    }
};
function storage_billing(pageData, i, lastBillDate) {
    const container = document.createElement('tr');
    const user = document.createElement('td');
    const account = document.createElement('td');
    const box_number = document.createElement('td');
    const description = document.createElement('td');
    const received_date = document.createElement('td');
    const ending_date = document.createElement('td');
    const volume = document.createElement('td');
    const billable = document.createElement('td');
    const cost = document.createElement('td');
    container.appendChild(user);
    container.appendChild(account);
    container.appendChild(box_number);
    container.appendChild(description);
    container.appendChild(received_date);
    container.appendChild(ending_date);
    container.appendChild(volume);
    container.appendChild(billable);
    container.appendChild(cost);
    user.innerHTML = pageData[i].user.name;
    account.innerHTML = pageData[i].account.name;
    box_number.innerHTML = pageData[i].box_number;
    description.innerHTML = pageData[i].description;
    if (lastBillDate == pageData[i].received_date) {
        received_date.innerHTML = pageData[i].received_date;
        const dayCalInit = dayCalculatorInit(pageData[i].received_date, pageData[i].shipped_date);
        billable.innerHTML =  dayCalInit
        total_billable_day = total_billable_day +  dayCalInit;
        storage_table.appendChild(container);
    } else {
        received_date.innerHTML = `${pageData[i].received_date} <br> L: <u>${lastBillDate}</u>`;
        const dayCalConti = dayCalculatorConti(pageData[i].received_date, lastBillDate, pageData[i].shipped_date);
        billable.innerHTML = dayCalConti;
        if ( dayCalConti > -1) {
            total_billable_day = total_billable_day + dayCalConti;
            storage_table.appendChild(container);
        }
    };
    if (pageData[i].shipped_date) {
        ending_date.innerHTML = `${pageData[i].shipped_date}**`;
    } else {ending_date.innerHTML = new Date().toLocaleDateString("en-US");};
    const volumeNew = pageData[i].volume/764555;
    volume.innerHTML = volumeNew.toFixed(10);
    total_volume = total_volume + volumeNew;
    cost.innerHTML = `$${storage_cost.value}/ day`
};
//month validation: only bill the box not shipped or shipped this month
function monthValidate(s) {
    var ending_month= new Date(s).getMonth();
    var thisMonth = new Date(today).getMonth();
    if (ending_month == thisMonth) {
        return true
    } return false
};
//billable day function: r = received_date; s = shipped_date if any
function dayCalculatorInit(r,s) {
    var diff = main_calculator(r,s)
    if (diff > 30) {
    return diff-30
    } else {
    return 0
    }
};
function main_calculator(start, end) {
    var start_date = new Date(start);
    if (end) {
        var ending_date = new Date(end);
    } else {
        var ending_date = new Date(today);
    };
    var Difference_In_Time = ending_date.getTime() - start_date.getTime();
    return Math.ceil(Difference_In_Time / (1000 * 3600 * 24)) + 1;
};

//three cases: 1st case: 1st bill client got all 30 days free, so 2nd and later billing bill all days no discount;
//2nd case: 1st bill client got some of 30 day free(partial), and need some day free from 2nd bill;
//3rd case: 2nd case but now it's the 3rd and later billing;

function dayCalculatorConti(r,b,s) {
    var discount;
    if (30 - main_calculator(r,b) < 0) {
        discount = 0;
    } else {
        discount = 30 - main_calculator(r,b);
    };
    return main_calculator(b,s)-1-discount;
};
/////////////////////////////////////////////////

////////////////////////////// RECEIVED FOR LOOP
function received_billing(pageData, i) {
    const container = document.createElement('tr');
    received_table.appendChild(container);
    const user = document.createElement('td');
    const account = document.createElement('td');
    const box_number = document.createElement('td');
    const description = document.createElement('td');
    const received_date = document.createElement('td');
    const cost = document.createElement('td');
    container.appendChild(user);
    container.appendChild(account);
    container.appendChild(box_number);
    container.appendChild(description);
    container.appendChild(received_date);
    container.appendChild(cost);
    user.innerHTML = pageData[i].user.name;
    account.innerHTML = pageData[i].account.name;
    box_number.innerHTML = pageData[i].box_number;
    description.innerHTML = pageData[i].description;
    received_date.innerHTML = pageData[i].received_date;
    cost.innerHTML = `$${receiving_cost.value}`
};

////////////////////////////// SHIPPED FOR LOOP
function shipped_billing(pageData, i) {
    const container = document.createElement('tr');
    shipped_table.appendChild(container);
    const user = document.createElement('td');
    const account = document.createElement('td');
    const box_number = document.createElement('td');
    const fba = document.createElement('td');
    const description = document.createElement('td');
    const shipped_date = document.createElement('td');
    const cost = document.createElement('td');
    container.appendChild(user);
    container.appendChild(account);
    container.appendChild(box_number);
    container.appendChild(fba);
    container.appendChild(description);
    container.appendChild(shipped_date);
    container.appendChild(cost);
    user.innerHTML = pageData[i].user.name;
    account.innerHTML = pageData[i].account.name;
    box_number.innerHTML = pageData[i].box_number;
    fba.innerHTML = pageData[i].fba;
    description.innerHTML = pageData[i].description;
    shipped_date.innerHTML = pageData[i].shipped_date;
    cost.innerHTML = `$${shipping_cost.value}`;
};


//sorting
function sortStTable(n) {
    const table = document.getElementById("stTable");
    sortTable(table, n)
};
function sortRTable(n) {
    const table = document.getElementById("rTable");
    sortTable(table, n)
};
function sortSTable(n) {
    const table = document.getElementById("sTable");
    sortTable(table, n)
};
function sortTable(table,n) {
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc";
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount ++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
};


//display one table only
function show_all() {
    document.getElementById('storageTable').style.display ='';
    document.getElementById('receivedTable').style.display ='';
    document.getElementById('shippedTable').style.display ='';
    document.getElementById('s_onlyConfrim').style.display = 'none';
    document.getElementById('r_onlyConfrim').style.display = 'none';
    document.getElementById('st_onlyConfrim').style.display = 'none';
};
function st_only() {
    document.getElementById('storageTable').style.display = '';
    document.getElementById('st_onlyConfrim').style.display = '';
    document.getElementById('receivedTable').style.display = 'none';
    document.getElementById('shippedTable').style.display = 'none';
};
function r_only() {
    document.getElementById('storageTable').style.display = 'none';
    document.getElementById('receivedTable').style.display = '';
    document.getElementById('shippedTable').style.display = 'none';
    document.getElementById('r_onlyConfrim').style.display = '';
};
function s_only() {
    document.getElementById('storageTable').style.display = 'none';
    document.getElementById('receivedTable').style.display = 'none';
    document.getElementById('shippedTable').style.display = '';
    document.getElementById('s_onlyConfrim').style.display = '';
};

// rest page
function reset() {
    location.reload()
};

// add new ediable row for extra charge
function addRow(t, n) {
    const target_table = document.getElementById(`${t}`);
    const pre_digcode = parseInt(String(new Date().valueOf() + Math.floor(1000000000 + Math.random() * 9000000000)).substring(4, 11));
    const charge_number = "AC" + pre_digcode;
    var row = target_table.insertRow(0);
    row.setAttribute('class','text-danger');
    for (let i = 0; i < n; i++) {
        var cell = row.insertCell(i);
        if (i == 2) {
            cell.innerHTML = charge_number;
        } else if (i == 0) {
            cell.innerHTML = localStorage.getItem('user_name')
        }

        else {
            cell.setAttribute('contenteditable', true)
        }
    };

};

//fetch to put the change: status updated
function bill_confirm(arr, e) {
    const today = new Date().getTime();
    var bill_received, bill_shipped, bill_storage;
    if (e == 's') {
        bill_shipped = today;
        fetch_update(arr, bill_shipped, 'bill_shipped')
    } else if (e == 'r') {
        bill_received = today;
        fetch_update(arr, bill_received, 'bill_received')
    } else {
        bill_storage = today;
        fetch_update(arr, bill_storage, 'bill_storage')
    }
};
async function fetch_update(arr, bill, type) {
    for (let i = 0; i < arr.length; i++) {
        var box_number = arr[i];
        const response = await fetch(`/api/box/${type}_update`, {
            method: 'PUT',
            body: JSON.stringify({
                box_number,
                bill
            }),
            headers: {
                'Content-Type': 'application/json'
            }
          })
          if (response.ok) {
            console.log(bill);
          } else {
            alert('Opps! Errors occured!')
          };

    };
    alert('database updated successfully!');
    show_all()
};



///tool
const test = new Date('2/1/2022').getTime()
console.log(test.toString());
