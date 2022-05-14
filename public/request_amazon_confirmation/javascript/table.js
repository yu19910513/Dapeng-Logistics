console.log(location.href, 'req_amazon table');
var loader = document.getElementById('loader');
var table = document.getElementById("myTable");
var rows = table.rows;
for (i = 1; i < (rows.length + 1); i++){
  var data_status = rows[i].getElementsByTagName('td');
    if (data_status[7].innerHTML == 1) {
      rows[i].getElementsByTagName("td")[7].innerHTML = "Received"
    } else if (data_status[7].innerHTML == 2) {
      rows[i].getElementsByTagName("td")[7].innerHTML = "Requested"
    } else if (data_status[7].innerHTML == 3) {
      rows[i].getElementsByTagName("td")[7].innerHTML = "Shipped"
    } else if (data_status[7].innerHTML == 4) {
      rows[i].getElementsByTagName("td")[7].innerHTML = "Archived"
    } else {
      rows[i].getElementsByTagName("td")[7].innerHTML = "Pending"
    }
};

function clear_file() {
  document.getElementById('label').value = null;
  document.getElementById('label_2').value = null;
  document.getElementById('amazon_ref').value = null;
  document.getElementById('label_2').style.display = 'none';
  document.getElementById('amazon_ref').style.display= 'none';
  const no_file = document.getElementById("label_not_required");
  if (no_file.checked) {
    document.getElementById('amazon_ref').style.display = ''
  }
};
function clear_noFile_radio() {
  const no_file = document.getElementById("label_not_required");
  if (no_file.checked) {
    document.getElementById('amazon_ref').value = null;
    no_file.checked = false;
  }
};
function validation_request() {
  const file = document.getElementById('label').files[0];
  const file_2 = document.getElementById('label_2').files[0];
  var check_label = document.getElementById('label_not_required')
  if (!file && !file_2 && !check_label.checked) {
    alert('The shipping label is missing! Please attach a pdf file and try again! 无夹带档案！请夹带档案或者勾选无夹带档案栏，然后再试一遍。')
  } else {
    loader.style.display = '';
    GetSelected()
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
function second_file() {
  document.getElementById('label_2').style.display = '';
  document.getElementById('amazon_ref').style.display= '';
  clear_noFile_radio()
};
function check_amazon() {
  const no_file = document.getElementById("label_not_required");
  var amazon = document.getElementById('amazon_ref').value.trim();
  amazon = amazon.toUpperCase();
  if (!no_file.checked && document.getElementById('amazon_ref').style.display == '' || no_file.checked) {
    // if ( amazon.substring(0,3) != 'FBA' || amazon.length != 12) {
    //   alert('invalid amazon ref number! start with FBA following by XXXXXXXXX');
    // }
  } else {
   return
  }
}
