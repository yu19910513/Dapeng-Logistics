//need to use fetch get to get account
// then use local storage
//use for loop to generate amount of table for amount of boxes
// generate asn and box number front end
// local storeage till confirm then post to server

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yy = String(today.getFullYear() - 2000);
var hr = String(today.getHours());
var min = String(today.getMinutes());
today = mm + dd + yy + hr + min;
code = "ASN"+today;
document.querySelector('#new_asn').setAttribute("value", code);
