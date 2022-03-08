function update() {
    var scan_item = document.getElementById('scanned_item').value;
    if (scan_item.length == 12 && scan_item[0] == 'S' && scan_item[1] == 'W') {
        auto_receive(scan_item)
    }
}



async function auto_receive(event) {
      const box_number = event;
      const status = 1;
      const received_date = new Date().toLocaleDateString("en-US");

      const response = await fetch(`/api/box/status_admin_receiving`, {
        method: 'PUT',
        body: JSON.stringify({
            box_number,
            status,
            received_date
        }),
        headers: {
            'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log("box updated");
        document.getElementById('scanned_item').value = null;
       } else {
         alert("This box number is not registered! It can't be received!");
         document.getElementById('scanned_item').value = null;
       }

  }
