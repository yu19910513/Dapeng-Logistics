console.log(location.href, 'master home.js');
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
        if (txtValue == '存货' || txtValue == '通知寄出') {
          arr.push(td)
        }
      }
    };
    numberOfItem.innerHTML = arr.length

  }
setInterval (number_item(), 1000);

document.getElementById('inventory_btn').click();
