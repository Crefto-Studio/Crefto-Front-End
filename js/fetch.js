
//document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC";


var logged = 0;
//sign up
function upapi() {
	document.getElementById('alert').innerHTML = '';
	fetch("http://www.api.crefto.studio/api/v1/users/signup", {

		// Adding method type
		method: "POST",

		// Adding body or contents to send
		body: JSON.stringify({
			"name": document.getElementById('name').value,
			"email": document.getElementById('mail').value,
			"password": document.getElementById('pass').value,
			"passwordConfirm": document.getElementById('repass').value,
			//"phone": document.getElementById('phone').value,
			//"data_of_birth": document.getElementById('date').value,
		}),

		// Adding headers to the request
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	})

		// Converting to JSON
		.then(response => response.json())

		// Displaying results to console
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

		// Adding headers to the request
		headers: {
			Accept: 'application/json',
			"Content-type": "application/json; charset=UTF-8",
			AllowAutoRedirect: false,
			//exposedHeaders: ["Set-Cookie"],
			//redirect: 'follow'
			
			
				
		}
	})

		.then(res => {
			
			
			//console.log(res.headers);
		//	var headers = res.getResponseHeaders('Set-Cookie');
			//alert(headers);
           //  console.log(res.headers);
				//console.log(res.headers.get('AuthTokenCookie'));
			//console.log(res.headers.Authorization); // undefined
			//console.log(res.getResponse().headers['X-Frame-Options']);
			//console.log(document.cookie); // nope
			return res.json();
		})

		.then(json => {
			console.log(json);
			
			document.cookie = "AuthTokenCookie=" + json.token + ";SameSite=Lax";
			
			//var Cookies = window.Cookies;
			//window.Cookies.set({ "mno": "munira"});
			//var xxx = window.Cookies.get();
			//console.log(xxx);
			//Cookies.set('foo', 'bar')
			
			if (json.status == "success") {
					document.getElementById('logalert').innerHTML = '<div class="alert alert-success" role="alert"> Hello ' + json.data.user.name + '. Welcome at our website.</div >';
					document.getElementById('username').innerHTML = ' ' + json.data.user.name;
					//document.getElementById('log-responsive').innerHTML = json.data.user.name;
					//document.getElementById('log_btn').classList.remove('rounded-pill');
					document.getElementById('logout_btn').style.display = 'block';
					logged = 1;
				   // localStorage.setItem('user_id', json.data.user._id);
			}
			else {
				document.getElementById('logalert').innerHTML = '<div class="alert alert-warning" role="alert">' + json.message + '</div >';
			}
		})
}

//logout
function logout() {
	fetch("http://www.api.crefto.studio/api/v1/users/logout")

		.then(response => response.json())

		.then(json => {
			console.log(json)
			if (json.status == "success") {
				document.cookie = "AuthTokenCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
				document.getElementById('username').innerHTML = ' Sign UP / Log IN';
				document.getElementById('logout_btn').style.display = 'none';
				//document.getElementById('log_btn').classList.add('rounded-pill');
				logged = 0;
				//localStorage.removeItem('user_id')
				//localStorage.setItem("user_id", null);
				
			}
			
			})
}

var modal = document.getElementById("myModal");
var btn = document.getElementById("log_btn");
var span = document.getElementsByClassName("close")[0];
document.getElementById('log_btn').addEventListener('click', function () {
	if (document.cookie.indexOf('AuthTokenCookie=')!=-1) {
		console.log("mm");
		window.location.href = "profile3/about.html";
	}
	else {
		console.log("no");
		modal.style.display = "block";
    }
})

span.onclick = function () {
	modal.style.display = "none";
	console.log("mai");
	document.getElementById('alert').innerHTML = "";
	document.getElementById('logalert').innerHTML = "";
}

window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

function close() {
	document.getElementById("myCollapse").style.display == "none";
}




//registerd users count
function regisre_users() {
	fetch("http://www.api.crefto.studio/api/v1/users")

		.then(response => response.json())

		.then(json => {
			console.log(json)
			if (json.status == "success") {
				document.getElementById('reg_users').innerHTML = json.results;
			}
		})
}
//call it
window.onload = regisre_users();


//images count
function images() {
	fetch("http://www.api.crefto.studio/api/v1/posts")

		.then(response => response.json())

		.then(json => {
			console.log(json)
			if (json.status == "success") {
				document.getElementById('images').innerHTML = json.results;
			}
		})
}
//call it
window.onload = images();




window.onload = function () {
	
	
	if (document.cookie.indexOf('AuthTokenCookie=') != -1) {
		//var user_id = localStorage.getItem('user_id');
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
					document.getElementById('username').innerHTML = ' ' + json.data.user.name;
					document.getElementById('logout_btn').style.display = 'block';
				}
			})

		
	}
	else {
	
		document.getElementById('username').innerHTML = "Sign Up / Sign In";
	}
	
}








