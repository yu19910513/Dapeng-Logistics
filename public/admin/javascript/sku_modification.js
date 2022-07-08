console.log("sku_modification.js");
const fake = document.getElementById('fake');
const uploadBtn = document.getElementById('uploadBtn');
const trigger = () => {
    const promises = [];
    const user_id = document.querySelector('select').value;
    const files = document.getElementById('label').files;
    if (user_id != 0 && files[0]) {
      uploadBtn.style.display = 'none';
      fake.style.display = '';
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        promises.push(upload(file, user_id))
      };
      Promise.all(promises).then(() => {
        fake.style.display = 'none';
        document.location.reload();
      }).catch((e) => {console.log(e)})
    } else {
        alert('missing client selection or missing file! please try again')
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
const init = () => {
  const timeArr = document.querySelectorAll('time');
  timeArr.forEach(time => {
    time.innerText = new Date(parseInt(time.innerText)).toLocaleDateString()
  });
  if (localStorage.getItem('withAuth')) {
    document.querySelectorAll('a').forEach(a => a.style.visibility = '');
  }
};
const remove = async (id) => {
  const response = await fetch(`/api/document/remove/${id}`, {
    method: 'DELETE'
  });
  if (response.ok) {
    location.reload();
  }
};
const withAuth = () => {
  const code = prompt('Enter passcode to activate delete function');
  if (code == '0523') {
    document.querySelectorAll('a').forEach(a => a.style.visibility = '');
    localStorage.setItem('withAuth', 'Authorized')
  } else {
    alert('Invalid code!')
  }
}
init();
