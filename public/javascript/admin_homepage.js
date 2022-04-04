const inventory_count = document.getElementById('inventory_c');
const pending_count = document.getElementById('pending_c');
var receivedCount = 0;
var requestedCount = 0;
var pendingCount = 0;
var shippedCount = 0;
var objectMap = new Map();
var locationMap = new Map()
var boxNumberArr = [];
var locationArr = [];
var preUpdateArr = [];

function allBox() {
    fetch(`/api/user/allBox_admin`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        for (let i = 0; i < data.length; i++) {
          const status = data[i].status;
          const box_number = data[i].box_number;
          const location = data[i].location;
          //set up box_number-object map
          objectMap.set(box_number, data[i]);

          //collect box_number
          boxNumberArr.push(box_number);

            // collect location data
            if (!locationArr.includes(location)) {
                locationArr.push(location)
            };
            ///count function
            if (status == 0 ) {
              pendingCount++
            } else if (status == 1) {
              receivedCount++
            } else if (status == 2) {
              requestedCount++
            } else if (status == 3){
              shippedCount++
            }
        };
        var inventoryCount = receivedCount + requestedCount;
        pending_count.innerHTML = pendingCount;
        inventory_count.innerHTML = `${inventoryCount} (${requestedCount} requested)`;
        // set up location - object map
        const location_data = data.reduce(function (r, a) {
          r[a.location] = r[a.location] || [];
          r[a.location].push(a);
          return r;
        }, Object.create(null));
        for (let j = 0; j < locationArr.length; j++) {
          const element = locationArr[j];
          locationMap.set(element, location_data[element])
        };
    });
};
allBox();


const boxTable = document.getElementById("boxTable");
function box_searchBtn(b) {
    for (i = 0; i < boxNumberArr.length; i++) {
      let txtValue = boxNumberArr[i];
      if (txtValue.toUpperCase().indexOf(b.toUpperCase()) > -1) {
        buildingRow(boxNumberArr[i]);
        document.getElementById('searchNote').innerHTML = null;
      }
  };
};

function location_search(l) {
  for (i = 0; i < locationArr.length; i++) {
    let txtValue = locationArr[i];
    if (txtValue && txtValue.toUpperCase().indexOf(l.toUpperCase()) > -1) {
      locationMap.get(locationArr[i]).forEach((obj)=> {buildingRow(obj.box_number)});
      document.getElementById('searchNote').innerHTML = null;
    }
  }
};

function box_searching() {
unattach();
 var box_input = document.getElementById('myBoxInput').value.trim();
 if (box_input) {
    boxTable.style.display = '';
 };
 if (box_input.length > 2 && !isCharacterASpeical(box_input) && box_input[0] != '/') {
  document.getElementById('searchNote').innerHTML = "No information was found according to your input! Please try again"
  box_searchBtn(box_input)
 } else if (isCharacterALetter(box_input[0]) && !isNaN(box_input[1])) {
  document.getElementById('searchNote').innerHTML = "This location is not associated with any box"
  location_search(box_input)
 }  else if (box_input == '/all') {
  for (let i = 0; i < boxNumberArr.length; i++) {
    const each_of_all = boxNumberArr[i];
    if (each_of_all) {
      buildingRow(each_of_all)
    }
  }
} else {
  if (boxNumberArr.includes(box_input.toUpperCase())) {
    buildingRow(box_input.toUpperCase());
    document.getElementById('myBoxInput').value = null;
  }
 }
};

function unattach() {
  document.getElementById('searchNote').innerHTML = null;
  preUpdateArr = [];
  boxTable.style.display = 'none'
  const tBody = document.getElementById('boxBody');
  const old_search = tBody.querySelectorAll('tr');
  old_search.forEach(i => i.remove())
}

function buildingRow(b) {
    preUpdateArr.push(objectMap.get(b));
    const boxBody = document.getElementById('boxBody')
    const container = document.createElement('tr');
    const user = document.createElement('td');
    const account = document.createElement('td');
    const box_number = document.createElement('td');
    const description = document.createElement('td');
    const order = document.createElement('td');
    const total_box = document.createElement('td');
    const qty_per_box = document.createElement('td');
    const location = document.createElement('td');
    const date = document.createElement('td');
    const status = document.createElement('td');
    container.appendChild(user);
    container.appendChild(account);
    container.appendChild(box_number);
    container.appendChild(description);
    container.appendChild(order);
    container.appendChild(total_box);
    container.appendChild(qty_per_box)
    container.appendChild(location);
    container.appendChild(date);
    container.appendChild(status);
    user.innerHTML = objectMap.get(b).user.name
    account.innerHTML = objectMap.get(b).account.name;
    box_number.innerHTML = `<a href="/admin/box/${b}" >${b}</a>`;
    description.innerHTML = objectMap.get(b).description;
    order.innerHTML = objectMap.get(b).order;
    total_box.innerHTML = objectMap.get(b).batch.total_box;
    qty_per_box.innerHTML = objectMap.get(b).qty_per_box;
    location.innerHTML = objectMap.get(b).location;
    date.innerHTML = convertor(objectMap.get(b));
    date.setAttribute('uk-tooltip', `pending date ${newDateValidate(objectMap.get(b).batch.pending_date)} ; received date ${newDateValidate(objectMap.get(b).received_date)} ; requested date ${newDateValidate(objectMap.get(b).requested_date)} ; shipped date ${newDateValidate(objectMap.get(b).shipped_date)} ; bill for receiving ${newDateValidate(new Date(objectMap.get(b).bill_received).toLocaleDateString("en-US"))} ; bill for storage ${newDateValidate(new Date(objectMap.get(b).bill_storage).toLocaleDateString("en-US"))} ; bill for shipping ${newDateValidate(new Date(objectMap.get(b).bill_shipped).toLocaleDateString("en-US"))}`)
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
  } else if (s == 4) {
    return 'xc pre-billed'
  } else if (s == 5) {
    return 'xc billed'
  } else if (s == 98) {
    return 'archived'
  }
};

function newDateValidate(date) {
  if (date == "12/31/1969" || !date) {
    return 'N/A'
  } return date
}

const edit_btn = document.getElementById('edit_btn');
const update_btn = document.getElementById('update_btn');
const update_select = document.getElementById('update_select');
const edit_select = document.getElementById('edit_select');
const update_date_select = document.getElementById('update_date_select');
const update_date_btn = document.getElementById('update_date_btn');
function passcode(w) {
  let code = prompt("Please enter the passcode");
  if (code == '0523' && w == 's') {
    localStorage.setItem('pass', 'status update')
    edit_btn.style.display = 'none';
    update_btn.style.display = 'none';
    edit_select.style.display = '';
  } else if (code == '0523' && w == 'd') {
    localStorage.setItem('pass', 'date update')
    update_btn.style.display = 'none';
    edit_btn.style.display = 'none';
    update_select.style.display = '';
  } else {
    alert('Incorrect passcode')
  }
};

function preChangeConfirm() {
  let code_2 = prompt('Please enter the passcode again to confirm the change!');
  if (code_2 == '0523') {
    const status = parseInt(edit_select.value);
    let idArr = [];
    for (let i = 0; i < preUpdateArr.length; i++) {
      const box_id = preUpdateArr[i].id;
      idArr.push(box_id)
    };
    if (status == 99) {
      mannual_delete(idArr)
    } else {
      mannual_update(status, idArr)
    };
    alert(`${preUpdateArr.length} items were updated to status ${status}!`)
    location.reload();
  }
};
////fetch function for status update, delete, and date update//////
function mannual_update(status, box_id) {
  fetch(`/api/box/master_update_status`, {
    method: 'PUT',
    body: JSON.stringify({
        box_id,
        status
    }),
    headers: {
        'Content-Type': 'application/json'
    }
  });
};

function mannual_delete(box_id) {
 fetch(`/api/box/destroy`, {
    method: 'DELETE',
    body: JSON.stringify({
      box_id
  }),
    headers: {
        'Content-Type': 'application/json'
    }
  });
};

function mannual_date_update(id, date, s) {
  fetch(`/api/box/dateUpdate_${s}`, {
    method: 'PUT',
    body: JSON.stringify({
        id,
        date
    }),
    headers: {
        'Content-Type': 'application/json'
    }
  });
};

//helper functions
const isCharacterALetter = (char) => {
  return (/[a-zA-Z]/).test(char)
};

const isCharacterASpeical = (char) => {
  return (/[-]/).test(char)
};

//reload without reset
if (localStorage.getItem('pass') == 'status update') {
  edit_btn.style.display = 'none';
  edit_select.style.display = '';
  update_btn.style.display = 'none';
} else if (localStorage.getItem('pass') == 'date update') {
  edit_btn.style.display = 'none';
  update_btn.style.display = 'none';
  update_select.style.display =''
}

function preUpdateConfirm() {
  if (update_select.value) {
    update_date_btn.style.display ='';
  } else {
    update_date_btn.style.display ='none';
    update_date_select.value = null;
  }
};

function finalConfirmation() {
  if (!preUpdateArr.length) {
    update_date_select.value = null;
    alert('You need to select at least one box to procced the update function');
  } else {
    if (confirm(`UPDATE ${update_select.value} of ${preUpdateArr.length} ITEMS to ${update_date_select.value}?`)) {
      let password = prompt('Please enter the passcode again to confirm the change!');
      if (password == '0523') {
        const chosenStatus = update_select.value;
        var newDate = update_date_select.value;
        let idArr = [];
        if (!newDate) {
          newDate = null;
        };
        for (let i = 0; i < preUpdateArr.length; i++) {
          var box_id = preUpdateArr[i].id;
          if (chosenStatus == 'pending_date') {
            box_id = preUpdateArr[i].batch_id
          };
          idArr.push(box_id)
        };
        mannual_date_update(idArr, newDate, chosenStatus);
        alert(`${chosenStatus} of ${preUpdateArr.length} items were updated to ${newDate}!`)
        location.reload();
      } else {
        alert('incorrect password!');
        finalConfirmation()
      }
    }
  }
}

// rest after clicking master functions
function reset() {
  update_date_btn.style.display = 'none';
  update_select.style.display = 'none';
  edit_select.style.display = 'none'
  edit_btn.style.display = '';
  update_btn.style.display = ''
  localStorage.clear();
};



// document.getElementById('numberOfItems').innerHTML = `${preUpdateArr.length} items; may take up to ${preUpdateArr.length/100} seconds`;
// document.getElementById('loader').style.display = '';