//var user = localStorage.getItem('user_id');

//get user api
//var url = "http://www.api.crefto.studio/api/v1/users/626271a83dc0985f40652947";
window.onload=info()
function info() {
	let token = document.cookie;
	token = token.split("=");
	console.log("mmmmmm", token[1]);
	fetch("http://www.api.crefto.studio/api/v1/users/me", {
		headers: {
			Authorization: `Bearer ${token[1]}`
		}
	})

		.then(response => response.json())

		.then(json => {
			console.log(json)
			if (json.status == "success") {
				//document.getElementById('name').innerHTML = json.data.user.name;
				var arr = document.querySelectorAll(".user_name");
				for (let item of arr) {
					item.innerHTML = json.data.user.name;
				}
				document.getElementById('user_image').src = ("http://www.api.crefto.studio/img/users/" + json.data.user.photo);
				document.getElementById('user_date').innerHTML = json.data.user.birthday;
				document.getElementById('user_gender').innerHTML = json.data.user.gender;
				document.getElementById('user_interest').innerHTML = json.data.user.interest;

				document.getElementById('user_phone').innerHTML = json.data.user.phone;
				document.getElementById('user_mail').innerHTML = json.data.user.email;
				document.getElementById('user_add').innerHTML = json.data.user.address;

				document.getElementById('user_face').innerHTML = json.data.user.facebook;


				document.getElementById('user_bio').innerHTML = json.data.user.bio;
				let text = json.data.user.address;
				var myArray = text.split(",");
				document.getElementById('user_country').innerHTML = myArray[myArray.length - 1];


			}
			else {
				alert(json.message);
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
