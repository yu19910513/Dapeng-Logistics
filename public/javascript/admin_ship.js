function pre_ship_scan(s3) {
    localStorage.setItem('pre-ship_item', s3);
    window.location.href = '/admin_pre_ship';
};
info(3);info(2);
async function info(n) {
    const response = await
    fetch(`/api/item/statusTWO/${n}`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
       if (n == 3) {
        document.getElementById('aConfirm').innerHTML = data.length;
       } else if (n == 2) {
        document.getElementById('aRequest').innerHTML = data.length
       }
    });
};
