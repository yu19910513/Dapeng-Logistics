function number_item () {
    var numberOfItem = document.getElementById('numberOfInventory');
    var arr =[]
    var table, tr, td, txtValue;
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[10];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue == 'Received' || txtValue == 'Requested') {
          arr.push(td)
        }
      }
    };
    numberOfItem.innerHTML = arr.length

  }
setInterval (number_item(), 1000);
document.getElementById('inventory_btn').click();
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
document.querySelector("#account_selection").addEventListener("click", saveAccount);
//////////// amazon code from here ////////////////////
// var containerMap = new Map();
// var skuMap = new Map();
// var itemNumberArr = [];
// var containerNumberArr = [];
// var receivedCount = 0;
// var requestedCount = 0;
// function allItem() {
//     fetch(`/api/item/allItem/${account_id}`, {
//       method: 'GET'
//     }).then(function (response) {
//       return response.json();
//     }).then(function (data) {
//         console.log(data);
//       //sort items by item_number
//       const item_data = data.reduce((r, a) => {
//         r[a.item_number] = r[a.item_number] || [];
//         r[a.item_number].push(a);
//         return r;
//       }, Object.create(null));
//       //collection all skus (item_number)
//       for (let k = 0; k < data.length; k++) {
//         const item = data[k].item_number;
//         if (!itemNumberArr.includes(item)) {
//           itemNumberArr.push(item);
//         }
//       };
//       itemNumberArr.forEach(number => {
//         skuMap.set(number, item_data[number])
//       });
//       // sort items by container
//       const container_data = data.reduce((r, a) => {
//         r[a.container.container_number] = r[a.container.container_number] || [];
//         r[a.container.container_number].push(a);
//         return r;
//       }, Object.create(null));
//       const newData = Object.values(container_data);
//       console.log(newData);
//       for (let i = 0; i < newData.length; i++) {
//         const containerNumber = newData[i][0].container.container_number;
//         containerNumberArr.push(containerNumber);
//         containerMap.set(containerNumber, newData[i]);
//         if (newData[i][0].container.status == '1') {
//           receivedCount++
//         } else if (newData[i][0].container.status == '2') {
//           requestedCount++
//         }
//       }
//     })
//   };
// allItem();



// const chinaBoxTable = document.getElementById('myTable')
// const tbody = chinaBoxTable.querySelectorAll('tbody');
// tbody.forEach(i => i.remove());
