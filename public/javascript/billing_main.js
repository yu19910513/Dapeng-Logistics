const client_list = document.getElementById('client_list');
const today = new Date().toLocaleDateString("en-US");
const shipping_cost = document.getElementById('shipping_cost');
const receiving_cost = document.getElementById('receiving_cost');
const storage_cost = document.getElementById('storage_cost');

document.getElementById('today').innerHTML = today;
function client_data() {
    fetch(`/api/user/`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
        const user = document.createElement('option');
        user.innerHTML = data[i].name;
        user.setAttribute('value', data[i].id);
        client_list.appendChild(user)
        };
    });
};
client_data();

//when specific user is selected
function client() {
 if (client_list.value != 0) {
    document.getElementById('client_list').disabled = true;
    next();
 }
};

var cell_table = document.getElementById('cell_table');
function next() {
    document.getElementById('myTable').style.display = '';
    const user_id = document.getElementById('client_list').value;
    fetch('/api/user/billing_per_account', {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        const pageData = data[user_id];
        for (let i = 0; i < pageData.length; i++) {
            if (!pageData[i].shipped_date || monthValidate(pageData[i].shipped_date)) {
                building(pageData, i)
            }
        }

    });
};

//function to build the table if pass validation
function building(pageData, i) {
    const container = document.createElement('tr');
    cell_table.appendChild(container);
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
    received_date.innerHTML = pageData[i].received_date;
    billable.innerHTML = dayCalculator(pageData[i].received_date, pageData[i].shipped_date);
    if (pageData[i].shipped_date) {
        ending_date.innerHTML = pageData[i].shipped_date;
    } else {ending_date.innerHTML = new Date().toLocaleDateString("en-US");};
    const volumeNew = pageData[i].volume/764555
    volume.innerHTML = Math.round(volumeNew);
    cost.innerHTML = storage_cost.value

}

//month validation: only bill the box not shipped or shipped this month
function monthValidate(s) {
    var ending_month= new Date(s).getMonth();
    var thisMonth = new Date(today).getMonth();
    if (ending_month == thisMonth) {
        return true
    } return false
}

//billable day function: r = received_date; s = shipped_date if any
function dayCalculator(r,s) {
var received_date = new Date(r);
if (s) {
    var ending_date = new Date(s);
} else {
    var ending_date = new Date(today);
};
var Difference_In_Time = ending_date.getTime() - received_date.getTime();
var diff = Math.ceil(Difference_In_Time / (1000 * 3600 * 24) + 1);
if (diff > 30) {
    return diff-30
} else {
    return 0
}
};
