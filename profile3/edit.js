//load img from pc
window.addEventListener('load', function () {
  document.querySelector('input[type="file"]').addEventListener('change', function() {
      if (this.files && this.files[0]) {
          var img = document.querySelector('img');
          img.onload = () => {
              URL.revokeObjectURL(img.src);  // no longer needed, free memory
          }
          img.src = URL.createObjectURL(this.files[0]); // set src to blob url
         
      }
  });
});


//submit data changes
document.getElementById('submit').addEventListener('click', function () {
	post_info();
})

var formdata = new FormData();
document.getElementById("file_input").addEventListener('change', function () {
	formdata.delete('photo');
	formdata.append('photo', document.getElementById("file_input").files[0]);
})

document.getElementById("user_name").addEventListener('change', function () {
	formdata.delete('name');
	formdata.append("name", document.getElementById('user_name').value);
});
document.getElementById("user_bio").addEventListener('change', function () {
	formdata.delete('bio');
	formdata.append("bio", document.getElementById('user_bio').value);
});
document.getElementById('user_date').addEventListener('change', function () {
	formdata.delete('birthday');
	formdata.append('birthday', document.getElementById('user_date').value);
});
document.getElementById('user_pass').addEventListener('change', function () {
	formdata.delete('password');
	formdata.append('password', document.getElementById('user_pass').value);
});
document.getElementById('user_interest').addEventListener('change', function () {
	formdata.delete('interest');
	formdata.append('interest', document.getElementById('user_interest').value);
});
document.getElementById('user_mail').addEventListener('change', function () {
	formdata.delete('email');
	formdata.append('email', document.getElementById('user_mail').value);
});
document.getElementById('user_face').addEventListener('change', function () {
	formdata.delete('facrbook');
	formdata.append('facebook', document.getElementById('user_face').value);
});
document.getElementById('user_phone').addEventListener('change', function () {
	formdata.delete('phone');
	formdata.append('phone', document.getElementById('user_phone').value);
});
document.getElementById('user_gender').addEventListener('change', function () {
	formdata.delete('gender');
	formdata.append('gender', document.getElementById('user_gender').value);
});
document.getElementById('user_street').addEventListener('change', function () {
	formdata.delete('address');
	formdata.append('address', document.getElementById('user_street').value);
});

function post_info() {
	let token = document.cookie;
	token = token.split("=");
	var myHeaders = new Headers();
		
	myHeaders.append("Authorization", `Bearer ${token[1]}`);

	var requestOptions = {
		method: 'PATCH',
		headers: myHeaders,
		body: formdata,
		redirect: 'follow'
	};

	fetch("http://www.api.crefto.studio/api/v1/users/updateMe", requestOptions)
		.then(response => response.json())
		.then(json => {
			console.log(json);
			for (var value of formdata.values()) {
				console.log(value);
			}
			if (json.status == "success") {
				swal("Your information updated successfully ", {
					icon: "success",
				}).then(function () {
					window.location.href = "about.html";
				})
			}
			else {
				alert(json.message)
			}
		})
		.catch((err) => {
			alert("error! try again later")
			console.error(err);
		})
}


//show info 
window.onload = info();
function info() {
	let token = document.cookie;
	token = token.split("=");
	
	fetch("http://www.api.crefto.studio/api/v1/users/me", {
		headers: {
			Authorization: `Bearer ${token[1]}`
		}
	})
		.then(response => response.json())
		.then(json => {
			console.log(json);

			if (json.status == "success") {
				document.getElementById('user_img').src = "https://crefto.s3.eu-central-1.amazonaws.com/users/" + json.data.user.photo;
				if(json.data.user.bio == undefined){
					document.getElementById('user_bio').value="";	
				}
				else{
				document.getElementById('user_bio').value = json.data.user.bio;
				}
				document.getElementById('user_name').value = json.data.user.name;
				document.getElementById('user_date').value = json.data.user.birthday;
				document.getElementById('user_pass').value = "";
				document.getElementById('user_interest').value = json.data.user.interest;
				document.getElementById('user_mail').value = json.data.user.email;
				document.getElementById('user_face').value = json.data.user.facebook;
				document.getElementById('user_phone').value = json.data.user.phone;
				document.getElementById('user_gender').value = json.data.user.gender;
				document.getElementById('user_street').value = json.data.user.address;
			}
			else {
				alert(json.message);
			}
		})
	document.getElementById("chg_pass").style.display = "none";
}


//change password display
document.getElementById("change_pass").addEventListener('click', function () {
	var arr = [];
	 arr = document.querySelectorAll(".card-body2");
	for (let element of arr) {
		element.style.display = "none";
	}
	document.getElementById("chg_pass").style.display = "block";
	document.getElementById("hide").style.display = "none";
	document.getElementById("user_bio").disabled = true;
})


//change pass api
function change_pass() {
	var formpass = new FormData();
	let token = document.cookie;
	token = token.split("=");

	fetch("http://www.api.crefto.studio/api/v1/users/updateMyPassword", {

		method: "PATCH",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			Authorization: `Bearer ${token[1]}`,
		},

		body: JSON.stringify({
			"passwordCurrent": document.getElementById("current_pass").value,
			"password": document.getElementById("new_pass").value,
			"passwordConfirm": document.getElementById("confirm_pass").value
		}),
	})
		.then(response => response.json())	
		.then(json => {
			console.log(json);

			console.log("form", formdata);
			if (json.status == "success") {
				swal("Your information updated successfully ", {
					icon: "success",
				}).then(function () {
					window.location.href = "edit.html";
				})
			}
			else {
				alert(json.message)
			}
		})
		.catch((err) => {
			alert("error! try again later");
		})	
}


//cancel button
function cancel_func(id){
	if (id == "profile_cancel")
		location.href = "about.html";
	else
		location.href = "edit.html";
}