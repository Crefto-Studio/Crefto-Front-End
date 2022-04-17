var user = localStorage.getItem('user_id');

//get user api
var url = "http://www.api.crefto.studio/api/v1/users/" + user;
fetch(url)

	.then(response => response.json())

	.then(json => {
		console.log(json)
		if (json.status == "success") {
			//document.getElementById('name').innerHTML = json.data.user.name;
			var arr = document.querySelectorAll(".user_name");
			for (let item of arr) {
				item.innerHTML = json.data.user.name;
            }
			document.getElementById('user_image').src = "http://www.api.crefto.studio/img/users/"+json.data.user.photo;
			document.getElementById('user_mail').innerHTML = json.data.user.email;
		}
	})
