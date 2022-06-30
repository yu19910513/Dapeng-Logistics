var inventoryCount = 0;
var numberOfItem = document.getElementById('numberOfInventory');
const locationAddress = location.href.split('/');
const account_id = locationAddress[locationAddress.length-1];
const containerTable = document.getElementById('myTable');
var containerMap = new Map();
function number_item () {
    var table, tr, td, txtValue, sku;
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[6];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue == '存货' || txtValue == '通知寄出') {
          inventoryCount++
        }
      }
    };
    allItem();
  } number_item();
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
      var skuCount = 0;
      var emptyArr = [];
      tr = containerTable.getElementsByTagName('tr');
      for (let i = 1; i < tr.length; i++) {
        const container_number = tr[i].getElementsByTagName('td')[1].innerHTML;
        const sku = tr[i].getElementsByTagName('td')[2];
        const qty = tr[i].getElementsByTagName('td')[3];
        if(containerMap.get(container_number) && container_number.substring(0,1) != "T"){
        containerMap.get(container_number).forEach(item => {
          skuCount++;
          const singleSKU = document.createElement('div');
          const singleQty = document.createElement('div');
          singleSKU.innerHTML = item.item_number;
          singleQty.innerHTML = item.qty_per_sku;
          sku.appendChild(singleSKU);
          qty.appendChild(singleQty)
        })
      } else {
        emptyArr.push(tr[i]);
        inventoryCount--
        tr[i].style.display = 'none';
      }
      };
      emptyArr.forEach(i => i.remove())
      numberOfItem.innerHTML = inventoryCount
    })
};

document.getElementById('inventory_btn').click();
