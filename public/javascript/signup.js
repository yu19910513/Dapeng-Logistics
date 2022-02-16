async function signupFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    const name = document.querySelector('#name-signup').value.trim();
    const adminCode = document.querySelector('#admin-signup').vaule.trim();
    var admin = false

    if (adminCode == "tempadmin") {
        return admin = true
    };

    if (email && password && name) {
      const response = await fetch('/api/user', {
        method: 'post',
        body: JSON.stringify({
          name,
          email,
          password,
          admin
        }),
        headers: { 'Content-Type': 'application/json' }
      }); console.log(email, password, name, admin);

      // check the response status
      if (response.ok) {
        console.log('success');
        document.location.replace('/dashboard');
      } else {
        alert('try again')
      }
    }
}
