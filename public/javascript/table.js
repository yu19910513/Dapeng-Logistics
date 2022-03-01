function sortAccount() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("myTable");
    switching = true;
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[0];
        y = rows[i + 1].getElementsByTagName("TD")[0];
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  };

  function sortDate() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("myTable");
    switching = true;

    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[8];
        y = rows[i + 1].getElementsByTagName("TD")[8];
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }


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



UIkit.util.on('#js-modal-confirm', 'click', function (e) {
  e.preventDefault();
  e.target.blur();
  UIkit.modal.confirm(message).then(function () {
    //fatch put data
      console.log('Confirmed.')
  }, function () {
      console.log('Rejected.')
      return
  });
});

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
