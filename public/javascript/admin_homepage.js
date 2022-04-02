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




const boxInput = document.getElementById("boxInput");
const boxTable = document.getElementById("boxTable");


function box_searchBtn(b) {
    for (i = 0; i < boxNumberArr.length; i++) {
    if (b.length >= 3) {
      let txtValue = boxNumberArr[i];
      if (txtValue.toUpperCase().indexOf(b.toUpperCase()) > -1) {
        filterFunction_box(boxNumberArr[i]);
        document.getElementById('searchNote').innerHTML = null;
      }
    }
  };
};

function location_search(l) {
  for (i = 0; i < locationArr.length; i++) {
    let txtValue = locationArr[i];
    if (txtValue.toUpperCase().indexOf(l.toUpperCase()) > -1) {
      locationMap.get(locationArr[i]).forEach((obj)=> {filterFunction_box(obj.box_number)})
    }
  }
};

function box_searching() {
unattach();
 var box_input = document.getElementById('myBoxInput').value.trim();
 if (box_input) {
    boxTable.style.display = '';
 };
 if (box_input[0] == '/') {
  document.getElementById('searchNote').innerHTML = "The partial function is initiated, please input at least 3 key characters associated with box number"
  box_input = box_input.substring(1,box_input.length)
  box_searchBtn(box_input)
 } else if (isCharacterALetter(box_input[0]) && !isNaN(box_input[1])) {
  location_search(box_input)
 } else {
  document.getElementById('searchNote').innerHTML = null;
  if (boxNumberArr.includes(box_input.toUpperCase())) {
    filterFunction_box(box_input.toUpperCase());
    document.getElementById('myBoxInput').value = null;
  }
 }
};

function unattach() {
boxTable.style.display = 'none'
const tBody = document.getElementById('boxBody');
const old_search = tBody.querySelectorAll('tr');
old_search.forEach(i => i.remove())
}

function filterFunction_box(b) {
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


//helper functions
const isCharacterALetter = (char) => {
  return (/[a-zA-Z]/).test(char)
};

const isCharacterASpeical = (char) => {
  return (/[-]/).test(char)
};
