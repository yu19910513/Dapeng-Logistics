const inventory_count = document.getElementById('inventory_c');
const pending_count = document.getElementById('pending_c');
var receivedCount = 0;
var requestedCount = 0;
var pendingCount = 0;
var objectMap = new Map();
var boxNumberArr = [];

function allBox() {
    fetch(`/api/user/allBox`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        for (let i = 0; i < data.length; i++) {
          const status = data[i].status;
          const box_number = data[i].box_number;
          objectMap.set(box_number, data[i]);
          boxNumberArr.push(box_number);
            if (status == 0 ) {
              pendingCount++
            } else if (status == 1) {
              receivedCount++
            } else if (status == 2) {
              requestedCount++
            } else if (status == 3){
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

function box_searchBtn(b) {
    for (i = 0; i < boxNumberArr.length; i++) {
    if (b.length >= 3) {
      txtValue = boxNumberArr[i];
      if (txtValue.toUpperCase().indexOf(b.toUpperCase()) > -1) {
        filterFunction_box(boxNumberArr[i]);
        document.getElementById('searchNote').innerHTML = null;
      }
    }
  };
};

function box_searching() {
unattach();
 var box_input = document.getElementById('myBoxInput').value.trim();
 if (box_input[0] == '/') {
  document.getElementById('searchNote').innerHTML = "The partial function is initiated, please input at least 3 key characters associated with box number <br>快捷功能活化，请用三位以上关键字母数字查找(箱码)"
  box_input = box_input.substring(1,box_input.length)
  box_searchBtn(box_input)
 } else {
  document.getElementById('searchNote').innerHTML = null;
  if (boxNumberArr.includes(box_input.toUpperCase())) {
    filterFunction_box(box_input.toUpperCase());
    document.getElementById('myBoxInput').value = null;
  }
 }
};

function unattach() {
const tBody = document.getElementById('boxBody');
const old_search = tBody.querySelectorAll('tr');
old_search.forEach(i => i.remove())
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
    account.innerHTML = `<a href="/account/${objectMap.get(b).account_id}" >${objectMap.get(b).account.name}</a>`;
    box_number.innerHTML = b;
    description.innerHTML = objectMap.get(b).description;
    order.innerHTML = objectMap.get(b).order;
    total_box.innerHTML = objectMap.get(b).batch.total_box;
    qty_per_box.innerHTML = objectMap.get(b).qty_per_box;
    sku.innerHTML = objectMap.get(b).sku;
    date.innerHTML = convertor(objectMap.get(b));
    status.innerHTML = convertor_status(objectMap.get(b).status);
    boxBody.appendChild(container);
};


function convertor(object) {
  const received_date = object.received_date;
  const shipped_date = object.shipped_date;
  const pending_date = object.batch.pending_date;
  const requested_date =object.requested_date;
  if (shipped_date) {
    return shipped_date
  } else if (requested_date) {
    return requested_date
  } else if (received_date) {
    return received_date
  } else {
    return pending_date
  }
};

function convertor_status(s) {
  if (s == 0) {
    return 'pending'
  } else if ( s == 1) {
    return 'received'
  } else if (s == 2) {
    return 'requested'
  } else if (s ==3) {
    return 'shipped'
  }
}

// console.log(window.location.href);
