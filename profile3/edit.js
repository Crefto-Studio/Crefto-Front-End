//load img
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

//submit notification
document.getElementById('submit').addEventListener('click', function () {
	post_info();
    
})


//post info
function post_info() {
	let token = document.cookie;
	token = token.split("=");
	console.log("mmmmmm", token[1]);
	fetch("http://www.api.crefto.studio/api/v1/users/updateMe", {

		method: "PATCH",

		body: JSON.stringify({
			"photo": "http://www.api.crefto.studio/img/users/"+document.getElementById('user_img').src,
			"bio": document.getElementById('user_bio').value,
			"name": document.getElementById('user_name').value,
			"birthday": document.getElementById('user_date').value,
			"password": document.getElementById('user_pass').value,
			"interest": document.getElementById('user_interest').value,
			"email": document.getElementById('user_mail').value,
			"facebook": document.getElementById('user_face').value,
			"phone": document.getElementById('user_phone').value,
			"gender": document.getElementById('user_gender').value,
			"address": (document.getElementById('user_street').value + "," + document.getElementById('user_city').value + "," + document.getElementById('user_state').value + "," + document.getElementById('user_country').value),
		}),

		// Adding headers to the request
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			Authorization: `Bearer ${token[1]}`,
		}
	})

		// Converting to JSON
		.then(response => response.json())

		// Displaying results to console
		.then(json => {
			console.log(json)
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
};


//show info 
window.onload = info();
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
				document.getElementById('user_img').src = "http://www.api.crefto.studio/img/users/" + json.data.user.photo;
				document.getElementById('user_bio').value = json.data.user.bio;
				document.getElementById('user_name').value = json.data.user.name;
				document.getElementById('user_date').value = json.data.user.birthday;
				document.getElementById('user_pass').value = "";
				document.getElementById('user_interest').value = json.data.user.interest;
				document.getElementById('user_mail').value = json.data.user.email;
				document.getElementById('user_face').value = json.data.user.facebook;
				document.getElementById('user_phone').value = json.data.user.phone;
				document.getElementById('user_gender').value = json.data.user.gender;
				var add = json.data.user.address;
				add = add.split(",");
				document.getElementById('user_street').value = add[0];
				document.getElementById('user_city').value = add[1];
				document.getElementById('user_state').value = add[2];
				document.getElementById('user_country').value = add[3];

			}
			else {
				alert(json.message);
			}
		})
}


