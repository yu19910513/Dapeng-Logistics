//need to use fetch get to get account
// then use local storage
//use for loop to generate amount of table for amount of boxes
// generate asn and box number front end
// local storeage till confirm then post to server

var asn = "ASN"+String(new Date().valueOf()).substring(3, 13);
document.querySelector('#new_asn').setAttribute("value", asn);
localStorage.setItem('asn',asn);

const account = document.querySelector('#new_account');
const savedAccount = localStorage.getItem('account');
if (savedAccount != "none of the above") {
    account.setAttribute('value', savedAccount);
};
