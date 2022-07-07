console.log("sku_modification.js");
const trigger = () => {
    const promises = [];
    const user_id = document.querySelector('select').value;
    const files = document.getElementById('label').files;
    if (user_id != 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            promises.push(upload(file, user_id))
        };
        Promise.all(promises).then(() => {
            document.location.reload();
        }).catch((e) => {console.log(e)})
    } else {
        alert('please choose a client first')
    }
};
async function upload(file, id) {
    const ref = file.name.split('.')[0].toUpperCase().trim();
    let formData = new FormData();
    formData.append('file', file);
    formData.append('ref',ref);
    formData.append('user_id', id);
    const response = await fetch(`/api/document/upload`, {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      console.log(ref);
    } else {
      alert(response.statusText);
    }
};
