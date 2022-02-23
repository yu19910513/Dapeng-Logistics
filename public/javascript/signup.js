async function signupFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    const name = document.querySelector('#name-signup').value.trim();
    const wechat = document.querySelector('#wechat-signup').value.trim();
    const adminCode = document.querySelector('#admin-signup').value.trim();
    var admin = false;

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
        document.location.replace('/');
      } else {
        alert('try again')
      }
    }
}

(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
        event.preventDefault();
        signupFormHandler(event)
      }, false);
    });
  }, false);
})();
