const tablet = document.querySelector('table')
var prefix_map = new Map();
var account_map = new Map();
var rows = tablet.rows
var account_nameArr = [];
var arr = [];

function compile() {
    for (let i = 3; i < rows.length; i++) {
        let box_number = rows[i].cells[1].innerHTML;
        var account_name = rows[i].cells[4].innerHTML;
        if (account_name.substring(0,3)== "<di") {
            var master = rows[i].cells[4];
            var master_slect = master.querySelector('div');
            account_name = master_slect.innerHTML;
            if (!account_nameArr.includes(box_number)) {
                account_nameArr.push(account_name);
                prefix_map.set(account_name, prefixFilter(box_number));
            };
        } else {
            if (!account_nameArr.includes(account_name) && account_name) {
            account_nameArr.push(account_name);
            prefix_map.set(account_name, prefixFilter(box_number))
            };
        };
    };
    for (let j = 0; j < account_nameArr.length; j++) {
        loadingAccount(
            {
                name: account_nameArr[j],
                prefix: prefix_map.get(account_nameArr[j])
            }
        )
    };
    alert('success!')
}

function compile_2(s, e) {
    findAccountId(s, e)
}

//helper function
function prefixFilter(box_number) {
    if (box_number.substring(0,2) == 'SW') {
        return box_number.substring(2,5)
    } else {
        return "000"
    }
};

function findAccountId(s, e) {
    fetch(`/api/user/account`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        for (let j = 0; j < data.length; j++) {
            account_map.set(data[j].name, data[j].id);
        };
        loading(s, e);
    });
};

async function loadingAccount(data) {
    const response = await fetch('/api/account', {
        method: 'post',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
       console.log("account inserted");
      } else {
        alert('try again')
   }

}

function filter_s(e) {
    if (e.innerHTML.substring(0,3)== "<di") {
        var filter_e = e.querySelector('div');
        return filter_e.innerHTML
    } else {
        return e.innerHTML
    }
}
function loading(start, end) {
    if (end > rows.length) {
        end = rows.length
    };
    for (var i = start; i < end; i++ ) {
        const box_number = `${filter_s(rows[i].cells[1])}*`;
        const account_name = filter_s(rows[i].cells[4]);
        const received_date = filter_s(rows[i].cells[2]);
        const description = filter_s(rows[i].cells[5]);
        const location = filter_s(rows[i].cells[8]);
        const length = parseInt(filter_s(rows[i].cells[9]))*2.54;
        const width = parseInt(filter_s(rows[i].cells[10]))*2.54;
        const height = parseInt(filter_s(rows[i].cells[11]))*2.54;
        const volume = parseInt(length*width*height);
        const storage_date_b = new Date(document.getElementById('st_b').value.trim()).getTime();
        const received_date_b = new Date(document.getElementById('r_b').value.trim()).getTime();
        const orderdata = {
            user_id: 3,
            account_id: account_map.get(account_name),
            batch_id: 1,
            received_date: received_date,
            box_number: box_number,
            description: description,
            sku: 'not available',
            qty_per_box: 0,
            order: `${filter_s(rows[i].cells[6])} of ${filter_s(rows[i].cells[7])}`,
            weight: 0,
            length: length,
            width: width,
            height: height,
            volume: volume,
            location: location,
            status: 1,
            bill_storage: storage_date_b,
            bill_received: received_date_b
        };

        if (orderdata.account_id) {
            arr.push(orderdata);
            loadingBox(orderdata);
        };
    };

    console.log(arr);
    //  loadingBox(arr[101]);
};

async function loadingBox(data) {

    const response = await fetch('/api/box/seeds', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
      console.log('ok');
      } else {
        console.log(data.box_number);
      }

}
