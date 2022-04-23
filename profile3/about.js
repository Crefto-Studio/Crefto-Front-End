var user = localStorage.getItem('user_id');

//get user api
var url = "http://www.api.crefto.studio/api/v1/users/" + user;
window.onload=info()
function info() {
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
				document.getElementById('user_image').src = "http://www.api.crefto.studio/img/users/" + json.data.user.photo;
				document.getElementById('user_mail').innerHTML = json.data.user.email;
			}
		})
}

//toggle between menus
function display_photos() {
	document.getElementById("about").style.display = "none";
	document.getElementById("photos").style.display = "block";
	document.getElementById("friends").style.display = "none";
	document.getElementById("posts").style.display = "none";
}

function display_info() {
	document.getElementById("about").style.display = "block";
	document.getElementById("photos").style.display = "none";
	document.getElementById("friends").style.display = "none";
	document.getElementById("posts").style.display = "none";
}

function display_friends() {
	document.getElementById("friends").style.display = "block";
	document.getElementById("about").style.display = "none";
	document.getElementById("photos").style.display = "none";
	document.getElementById("posts").style.display = "none";
}

function display_posts() {
	document.getElementById("posts").style.display = "block";
	document.getElementById("about").style.display = "none";
	document.getElementById("photos").style.display = "none";
	document.getElementById("friends").style.display = "none";
}
