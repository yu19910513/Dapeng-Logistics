console.log('delete_queue_admin.js');
const aTagArr = document.querySelectorAll('tbody a');
const table = document.querySelector('table');
const rows = table.rows;
for (let i = 1; i < rows.length; i++) {
    const china_or_amazon = rows[i].cells[0].getAttribute('class');
    const box_number = rows[i].cells[1].innerText;
    const requested_items = aTagArr[i-1].innerText;
    const amazon_or_sku = requested_items.substring(0,2);
    if (china_or_amazon == 'text-danger') {
        const chinaAPI = `${box_number}&${requested_items.split(',').join('-x-')}`
        aTagArr[i-1].href = `/dq_chinabox_admin/${chinaAPI}`
    } else if (amazon_or_sku == 'AM' && !alphaChecker(requested_items)){
        const amazonAPI = `${box_number}&${requested_items.split(',').join('-x-')}`
        aTagArr[i-1].href = `/dq_container_admin/${amazonAPI}`
    } else {
        const skuAPI = `${box_number}&${requested_items.split(',').join('-x-')}`
        aTagArr[i-1].href = `/dq_sku_admin/${skuAPI}`
    }
};
function alphaChecker(string) {
    string = string.split(',');
    return (/[a-zA-Z]/).test(string[0].substring(2,string[0].length))
}
