const locationAddress = location.href.split('/');
const account_id = locationAddress[locationAddress.length-1];
const containerTable = document.getElementById('myTable');
var containerMap = new Map();
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
          singleQty.setAttribute('contenteditable',true);
          singleSKU.innerHTML = item.item_number;
          singleQty.innerHTML = item.qty_per_sku;
          sku.appendChild(singleSKU);
          qty.appendChild(singleQty)
        })
      }
    })
  };
allItem();
