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
	//document.getElementById("friends").style.display = "none";
	document.getElementById("posts").style.display = "none";
}

function display_info() {
	document.getElementById("about").style.display = "block";
	document.getElementById("photos").style.display = "none";
	//document.getElementById("friends").style.display = "none";
	document.getElementById("posts").style.display = "none";
}

/*
function display_friends() {
	document.getElementById("friends").style.display = "block";
	document.getElementById("about").style.display = "none";
	document.getElementById("photos").style.display = "none";
	document.getElementById("posts").style.display = "none";
}*/

function display_posts() {
	document.getElementById("posts").style.display = "block";
	document.getElementById("about").style.display = "none";
	document.getElementById("photos").style.display = "none";
	//document.getElementById("friends").style.display = "none";
}


//share photos in facebook
function fbs_click(element) {
	var TheImg = element.parentElement.parentElement.firstElementChild;
	u = TheImg.src;
	// t=document.title;
	t = TheImg.getAttribute('alt');
	window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(u) + '&t=' + encodeURIComponent(t), 'sharer', 'toolbar=0,status=0,width=626,height=436'); return false;
}

//side nav
let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
	arrow[i].addEventListener("click", (e) => {
		let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
		arrowParent.classList.toggle("showMenu");
	});
}

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
console.log(sidebarBtn);
sidebarBtn.addEventListener("click", () => {
	sidebar.classList.toggle("close");

});


//logout
function prof_out() {
	fetch("http://www.api.crefto.studio/api/v1/users/logout")

		.then(response => response.json())

		.then(json => {
			console.log(json)
			if (json.status == "success") {
				document.cookie = "AuthTokenCookie=; path=/E:/home2/new_home_page/digital-agency-html-template; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
				location.replace("../index.html");
				
			}

		})
}
