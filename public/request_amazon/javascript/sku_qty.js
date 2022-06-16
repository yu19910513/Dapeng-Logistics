console.log(location.href, 'req_amazon sku_qty js');
const locationAddress = location.href.split('/');
const account_id = locationAddress[locationAddress.length-1].replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

const containerTable = document.getElementById('myTable');
var containerMap = new Map();
var itemMap = new Map();
var itemRef = new Map();
var containerRef = new Map();
var locationRef = new Map();
var costCount = 0;
var masterAccountIdArr = [];
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
      var emptyBoxArr = [];
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
          emptyBoxArr.push(tr[i])
         tr[i].style.display ='none';
        }
      }
      emptyBoxArr.forEach(i => i.remove());
      if (tr.length == 1) {
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
  if (qtysku <= qty_per_sku && qtysku > 0) {
    qtyInput.setAttribute('class', 'text-danger itemQ')
  } else {
    qtyInput.innerHTML = null;
    qtyInput.setAttribute('class', 'itemQ')
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
    const selectedAcccountId = containerMap.get(container_number)[0].account_id;
    masterAccountIdArr.push(selectedAcccountId);
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
    if (account_id) {
      requested_item.account_id = account_id
     } else {
      requested_item.account_id = masterAccountIdArr[0];
     };
    requested_item.description = `${container_number}:${location}`
    requestedObjArr.push(requested_item);
    requestedItemIdArr.push(item_id);
  };
   /////// create ONE new container
   var requestedContainer = new Object();
   if (account_id) {
    requestedContainer.account_id = account_id
   } else {
    requestedContainer.account_id = masterAccountIdArr[0];
   }
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
  console.log('Container Created');
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
    // alert('Status updated successfully! No file was attached.出货通知已传送成功，无夹带档案');
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
      // alert('Status updated successfully! 出货通知已传送成功! 一份档案已接收');
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
      // alert('Status updated successfully! Two files uploaded 上传成功，两份档案已接收');
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
};

function selectAll(id) {
  const eachContainer = document.getElementById((`container_${id}`));
  const checkbox = eachContainer.getElementsByTagName('input');
  const singleQty = eachContainer.querySelectorAll('.itemQ');
  if (checkbox[0].checked) {
    for (let i = 0; i < singleQty.length; i++) {
      const div = singleQty[i];
      div.setAttribute('class','text-danger itemQ');
    }
  }
};


////// request init & pre check ////////
function validation_request() {
  const file = document.getElementById('label').files[0];
  const file_2 = document.getElementById('label_2').files[0];
  var check_label = document.getElementById('label_not_required')
  if (!file && !file_2 && !check_label.checked) {
    alert('The shipping label is missing! Please attach a pdf file and try again! 无夹带档案！请夹带档案或者勾选无夹带档案栏，然后再试一遍。')
  } else {
    preCheckPage(file, file_2)
  }
};
function preCheckPage(file, file_2) {
  var fileName, fileName_2;
  var confirmationArr = [];
  var noRepeatArr = [];
  const notes = document.getElementById('notes').value;
  var table = document.getElementById("myTable");
  var selectedSkus = table.querySelectorAll(".text-danger");
  for (var i = 0; i < selectedSkus.length; i++) {
    var eachBox;
    const eachSkuInfo = selectedSkus[i].getAttribute('id').split('_');
    const container_id = parseInt(eachSkuInfo[0]);
    const item_id = parseInt(eachSkuInfo[1]);
    const item_number = itemRef.get(item_id);
    const qty_per_sku = parseInt(selectedSkus[i].innerHTML);
    const container_number = containerRef.get(container_id);
    if (!noRepeatArr.includes(container_number)) {
      noRepeatArr.push(container_number);
      eachBox = `<tr>
      <td class='text-primary'><b>${container_number}</b><td>
      <td>${item_number}<td>
      <td>${qty_per_sku}<td>
      </tr>`;
    } else {
      eachBox = `<tr>
      <td><td>
      <td>${item_number}<td>
      <td>${qty_per_sku}<td>
      </tr>`;
    }
      confirmationArr.push(eachBox)
  };
  if (selectedSkus.length) {
    confirmationArr = confirmationArr.join('');
      if (file) {
        fileName = file.name
      } else {
        fileName = `no file`
      };
      if (file_2) {
        fileName_2 = file_2.name
      } else {
        fileName_2 = `no file`
      };
      UIkit.modal.confirm(`<small class='text-primary' uk-tooltip="title: This page is a pre-check step before proceeding the confirmation. Please review your request order. If there is any input error, simply click “Cancel” and correct it. Otherwise, click “OK” to continue; pos: right">此页为检查页面，若发现输入/选择错误，请按“Cancel”并更改；若所有输入皆正确，请按“OK”完成通知</small><table class="uk-table uk-table-small uk-table-divider">
      <thead>
        <tr>
        <th>箱码/ SKU/ 数量</th>
        <th></th>
        <th></th>
        </tr>
      </thead>
      <tbody>
      ${confirmationArr}
      </tbody>
      </table><hr><b>附注留言</b>: ${notes}<hr><b>档案:</b> <u>${fileName}</u> & <u>${fileName_2}</u>`).then(function () {
        loader.style.display = '';
        GetSelected()
    }, function () {
        console.log('Rejected.')
    });
  } else {
    alert('You need to select at least one box! 您需要选择至少一个SKU')
  }
};
