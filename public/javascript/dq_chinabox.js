console.log('chinabox.js');
const table = document.getElementById('chinaTable');
const checkBoxes = table.getElementsByTagName("input");
const rows = table.rows;
///// preparing new AC box //////
const pre_digcode = parseInt(String(new Date().valueOf() + Math.floor(1000000000 + Math.random() * 9000000000)).substring(4, 11));
const charge_number = "AC" + pre_digcode;
const newACbox = new Object();
newACbox.box_number = charge_number;
////// main function /////////
function validation_request () {
    const requestArr = [];
    const promises = [];
    const accountIdArr = [];
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            const selectedbox = rows[i+1].cells[2].innerText;
            const selected_account_id = parseInt(rows[i+1].cells[1].id);
            requestArr.push(selectedbox);
            promises.push(archive(selectedbox));
            if (!accountIdArr.includes(selected_account_id)) {
                accountIdArr.push(selected_account_id)
            }
        }
    };
    if (!promises.length) {
        alert('No box is selected!')
    } else {
        newACbox.account_id = accountIdArr[0];
        newACbox.description = `${requestArr}`;
        newACbox.notes = document.getElementById('notes').value;
        promises.push(loading_xc(newACbox));
        Promise.all(promises).then(() => {
            location.reload();
        }).catch((e) => {console.log(e)})
        console.log(requestArr, accountIdArr);
    }
};
///// loading functions ///////
async function archive(box_number) {
    const response = await fetch(`/api/box/client_archive/${box_number}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        console.log(`${box_number} is temporarily archived!`)
      } else {
        alert('try again')
    }
};
async function loading_xc(data) {
    const response = await fetch('/api/box/delete_request', {
        method: 'post',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        console.log('delete box is placed successfully!')
      } else {
        alert('try again')
    }
};

function preCheckPage() {
    var requestArr = [];
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            const selectedItem = rows[i+1].cells[2].innerText;
            requestArr.push(`<div class="text-primary">${selectedItem}</div>`);
        }
    };
    if (!requestArr.length || requestArr.length > 15) {
        alert('删除请求限勾选量1-15之间，若超过15项，请分批请求')
    } else {
        const size = requestArr.length;
        requestArr = requestArr.join('');
        UIkit.modal.confirm(`<small class='text-primary' uk-tooltip="title: This page is a pre-check step before proceeding the confirmation. Please review your request order. If there is any input error, simply click “Cancel” and correct it. Otherwise, click “OK” to continue; pos: right">此页为检查页面，若发现输入/选择错误，请按“Cancel”并更改；若所有输入皆正确，请按“OK”完成通知</small><hr>
        <p class='mt-2'>删除物件(${size}件): ${requestArr}</p><hr><p>备注: ${document.getElementById('notes').value}</p>`).then(function () {
            validation_request ()
        }, function () {
            console.log('Rejected.')
        });
    }
}
