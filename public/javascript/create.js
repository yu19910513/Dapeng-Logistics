//need to use fetch get to get account
// then use local storage
//use for loop to generate amount of table for amount of boxes
// generate asn and box number front end
// local storeage till confirm then post to server

var asn = "ASN"+String(new Date().valueOf()).substring(3, 13);
document.querySelector('#new_asn').setAttribute("value", asn);
localStorage.setItem('asn',asn);

const account = document.querySelector('#new_account');
const prefix = document.querySelector('#new_prefix');
const savedAccount = localStorage.getItem('account');
const savedPrefix = localStorage.getItem('prefix');
if (savedAccount != "Create New Account") {
    account.setAttribute('value', savedAccount);
    prefix.setAttribute('value', savedPrefix);
} else {
    account.disabled = false;
    prefix.disabled = false;
}



const box_number = 'SW' + savedPrefix + String(new Date().valueOf()).substring(6, 13)
console.log(box_number.replace(/\s/g, ''));
// function preConfirm() {

// };


// document.querySelector("#preconfirm").addEventListener("click", preConfirm);


// function boxNumberGenerator(number) {

// }

// const totalBox = document.querySelector().value.trim();
// boxNumberGenerator(totalBox)
// SW
