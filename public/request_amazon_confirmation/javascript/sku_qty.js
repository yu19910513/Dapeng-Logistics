console.log(location.href, 'req_amazon_confirmation sku_qty js');
const today = new Date().toLocaleDateString("en-US");
const locationAddress = location.href.split('/');
const account_id = locationAddress[locationAddress.length-1];

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
  }; allItem();

var selectBoxId = [];
function selectBatch (tracking) {
  selectBoxId = [];
  const allSiblingBoxes = document.getElementsByClassName(tracking);
  console.log(allSiblingBoxes, tracking);
  for (let i = 0; i < allSiblingBoxes.length; i++) {
    const eachCheckBox = allSiblingBoxes[i].getElementsByTagName('input')[0];
    const eachContainerId = parseInt(eachCheckBox.parentElement.parentElement.getAttribute('id').split('_')[1]);
    selectBoxId.push(eachContainerId);
    eachCheckBox.parentElement.setAttribute('class','border border-success rounded shadow-sm')
    eachCheckBox.checked = true
  }
  const allOtherBoxes = document.querySelectorAll('tbody input');
  for (let k = 0; k < allOtherBoxes.length; k++) {
    allOtherBoxes[k].disabled = true
  }
}
//helper function
function resetCheckBox() {
  const allOtherBoxes = document.querySelectorAll('tbody input');
  for (let k = 0; k < allOtherBoxes.length; k++) {
    allOtherBoxes[k].parentElement.setAttribute('class', '')
    allOtherBoxes[k].disabled = false;
    allOtherBoxes[k].checked = false;
  }
};

//init of submission
function GetSelected() {
  if (selectBoxId.length) {
    var confirmationBatch = new Object()
    const s3 = new Date().valueOf();
    var fba = document.getElementById('amazon_ref').value.trim()
    fba = fba.toUpperCase();
    const notes = document.getElementById('notes').value;
    confirmationBatch.requested_date = today;
    confirmationBatch.id = selectBoxId;
    confirmationBatch.s3 = s3;
    confirmationBatch.fba = fba;
    confirmationBatch.notes = notes;
    confirmationBatch.status = 2;
    updateContainer(confirmationBatch, s3)
  } else {
    alert('no container was selected! please try again!');
    loader.style.display = 'none';
  }
};
async function updateContainer(data, s3) {
  const response = await fetch(`/api/container/amazon_label_submission`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    upload_file(s3)
  } else {
    alert('fail')
  }
};


//// file uploading function
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
