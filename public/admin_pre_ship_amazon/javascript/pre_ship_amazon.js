const container_id = location.href.split('/').slice(-1)[0];
const notes = document.getElementById('notes');
const input = document.getElementById("scanned_item");
var container_numberArr = [];
function supplemental () {
    fetch(`/api/container/container/${container_id}`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        notes.innerHTML = data[0].notes;
        const descriptionArr = document.querySelectorAll('h5');
        const tableArr = document.querySelectorAll('table')
        for (let i = 0; i < descriptionArr.length; i++) {
            const container_number = descriptionArr[i].innerText.split(':')[0];
            descriptionArr[i].setAttribute('id',container_number);
            tableArr[i].setAttribute('id', `t_${container_number}`);
            container_numberArr.push(container_number);
        };
    })
};supplemental();

var selectedSkuArr = [];
var skuArr = [];
function pre_check() {
    const value = input.value.trim();
    const all_td = document.querySelectorAll('td');
    if (container_numberArr.includes(value) && document.getElementById(value).getAttribute('class') != 'lead text-center rounded shadow-sm bg-info') {
        for (let i = 0; i < container_numberArr.length; i++) {
            document.getElementById(container_numberArr[i]).setAttribute('class', 'lead text-center rounded shadow-sm bg-light')
        };
        document.getElementById(value).setAttribute('class','lead text-center rounded shadow-sm bg-info');
        localStorage.setItem('selectedBox',value);
        const eachTable = document.getElementById(`t_${value}`);
        const rows = eachTable.rows;
        for (let i = 1; i < rows.length; i++) {
            const sku = rows[i].getElementsByTagName("td")[0];
            skuArr.push(sku.innerHTML);
            sku.setAttribute('id',`${sku.innerText}_${value}`)
            const qty = rows[i].getElementsByTagName("td")[1];
            qty.setAttribute('id',`qty_${sku.innerText}_${value}`)
        };
        input.value = null;
    } else if (container_numberArr.includes(value) && document.getElementById(value).getAttribute('class') == 'lead text-center rounded shadow-sm bg-info') {
        const eachTable = document.getElementById(`t_${value}`);
        const rows = eachTable.rows;
        rows[0].setAttribute('class','bg-info');
        for (let i = 1; i < rows.length; i++) {
            rows[i].setAttribute('class','bg-info')
            const sku = rows[i].getElementsByTagName("td")[0];
            selectedSkuArr.push(sku.innerText);
        };
        input.value = null;
        td_checker (all_td);
    } else if (skuArr.includes(value) && !selectedSkuArr.includes(value) && document.getElementById(localStorage.getItem('selectedBox')).getAttribute('class') == 'lead text-center rounded shadow-sm bg-info') {
        const qtyPerSKu = document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`);
        if (qtyPerSKu) {
            const newQty = parseInt(qtyPerSKu.innerHTML)-1;
            if (newQty > 0) {
                document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`).innerHTML = newQty;
                input.value = null;
            } else if (newQty == 0) {
                document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`).innerHTML = newQty;
                document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`).parentElement.setAttribute('class','bg-info');
                selectedSkuArr.push(document.getElementById(`${value}_${localStorage.getItem('selectedBox')}`).innerHTML);
                input.value = null;
                td_checker (all_td);
            }
        } else {
            alert(`${value} is not associated with the box: ${localStorage.getItem('selectedBox')}; please scan the right box first`);
            input.value = null;
        }
    } else {
        alert('Incorrect Input');
        input.value = null;
    }
}

function td_checker (arr) {
    var finalCount = 0;
    for (let i = 0; i < arr.length; i++) {
        const eachTd = arr[i].parentElement;
        if (eachTd.getAttribute('class') == 'bg-info') {
            finalCount++
        }
    };
    if (finalCount == arr.length) {
        if (confirm(`Please confirm the shipping for ${arr.length/2} SKUs`)) {
            updateReqContainer(container_id);
        }
    }
}

var timer = null;
function delay(fn){
    clearTimeout(timer);
    timer = setTimeout(fn, 50)
}

async function updateReqContainer(container_id) {
    const shipped_date = new Date().toLocaleDateString("en-US");
    const id = container_id;
    const status = 3;
    const response = await fetch(`/api/container/reqContainer`, {
        method: 'PUT',
        body: JSON.stringify({
            id,
            status,
            shipped_date
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        alert('this requested container has been confirmed for shipping!');
        window.location.replace('/admin_move_main_amazon');
    }

}
