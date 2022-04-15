var loader = document.getElementById('loader');
var table = document.getElementById("myTable");
var rows = table.rows;
for (i = 1; i < (rows.length + 1); i++){
  var data_status = rows[i].getElementsByTagName('td');
    if (data_status[7].innerHTML == 1) {
      rows[i].getElementsByTagName("td")[7].innerHTML = "Received"
    } else if (data_status[7].innerHTML == 2) {
      rows[i].getElementsByTagName("td")[7].innerHTML = "Requested"
    } else if (data_status[7].innerHTML == 3) {
      rows[i].getElementsByTagName("td")[7].innerHTML = "Shipped"
    } else if (data_status[7].innerHTML == 4) {
      rows[i].getElementsByTagName("td")[7].innerHTML = "Archived"
    } else {
      rows[i].getElementsByTagName("td")[7].innerHTML = "Pending"
    }
};

function clear_file() {
  document.getElementById('label').value = null;
  document.getElementById('label_2').value = null;
  document.getElementById('amazon_ref').value = null;
  document.getElementById('label_2').style.display = 'none';
  document.getElementById('amazon_ref').style.display= 'none';
};
function clear_noFile_radio() {
  const no_file = document.getElementById("label_not_required");
  if (no_file.checked) {
    document.getElementById('amazon_ref').value = null;
    no_file.checked = false;
  }
};

function validation_request() {
  const file = document.getElementById('label').files[0];
  const file_2 = document.getElementById('label_2').files[0];
  var check_label = document.getElementById('label_not_required')
  if (!file && !file_2 && !check_label.checked) {
    alert('The shipping label is missing! Please attach a pdf file and try again! 无夹带档案！请夹带档案或者勾选无夹带档案栏，然后再试一遍。')
  } else {
    loader.style.display = '';
    GetSelected()
  }
};


function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable");
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

function second_file() {
  document.getElementById('label_2').style.display = '';
  document.getElementById('amazon_ref').style.display= '';
  clear_noFile_radio()
};

function check_amazon() {
  const no_file = document.getElementById("label_not_required");
  var amazon = document.getElementById('amazon_ref').value.trim();
  amazon = amazon.toUpperCase();
  if (no_file.checked) {
    return
  } else if ( amazon.substring(0,3) != 'FBA' || amazon.length != 12) {
    alert('invalid amazon ref number! start with FBA following by XXXXXXXXX');
  }
}

var map = new Map();
function accountList() {
    fetch(`/api/user/account`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        for (let i = 0; i < data.length; i++) {
            const option = document.createElement('option');
            option.innerHTML = data[i].name + " (prefix: "+ data[i].prefix.toUpperCase() + ")";
            document.querySelector('#accountList').appendChild(option);
            map.set(data[i].name, data[i].id);
        }
    });
};

function saveAccount() {
    var selectedOption = document.querySelector('#accountList').value;

    if(selectedOption != 'Create New Account'){
        var accountSaved = selectedOption.split(' (prefix:');
        var prefixSaved = accountSaved[1].split(')');
        localStorage.setItem('account', accountSaved[0]);
        localStorage.setItem('prefix', prefixSaved[0]);
        localStorage.setItem('account_id', map.get(accountSaved[0]));
    } else {
        localStorage.setItem('account', selectedOption);
    }
};

const locationAddress = location.href.split('/');
const account_id = locationAddress[locationAddress.length-1];
const containerTable = document.getElementById('myTable');
var containerMap = new Map();
var itemMap = new Map();
var itemRef = new Map();
var containerRef = new Map();
var locationRef = new Map();
var trCount = 0;
var costCount = 0;
//init
function getByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
}
function allItem() {
    fetch(`/api/item/allItem/${account_id}`, {
      method: 'GET'
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      for (let k = 0; k < data.length; k++) {
        const item = data[k];
        itemRef.set(item.id, item.item_number);
        containerRef.set(item.container_id, item.container.container_number);
        locationRef.set(item.container_id, item.container.location);
      };
      const container_data = data.reduce((r, a) => {
        r[a.container.container_number] = r[a.container.container_number] || [];
        r[a.container.container_number].push(a);
        return r;
      }, Object.create(null));
      const newData = Object.values(container_data);
      for (let i = 0; i < newData.length; i++) {
        const containerNumber = newData[i][0].container.container_number;
        containerMap.set(containerNumber, newData[i]);
      };
      var tr;
      tr = containerTable.getElementsByTagName('tr');
      for (let i = 1; i < tr.length; i++) {
        const container_number = tr[i].getElementsByTagName('td')[2].innerHTML;
        const sku = tr[i].getElementsByTagName('td')[3];
        const qty = tr[i].getElementsByTagName('td')[4];
        if(containerMap.get(container_number)){
        containerMap.get(container_number).forEach(item => {
          const singleSKU = document.createElement('div');
          const singleQty = document.createElement('div');
          singleQty.setAttribute('class','itemQ');
          singleQty.setAttribute('id',`${item.container_id}_${item.id}_${item.qty_per_sku}`)
          singleQty.setAttribute('onkeyup', `validationSKU(${item.container_id},${item.id},${item.qty_per_sku})`)
          singleSKU.innerHTML = item.item_number;
          singleQty.innerHTML = item.qty_per_sku;
          sku.appendChild(singleSKU);
          qty.appendChild(singleQty)
        })
        } else {
         tr[i].style.display ='none';
         trCount++
        }
      }
      if (trCount == tr.length) {
        containerTable.style.display = 'none';
        document.getElementById('noSign').style.display = '';
      }
    })
  };
allItem();
//helper tools
function validationSKU(container_id, item_id, qty_per_sku) {
  const qtyInput = document.getElementById(`${container_id}_${item_id}_${qty_per_sku}`);
  const qtysku = parseInt(qtyInput.innerHTML);
  if (qtysku <= qty_per_sku && qtysku > -1) {
    qtyInput.setAttribute('class', 'text-danger itemQ')
  } else {
    qtyInput.innerHTML = null;
  };
};
function containerValidation(id) {
  const eachContainer = document.getElementById((`container_${id}`));
  const checkbox = eachContainer.getElementsByTagName('input');
  const singleQty = eachContainer.querySelectorAll('.itemQ');
  if (checkbox[0].checked) {
    for (let i = 0; i < singleQty.length; i++) {
      const div = singleQty[i];
      div.setAttribute('contenteditable',true)
    }
  } else {
    for (let i = 0; i < singleQty.length; i++) {
      const div = singleQty[i];
      const divInfo = singleQty[i].getAttribute('id').split('_');
      div.innerHTML = divInfo[2];
      div.removeAttribute('class','text-danger');
      div.setAttribute('class', 'itemQ');
      div.setAttribute('contenteditable',false)
    }
  }
};
// submit function
var requestedObjArr = [];
var requestedItemIdArr = [];
var masterArr = [];
function GetSelected() {
  const code = new Date().valueOf();
  var fba = document.getElementById('amazon_ref').value.trim()
  fba = fba.toUpperCase();
  const notes = document.getElementById('notes').value;
  var table = document.getElementById("myTable");
  var selectedSkus = table.querySelectorAll(".text-danger");
  for (var i = 0; i < selectedSkus.length; i++) {
    const eachSkuInfo = selectedSkus[i].getAttribute('id').split('_');
    const container_id = parseInt(eachSkuInfo[0]);
    const item_id = parseInt(eachSkuInfo[1]);
    const original_qty = parseInt(eachSkuInfo[2]);

    const location = locationRef.get(container_id);
    const container_number = containerRef.get(container_id);
    const item_number = itemRef.get(item_id);
    const qty_per_sku = parseInt(selectedSkus[i].innerHTML);
    costCount = costCount + qty_per_sku;
    const master_qty = original_qty - qty_per_sku;
    /////// EACH master_item obj to update the master box
    var master_item = new Object();
    master_item.id = item_id;
    master_item.qty_per_sku = master_qty;
    master_item.container_id = container_id;
    masterArr.push(master_item);
    ////// EACH requested obj to insert into a new container
    var requested_item = new Object();
    requested_item.item_number = item_number;
    requested_item.qty_per_sku = qty_per_sku;
    requested_item.account_id = account_id;
    requested_item.description = `${container_number}:${location}`
    requestedObjArr.push(requested_item);
    requestedItemIdArr.push(item_id);
  };
   /////// create ONE new container
   var requestedContainer = new Object();
   requestedContainer.account_id = account_id;
   requestedContainer.cost = costCount;
   requestedContainer.fba = fba;
   requestedContainer.location = 'virtual';
   requestedContainer.notes = notes;
   requestedContainer.s3 = code;
   if (fba) {
    requestedContainer.container_number = `REQ-${fba}`
   } else {
    requestedContainer.container_number = `REQ-${code}`
   };
  if (requestedObjArr.length) {
    updateMasterItem(masterArr);
    createContainer(requestedObjArr, requestedContainer);
  } else {
    loader.style.display = 'none';
    alert('You need to select at least one box! 您需要选择至少一个箱货')
  }

};
async function createContainer(requestedObjArr, requestedContainer) {
  console.log('boxCreate');
  const response = await fetch('/api/container/amazon_request', {
      method: 'post',
      body: JSON.stringify(requestedContainer),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
     console.log("amazon box inserted", `S3 = ${requestedContainer.s3}`);
     findContainerId(requestedContainer.container_number, requestedContainer.s3, requestedObjArr);
    } else {
      alert('try again')
 }
};
function findContainerId(c_number, s3, objArr) {
  console.log('getting container_id');
  fetch(`/api/container/amazon_container/${c_number}`, {
      method: 'GET'
  }).then(function (response) {
      return response.json();
  }).then(function (data) {
      console.log('container_id fetched');
     const containerID = data.id
     itemCreate(objArr, s3, containerID);
  })
};
function itemCreate(objArr, s3, id) {
  console.log('itemCreate');
  for (let i = 0; i < objArr.length; i++) {
    const item = objArr[i];
    item.container_id = id;
    loadingItems(item);
  };
  upload_file(s3)
};
function loadingItems(data) {
  fetch('/api/item/new', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
  });
};
function upload_file(e) {
  const file = document.getElementById('label').files[0];
  const file_2 = document.getElementById('label_2').files[0];

  if (!file_2 && file) {
    upload_framwork(file, e)
  } else if (!file && file_2) {
    upload_framwork(file_2, e)
  } else if (file && file_2) {
    upload2F_framwork(file, file_2, e)
  } else {
    loader.style.display = 'none';
    alert('Status updated successfully! No file was attached.出货通知已传送成功，无夹带档案');
    document.location.reload();
  }
};
async function upload_framwork(file, e) {
  let formData = new FormData();
    formData.append('file', file);
    formData.append('s3',e)
    const response = await fetch(`/api/container/upload`, {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      console.log(response);
      loader.style.display = 'none';
      alert('Status updated successfully! 出货通知已传送成功! 一份档案已接收');
      document.location.reload();
    } else {
      alert(response.statusText);
    }
};
async function upload2F_framwork(file, file_2, e) {
  let formData = new FormData();
    formData.append('file', file);
    formData.append('s3',e)

    const response = await fetch(`/api/container/upload`, {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      upload2F_framwork_file2(file_2, e)
    } else {
      alert(response.statusText);
    }
};
async function upload2F_framwork_file2(file, e) {
  let formData = new FormData();
    formData.append('file', file);
    formData.append('s3',e)

    const response = await fetch(`/api/container/upload_2`, {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      console.log(response);
      loader.style.display = 'none';
      alert('Status updated successfully! Two files uploaded 上传成功，两份档案已接收');
      document.location.reload();
    } else {
      alert(response.statusText);
    }
};
//////// update masterBox ////////
function updateMasterItem (arr) {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item.qty_per_sku < 1) {
      removeZeroItem(item)
    } else {
      updateRemainderItem(item)
    }
  }
};
function updateRemainderItem(data) {
  fetch(`/api/item/updateQty_ExistedItemId/${data.container_id}&${data.id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
});
};
function removeZeroItem(data) {
  fetch(`/api/item/destroy/${data.id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'}
});
}
