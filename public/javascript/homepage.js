const inventory_count = document.getElementById('inventory_c');
const pending_count = document.getElementById('pending_c');
var receivedCount = 0;
var requestedCount = 0;
var pendingCount = 0;
var accountMap = new Map();
var box_numberMap = new Map();
var orderMap = new Map();
var descriptionMap = new Map();
var total_boxMap = new Map();
var qty_per_boxMap = new Map();
var skuMap = new Map();
var dateMap = new Map();
var statusMap = new Map();
function allBox() {
    fetch(`/api/user/allBox`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        for (let i = 0; i < data.length; i++) {
          const status = data[i].status;
          const box_number = data[i].box_number;
            box_numberMap.set(box_number, data[i].id)
            accountMap.set(box_number, data[i].account.name);
            orderMap.set(box_number, data[i].order);
            descriptionMap.set(box_number, data[i].description);
            total_boxMap.set(box_number, data[i].batch.total_box);
            qty_per_boxMap.set(box_number, data[i].qty_per_box);
            skuMap.set(box_number, data[i].sku);
            if (status == 0 ) {
              dateMap.set(box_number, data[i].batch.pending_Map)
              statusMap.set(box_number, 'pending')
              pendingCount++
            } else if (status == 1) {
              dateMap.set(box_number, data[i].received_date);
              statusMap.set(box_number, 'received')
              receivedCount++
            } else if (status == 2) {
              dateMap.set(box_number, data[i].requested_date);
              statusMap.set(box_number, 'requested');
              requestedCount++
            } else if (status == 3){
              dateMap.set(box_number, data[i].shipped_date);
              statusMap.set(box_number, 'shipped')
            }
        };
        var inventoryCount = receivedCount + requestedCount;
        pending_count.innerHTML = pendingCount;
        inventory_count.innerHTML = `${inventoryCount} (${requestedCount} requested)`
    });
};
allBox()

const accounts_content = document.getElementById("myDropdown");
const accountInput = document.getElementById("accountInput");
const boxInput = document.getElementById("boxInput");
const boxTable = document.getElementById("boxTable");
function box_show() {
  accounts_content.style.display = 'none';
  accountInput.style.display = 'none';
  boxTable.style.display = ''
  boxInput.style.display =''
  document.getElementById('account_search').checked = false
}
function account_show() {
  // location.reload()
  accounts_content.style.display = '';
  accountInput.style.display = '';
  boxInput.style.display ='none';
  boxTable.style.display = 'none';
  document.getElementById('box_search').checked = false
}


function filterFunction() {
  var input, filter, div, a, i;
  div = document.getElementById("myDropdown");
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
        a[i].style.display = "none";
    }
  }
}

function box_searching() {
 const box_input = document.getElementById('myBoxInput').value.trim();
  if (box_numberMap.get(box_input.toUpperCase())) {
    filterFunction_box(box_input.toUpperCase());
    document.getElementById('myBoxInput').value = null;
  }
}
function filterFunction_box(b) {
    const boxBody = document.getElementById('boxBody')
    const container = document.createElement('tr');
    const account = document.createElement('td');
    const box_number = document.createElement('td');
    const description = document.createElement('td');
    const order = document.createElement('td');
    const total_box = document.createElement('td');
    const qty_per_box = document.createElement('td');
    const sku = document.createElement('td');
    const date = document.createElement('td');
    const status = document.createElement('td');
    container.appendChild(account);
    container.appendChild(box_number);
    container.appendChild(description);
    container.appendChild(order);
    container.appendChild(total_box);
    container.appendChild(qty_per_box)
    container.appendChild(sku);
    container.appendChild(date);
    container.appendChild(status);
    account.innerHTML = accountMap.get(b);
    box_number.innerHTML = b;
    description.innerHTML = descriptionMap.get(b);
    order.innerHTML = orderMap.get(b);
    total_box.innerHTML = total_boxMap.get(b);
    qty_per_box.innerHTML = qty_per_boxMap.get(b);
    sku.innerHTML = skuMap.get(b);
    date.innerHTML = dateMap.get(b);
    status.innerHTML = statusMap.get(b);
    boxBody.appendChild(container)
};