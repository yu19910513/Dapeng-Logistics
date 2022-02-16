async function loginFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (email && password) {
      const response = await fetch('/api/user/login', {
        method: 'post',
        body: JSON.stringify({
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      }); console.log("email: "+ email + ' w/ password: ' + password);

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert("failed to log in! please try again with correct login info!");
      }
    }
  }
