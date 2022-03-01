var table = document.getElementById("myTable");
var rows = table.rows
for (i = 1; i < (rows.length + 1); i++){
  var data_status = rows[i].getElementsByTagName('td');
    if (data_status[10].innerHTML == 1) {
      rows[i].getElementsByTagName("td")[10].innerHTML = "Received"
    } else if (data_status[10].innerHTML == 2) {
      rows[i].getElementsByTagName("td")[10].innerHTML = "Requested"
    } else if (data_status[10].innerHTML == 3) {
      rows[i].getElementsByTagName("td")[10].innerHTML = "Shipped"
    } else if (data_status[10].innerHTML == 4) {
      rows[i].getElementsByTagName("td")[10].innerHTML = "Archived"
    } else {
      rows[i].getElementsByTagName("td")[10].innerHTML = "Pending"
    }
}



function GetSelected() {
  var confirmationArr = [];
  var table = document.getElementById("myTable");
  var checkBoxes = table.getElementsByTagName("input");
    for (var i = 0; i < checkBoxes.length; i++) {
            var confirmation = new Object
            if (checkBoxes[i].checked) {
                var row = checkBoxes[i].parentNode.parentNode;
                confirmation.account = row.cells[1].innerHTML;
                confirmation.box_number = row.cells[2].innerHTML;
                confirmation.description = row.cells[3].innerHTML;
                confirmation.order = row.cells[4].innerHTML;
                confirmation.total_box = row.cells[5].innerHTML;
                confirmation.qty_per_box = row.cells[6].innerHTML;
                confirmation.status = row.cells[10].innerHTML;
                confirmationArr.push(confirmation)
            }
      };
      editStatus(confirmationArr)
};

async function editStatus(event) {
  // event.preventDefault();
  for (let i = 0; i < event.length; i++) {
    const box_number = event[i].box_number
    var status = event[i].status
    console.log(status);
    if(status == 'Pending'){
        status = 1
      } else if (status == 'Received') {
        status = 2
      } else if (status == 'Requested') {
        status = 3
      } else {
        status = 4
      }
    const response = await fetch(`/api/box/status`, {
      method: 'PUT',
      body: JSON.stringify({
          box_number,
          status
      }),
      headers: {
          'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      alert('Status updated successfully!')
      document.location.reload();
    } else {
      alert(response.statusText);
    }
  }


}



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
}

function filter() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
