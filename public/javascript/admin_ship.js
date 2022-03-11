
function boxQuery() {
    fetch(`/api/user/box`, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
      console.log(data);
    });
};

boxQuery();
