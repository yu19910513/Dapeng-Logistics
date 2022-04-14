const locationAddress = location.href.split('/');
const account_id = locationAddress[locationAddress.length-1];
const containerTable = document.getElementById('myTable');
var containerMap = new Map();
var itemMap = new Map();
function allItem() {
    fetch(`/api/item/allItem/${account_id}`, {
      method: 'GET'
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
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
      }
    })
  };
allItem();

function validationSKU(container_id, item_id, qty_per_sku) {
  const qtyInput = document.getElementById(`${container_id}_${item_id}_${qty_per_sku}`);
  const qtysku = parseInt(qtyInput.innerHTML);
  if (qtysku <= qty_per_sku && qtysku > -1) {
    qtyInput.setAttribute('class', 'text-danger itemQ')
  } else {
    qtyInput.innerHTML = null;
  };
}
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
}

// function GetSelected() {
//   var fba = document.getElementById('amazon_ref').value.trim()
//   fba = fba.toUpperCase();
//   var notes = document.getElementById('notes').value;
//   var confirmationArr = [];
//   var table = document.getElementById("myTable");
//   var checkBoxes = table.getElementsByTagName("input");
//     for (var i = 0; i < checkBoxes.length; i++) {
//             var confirmation = new Object
//             if (checkBoxes[i].checked) {
//                 var row = checkBoxes[i].parentNode.parentNode;
//                 confirmation.account = row.cells[1].innerHTML;
//                 confirmation.box_number = row.cells[2].innerHTML;
//                 confirmation.description = row.cells[3].innerHTML;
//                 confirmation.order = row.cells[4].innerHTML;
//                 confirmation.total_box = row.cells[5].innerHTML;
//                 confirmation.qty_per_box = row.cells[6].innerHTML;
//                 confirmation.status = row.cells[10].innerHTML;
//                 confirmation.fba = fba;
//                 confirmationArr.push(confirmation)
//             }
//       };
//       if (confirmationArr.length) {
//         editStatus(confirmationArr, notes)
//       } else {
//         loader.style.display = 'none';
//         alert('You need to select at least one box! 您需要选择至少一个箱货')
//       }

// };
