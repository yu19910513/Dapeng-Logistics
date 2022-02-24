
function accountList() {
    fetch(`/api/user/account`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        for (let i = 0; i < data.length; i++) {
            const option = document.createElement('option');
            option.innerHTML = data[i].name;
            document.querySelector('#accountList').appendChild(option);
        }
    });

};
accountList();

function saveAccount() {
    var selectedOption = document.querySelector('#accountList').value.trim();
    localStorage.setItem('account', selectedOption);
}

document.querySelector("#account_selection").addEventListener("click", saveAccount);
