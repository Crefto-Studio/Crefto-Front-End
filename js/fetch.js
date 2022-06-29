
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

		headers: {
			Accept: 'application/json',
			"Content-type": "application/json; charset=UTF-8",
			//AllowAutoRedirect: false,
			//exposedHeaders: ["Set-Cookie"],
			//redirect: 'follow'		
		}
	})

		.then(res => {
			return res.json();
		})

		.then(json => {
			console.log(json);
			
			
			
			if (json.status == "success") {
				    document.cookie = "AuthTokenCookie=" + json.token + ";SameSite=Lax;path=/";
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
	fetch("http://www.api.crefto.studio/api/v1/users/logout")

		.then(response => response.json())

		.then(json => {
			console.log(json)
			if (json.status == "success") {
				//document.cookie = "AuthTokenCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
				document.cookie = "AuthTokenCookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
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
		console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
		document.getElementById('username').innerHTML = "Sign Up / Sign In";
	}
	
}

//send_feedback
function rate_func(){
	var five=document.getElementById('rating-5');
	var four=document.getElementById('rating-4');
	var three=document.getElementById('rating-3');
	var two=document.getElementById('rating-2');
	var one=document.getElementById('rating-1');

	if (five.checked) {
		rate_value = "like";
	  }
	else if(four.checked){
		rate_value = "like";
	}
	else if(three.checked){
		rate_value = "like";
	}
	else if (two.checked){
		rate_value = "dislike";
	  }
	else if(one.checked){
		rate_value = "dislike";
	}
	
	let token = document.cookie;
	token = token.split("=");

	fetch("http://www.api.crefto.studio/api/v1/users/sats", {
	   method: "POST",
	   body: JSON.stringify({
		   "type": rate_value,
		   "comment": document.getElementById('rate_comment').value,
	   }),
	   headers: {
		   "Content-type": "application/json; charset=UTF-8",	
		   Authorization: `Bearer ${token[1]}`	
	   }
   })

	   .then(res => {
		   return res.json();
	   })

	   .then(json => {
		   console.log(json);
		   if(json.status!="success"){
			document.getElementById('rate_comment').style.color="red";
			document.getElementById('rate_comment').value=json.message+"!!";
		   }
		   
	   })
}

window.onload=get_rate();
//get_feedback
function get_rate(){
	fetch("http://www.api.crefto.studio/api/v1/users/sats")

	.then(res=>{
		return res.json();
	})

	.then(json=>{
		var text="";
		console.log(json);
		document.getElementById('sats_users').innerHTML=json.satisfied;
		for(let i=0;i<3; i++){
			text+='<div class="testimonial-item bg-light rounded my-4">';
			text+='<p class="fs-5"><i class="fa fa-quote-left fa-4x text-primary mt-n4 me-3"></i>'+json.data.Satisfs[i].comment+'</p>';
			text+='<div class="d-flex align-items-center">';
			text+='<img class="img-fluid flex-shrink-0 rounded-circle" src="img/testimonial-1.jpg" style="width: 65px; height: 65px;">';
			text+='<div class="ps-4">';
			text+='<h5 class="mb-1">'+json.data.Satisfs[i].user.name+'</h5>';
			text+='</div>';
			text+='</div>';
			text+='</div>';
		}
		document.getElementById('all_sats').innerHTML=text;
	})
}











