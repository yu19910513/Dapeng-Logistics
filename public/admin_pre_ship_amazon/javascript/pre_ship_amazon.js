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
var skuArr = []
function pre_check() {
    const value = input.value.trim();
    if (container_numberArr.includes(value) && document.getElementById(value).getAttribute('class') != 'lead text-center bg-success') {
        for (let i = 0; i < container_numberArr.length; i++) {
            document.getElementById(container_numberArr[i]).setAttribute('class', 'lead text-center bg-warning' )
        };
        document.getElementById(value).setAttribute('class','lead text-center bg-success');
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
    } else if (container_numberArr.includes(value) && document.getElementById(value).getAttribute('class') == 'lead text-center bg-success') {
        const eachTable = document.getElementById(`t_${value}`);
        const rows = eachTable.rows;
        rows[0].setAttribute('class','bg-success');
        for (let i = 1; i < rows.length; i++) {
            rows[i].setAttribute('class','bg-success')
            const sku = rows[i].getElementsByTagName("td")[0];
            selectedSkuArr.push(sku.innerText);
        };
        input.value = null;
    } else if (skuArr.includes(value) && !selectedSkuArr.includes(value) && document.getElementById(localStorage.getItem('selectedBox')).getAttribute('class') == 'lead text-center bg-success') {
        const qtyPerSKu = document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`);
        if (qtyPerSKu) {
            const newQty = parseInt(qtyPerSKu.innerHTML)-1;
            if (newQty > 0) {
                document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`).innerHTML = newQty;
                input.value = null;
            } else if (newQty == 0) {
                document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`).innerHTML = newQty;
                document.getElementById(`qty_${value}_${localStorage.getItem('selectedBox')}`).parentElement.setAttribute('class','bg-success');
                selectedSkuArr.push(document.getElementById(`${value}_${localStorage.getItem('selectedBox')}`).innerHTML);
                input.value = null;
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

var timer = null;
function delay(fn){
    clearTimeout(timer);
    timer = setTimeout(fn, 50)
}
