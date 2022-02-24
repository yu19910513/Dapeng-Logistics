
function accountList() {
    fetch(`/api/user/account`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        for (let i = 0; i < data.length; i++) {
            const option = document.createElement('option');
            option.innerHTML = data[i].name + " (prefix: "+ data[i].prefix + ")";
            document.querySelector('#accountList').appendChild(option);
        }
    });

};
accountList();

function saveAccount() {
    var selectedOption = document.querySelector('#accountList').value;
    if(selectedOption != 'Create New Account'){
        var accountSaved = selectedOption.split(' (prefix:');
        var prefixSaved = accountSaved[1].split(')');
        console.log(prefixSaved);
        localStorage.setItem('account', accountSaved[0]);
        localStorage.setItem('prefix', prefixSaved[0])
    } else {
        localStorage.setItem('account', selectedOption);
    }
}

document.querySelector("#account_selection").addEventListener("click", saveAccount);
