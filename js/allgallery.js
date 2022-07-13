
//toggle text in nav button
window.onload =toggle_text();
 function toggle_text() {	
	if (document.cookie.indexOf('AuthTokenCookie=') != -1) {
		//var user_id = localStorage.getItem('user_id');
		let token = document.cookie;
		token = token.split("=");
		fetch("http://www.api.crefto.studio/api/v1/users/me", {
			headers: {
				Authorization: `Bearer ${token[1]}`
			}
		})

			.then(response => response.json())

			.then(json => {
				console.log(json)
				if (json.status == "success") {
					document.getElementById('username').innerHTML = ' ' + json.data.user.name;
					document.getElementById('logout_btn').style.display = 'block';
				}
			})
	}
	else {
		console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
		document.getElementById('username').innerHTML = "Sign Up / Sign In";
	}
	
}



window.onload=dis_all_posts();
function dis_all_posts(){
    var text = "";
    fetch("http://www.api.crefto.studio/api/v1/posts")
		.then(response => response.json())
		.then(json => {
			console.log(json);
			if (json.status == "success") {
				for(let i=0;i<json.results;i++){
                   text+= '<div class="col-lg-4 col-md-6 portfolio-item second wow fadeInUp" data-wow-delay="0.5s">';
                   text+= '<div class="rounded overflow-hidden">';
                   text+= '<div class="position-relative overflow-hidden">';
                   text+= '<img class="img-fluid w-100" src="https://crefto.s3.eu-central-1.amazonaws.com/posts/'+ json.data.posts[i].postImg+'" alt="">';
                   text+= '<div class="portfolio-overlay">';
                   text+= '<a class="btn btn-square btn-outline-light mx-1" href="https://crefto.s3.eu-central-1.amazonaws.com/posts/'+json.data.posts[i].postImg +'" data-lightbox="portfolio"><i class="fa fa-eye"></i></a>';
                    text+='</div>';
                    text+='</div>';
                    text+= '<div class="bg-light p-4">';
                    text+= '<p class="text-primary fw-medium mb-2">'+json.data.posts[i].type+'</p>';
                    text+= '</div>';
                    text+='</div>';
                    text+= '</div>';
                }	
        document.getElementById('gal').innerHTML+=text;
              }
        })
}


var logged = 0;
//sign up
function upapi() {
	document.getElementById('alert').innerHTML = '';
	fetch("http://www.api.crefto.studio/api/v1/users/signup", {

		method: "POST",

		body: JSON.stringify({
			"name": document.getElementById('name').value,
			"email": document.getElementById('mail').value,
			"password": document.getElementById('pass').value,
			"passwordConfirm": document.getElementById('repass').value,
		}),

		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	})

		.then(response => response.json())

		.then(json => {
			console.log(json)
			if (json.status == "success") {
				document.getElementById('alert').innerHTML = '<div class="alert alert-success" role="alert">Successfully Registred</div >';
			}
			else {
				document.getElementById('alert').innerHTML = '<div class="alert alert-warning" role="alert">' + json.message + '</div >';
			}
		})
		.catch((err) => {
			document.getElementById('alert').innerHTML = '<div class="alert alert-warning" role="alert">' + json.message + '</div >';
			console.error(err);
		})
};


//login
function loginapi() {

	document.getElementById('logalert').innerHTML = '';
	 fetch("http://www.api.crefto.studio/api/v1/users/login", {

		method: "POST",

		credentials: "same-origin",
		//credentials: "include",

		body: JSON.stringify({
			"email": document.getElementById('logmail').value,
			"password": document.getElementById('logpass').value,
		}),

		headers: {
			Accept: 'application/json',
			"Content-type": "application/json; charset=UTF-8",	
		}
	})

		.then(res => {
			return res.json();
		})

		.then(json => {
			console.log(json);
			if (json.status == "success") {
				var t=json.token;
				console.log(t);
				    document.cookie = "AuthTokenCookie=" + t + ";SameSite=Lax;path=/";
					document.getElementById('logalert').innerHTML = '<div class="alert alert-success" role="alert"> Hello ' + json.data.user.name + '. Welcome at our website.</div >';
					document.getElementById('username').innerHTML = ' ' + json.data.user.name;
					document.getElementById('logout_btn').style.display = 'block';
					logged = 1;
			}
			else {
				document.getElementById('logalert').innerHTML = '<div class="alert alert-warning" role="alert">' + json.message + '</div >';
			}
		})
}


//logout
function logout() {
	let token = document.cookie;
	token = token.split("=");
	console.log("mmmmmm", token[1]);
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${token[1]}`);
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	  };
	fetch("http://www.api.crefto.studio/api/v1/users/logout",requestOptions)

		.then(response => response.json())

		.then(json => {
			console.log(json)
			if (json.status == "success") {
				//document.cookie = "AuthTokenCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
				document.cookie = "AuthTokenCookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
				document.getElementById('username').innerHTML = ' Sign UP / Log IN';
				document.getElementById('logout_btn').style.display = 'none';
				logged = 0;
			}
			
			})
}


//toggle bet sign popmenu and profile
var modal = document.getElementById("myModal");
var btn = document.getElementById("log_btn");
var span = document.getElementsByClassName("close")[0];
document.getElementById('log_btn').addEventListener('click', function () {
	if (document.cookie.indexOf('AuthTokenCookie=')!=-1) {
		window.location.href = "profile3/about.html";
	}
	else {
		modal.style.display = "block";
    }
})


//delet alert when close
span.onclick = function () {
	modal.style.display = "none";
	document.getElementById('alert').innerHTML = "";
	document.getElementById('logalert').innerHTML = "";
}


//clode sign popmenu when click outside
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}


