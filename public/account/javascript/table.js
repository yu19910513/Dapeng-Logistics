console.log(location.href, 'account table.js');
var loader = document.getElementById('loader');
var table = document.getElementById("myTable");
var rows = table.rows;
for (i = 1; i < rows.length; i++){
  var data_status = parseInt(rows[i].cells[9].innerText);
    if (data_status == 1) {
      rows[i].getElementsByTagName("td")[10].innerHTML = "Received"
    } else if (data_status == 2) {
      rows[i].getElementsByTagName("td")[10].innerHTML = "Requested"
    } else if (data_status == 3) {
      rows[i].getElementsByTagName("td")[10].innerHTML = "Shipped"
    } else if (data_status == 4) {
      rows[i].getElementsByTagName("td")[10].innerHTML = "Archived"
    } else {
      rows[i].getElementsByTagName("td")[10].innerHTML = "Pending"
    }
};
function show_all() {
  var table, tr, td, i, txtValue, a, b, c, d;
  a = "received".toUpperCase();
  b = "requested".toUpperCase();
  c = "pending".toUpperCase();
  d = "shipped".toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[10];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(a) > -1 || txtValue.toUpperCase().indexOf(b) > -1 || txtValue.toUpperCase().indexOf(c) > -1 || txtValue.toUpperCase().indexOf(d) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
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
function status_trigger(n) {
  if (n == 2) {
    const pending = 'Pending';
    filter_status(pending)
  } else if (n == 3) {
    const received = 'Received';
    filter_status(received)
  } else if (n == 4) {
    const requested = 'Requested';
    filter_status(requested)
  } else if (n == 5) {
    const shipped = 'Shipped';
    filter_status(shipped)
  } else if (n == 6) {
    const received = 'Received';
    const requested = 'Requested';
    filter_status_i(received, requested)
  } else {
    show_all();
  }
};
function filter_status(txt) {
  var filter, table, tr, td, i, txtValue;
  filter = txt.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[10];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
};
function filter_status_i(txt, txt_2) {
  var filter, filter_2, table, tr, td, i, txtValue;
  filter = txt.toUpperCase();
  filter_2 = txt_2.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[10];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1 || txtValue.toUpperCase().indexOf(filter_2) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  };
  reset_filter();
};
function reset_filter() {
 const radiolist =  document.getElementsByTagName('input');
 for (let i = 0; i < radiolist.length; i++) {
   if (radiolist[i].type.toLowerCase() == 'radio') {
    radiolist[i].checked = false;
   }
 }
};
// var map = new Map();
// function accountList() {
//     fetch(`/api/user/account`, {
//         method: 'GET'
//     }).then(function (response) {
//         return response.json();
//     }).then(function (data) {
//         for (let i = 0; i < data.length; i++) {
//             const option = document.createElement('option');
//             option.innerHTML = data[i].name + " (prefix: "+ data[i].prefix.toUpperCase() + ")";
//             document.querySelector('#accountList').appendChild(option);
//             map.set(data[i].name, data[i].id);
//         }
//     });
// };
// function saveAccount() {
//     var selectedOption = document.querySelector('#accountList').value;

//     if(selectedOption != 'Create New Account'){
//         var accountSaved = selectedOption.split(' (prefix:');
//         var prefixSaved = accountSaved[1].split(')');
//         localStorage.setItem('account', accountSaved[0]);
//         localStorage.setItem('prefix', prefixSaved[0]);
//         localStorage.setItem('account_id', map.get(accountSaved[0]));
//     } else {
//         localStorage.setItem('account', selectedOption);
//     }
// }
