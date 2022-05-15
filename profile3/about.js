//var user = localStorage.getItem('user_id');

//get user api
//var url = "http://www.api.crefto.studio/api/v1/users/626271a83dc0985f40652947";
window.onload=info()
function info() {
	let token = document.cookie;
	token = token.split("=");
	//console.log("mmmmmm", token[1]);
	fetch("http://www.api.crefto.studio/api/v1/users/me", {
		headers: {
			Authorization: `Bearer ${token[1]}`,
			
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
				//let text = json.data.user.address;
				//var myArray = text.split(",");
				//document.getElementById('user_country').innerHTML = myArray[myArray.length - 1];


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
function toggle_bar(btn) {
	let sidebarBtn = document.getElementById(btn);
	console.log(sidebarBtn);
		sidebar.classList.toggle("close");

}


//logout
function prof_out() {
	fetch("http://www.api.crefto.studio/api/v1/users/logout")

		.then(response => response.json())

		.then(json => {
			console.log(json)
			if (json.status == "success") {
				document.cookie = "AuthTokenCookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
				
				location.replace("../index.html");
				
				
			}

		})
}


//likes
function like(element) {
	var btn = element.firstElementChild;
	//btn.style.color = "blue";
	btn.classList.toggle("blue-like");

}


//my gallery
window.onload = display_gallery();
function display_gallery() {
	let token = document.cookie;
	token = token.split("=");
	//console.log("mmmmmm", token[1]);
	fetch("http://www.api.crefto.studio/api/v1/posts/getMyPosts", {

		headers: {
			Authorization: `Bearer ${token[1]}`
		},
		//credentials: "same-origin",
	})

		.then(response => response.json())

		.then(json => {
			console.log(json);
			var num = json.data.length;
			var text = "";
			var arr = [];
			arr[0] = json.data[num-1];
		//	arr[1] = json.data[num-2];
			arr.forEach(function (elem) {
				
				text += "<div class=\"col-lg-4 col-md-6 portfolio-item first wow fadeInUp\" data-wow-delay=\"0.1s\">";
				text += "<div class=\"rounded overflow-hidden\" >";
				text += "<div class=\"position-relative overflow-hidden\" id=\"parent\">";
				text += "<img class=\"img-fluid w-100\" src=\"http://www.api.crefto.studio/img/posts/" + elem.postImg+" alt =\"\">";
				text += "<div class=\"portfolio-overlay\" id=\""+elem._id+"\">";
				text += "<a class=\"btn btn-square btn-outline-light mx-1\" href=\"img/portfolio-1.jpg\" data-lightbox=\"portfolio\"><i class=\"fa fa-eye\"></i></a>";
				text += "<a class=\"btn btn-square btn-outline-light mx-1\" href=\"\" onclick=\"fbs_click(this)\"><i class=\"fa fa-link\"></i></a>";
				text += "<a class=\"btn btn-square btn-outline-light mx-1\" href=\"#\" onclick=\"del_post(this)\"><i class=\"far fa-trash-alt \"></i></a>";
				text += "</div>";
				text += "</div>";
				text += "<div class=\"bg-light p-4\">";
				text += "<p class=\"text-primary fw-medium mb-2\">UI / UX Design</p>";
				text += "</div>";
				text += "</div>";
				text += "</div>";
				
				console.log(elem.postImg);
			});
			document.getElementById("gallery").innerHTML = text;

			})

	
}

//delete post


function del_post(elem) {
		var post_id = elem.parentElement.id;
		var url = "http://www.api.crefto.studio/api/v1/posts/" + post_id;
		let token = document.cookie;
		token = token.split("=");
		fetch(url, {
			headers: {
				Authorization: `Bearer ${token[1]}`,

			},
			method: "DELETE",
		}).then(response => {
			document.getElementById('id01').style.display = 'block';
			return response.json()
		})
			.then(json => {
				
				console.log("33333333333333333333333333333333", json);
				if (json.status == "fail") {
					document.getElementById("msg_del").innerHTML = json.message;
				}
				else {
					document.getElementById("msg_del").innerHTML = "sucessfully deleted";
				}
			}
			)
	
	
		

}


//display all posts
window.onload = dis_posts();
var count = 0;
function dis_posts() {
	var text = "";
	var desc;
	var max;
	var img;
	var post_id;
	fetch("http://www.api.crefto.studio/api/v1/posts")
		.then(response => response.json())
		.then(json => {
			console.log(json);
			if (json.status == "success") {
				var arr = [];
				
				arr[0] = json.data.posts[json.data.posts.length - 1];
				arr[1] = json.data.posts[json.data.posts.length - 2];
				arr[2] = json.data.posts[json.data.posts.length - 3];
				
			//	max = json.results;
				max = 3;

				text += "<div class=\"timeline-body\">";
				text += "<div class=\"timeline-header\">";
				//arr[count] = json.data.posts[count];
				arr[count].user._id;
				desc = arr[count].description;
				img = arr[count].postImg;
				post_id = arr[count]._id;
					
					return fetch("http://www.api.crefto.studio/api/v1/users/" + arr[count].user._id);
					
				
			}
			
		}).then(response => response.json())
		.then(json => {
			console.log(json);
			console.log(json.data.user.name);
			
			text += "<span class=\"userimage\"><img src=\"http://www.api.crefto.studio/img/users/" + json.data.user.photo  +"\"></span>";
			text += "<span class=\"username\">" + json.data.user.name + "</span>";
			text += "</div>";
			text += "<div class=\"timeline-content\">";
			text += "<p>" + desc + "</p>";
			text += "<p class=\"m-t-20\">";
			text += "<img src=\"http://www.api.crefto.studio/img/posts/\"" + img + "alt=\"\">";
			text += "</p>";
			text += "</div>";
			text += "<div class=\"timeline-footer\" id=\"" + post_id + ">";
			text += "<a href=\"javascript:;\" class=\"m-r-15 text-inverse-lighter\"><i class=\"fa fa-heart fa-fw fa-lg m-r-3\"></i>Fav </a>";
			text += "<a href=\"javascript:;\" class=\"m-r-15 text-inverse-lighter\" onclick=\"like(this)\"><i class=\"fa fa-thumbs-up fa-fw fa-lg m-r-3\"></i> Like</a>";
			text += "<a href=\"javascript:;\" class=\"m-r-15 text-inverse-lighter\"><i class=\"fa fa-comments fa-fw fa-lg m-r-3\"></i> Comment</a>";
			text += "</div>";
			text += "<div class=\"timeline-comment-box\">";
			text += "<div class=\"user\"><img src=\"https://bootdey.com/img/Content/avatar/avatar7.png\"></div>";
			text += "<div class=\"input\">";
			text += "<form action=\"\">";
			text += "<div class=\"input-group\">";
			text += "<input type=\"text\" class=\"form-control rounded-corner\" placeholder=\"Write a comment...\">";
			text += "<span class=\"input-group-btn p-l-10\">";
			text += "<button class=\"btn btn-primary f-s-12 rounded-corner\" type=\"button\">Comment</button>";
			text += "</span>";
			text += "</div>";
			text += "</form>";
			text += "</div>";
			text += "</div>";
			text += "</div>";
			document.getElementById("wall").innerHTML += text;
			console.log("################################");
			count++;
			if (count < max) {
				dis_posts();
			}
			else {
				console.log("noooooooooooooooooooooooooooooo");
            }
		})
}

/*
var user_photo = "";
//posts
window.onload = dis_posts();
function dis_posts() {
	var text = "";
	
	fetch("http://www.api.crefto.studio/api/v1/posts")

		.then(response => response.json())

		.then(json => {
			console.log(json);
			
			if (json.status == "success") {
				var arr = [];
				arr[0] = json.data.posts[json.data.posts.length - 1];
				arr[1] = json.data.posts[json.data.posts.length - 2];
				arr.forEach(function (elem) {
					console.log(elem.postImg);
					console.log(elem.user.name);
					
					
					text += "<div class=\"timeline-body\">";
					text += "<div class=\"timeline-header\">";
					/*
					var url = "http://www.api.crefto.studio/api/v1/users/" + "626271a83dc0985f40652947";


					user_photo=fetch(url)
						.then(response => response.json())
					.then(function (json) {
							console.log(json);
							if (json.status == "success") {
								//globalThis.user_photo = json.data.user.photo;
								user_photo = json.data.user.photo;
							}
							console.log(user_photo);
							return json.data.user.photo
                        })

					const printAddress = async () => {
						const a = await user_photo;
						console.log("aaaaaaaaaaaaaaa", a);
						user_photo = a;
					};
					printAddress();
							console.log("#############################" + user_photo + "!!!!!!!");


					//text += "<span class=\"userimage\"><img src=\"http://www.api.crefto.studio/img/users/" + user_photo + "\"  alt=\"\"></span>";
					//text += "<span class=\"userimage\"><img src=\"http://www.api.crefto.studio/img/users/user-626271a83dc0985f40652947-1650619152697.jpeg" + "\"  alt=\"\"></span>";
					text += "<span class=\"userimage\"><img src=\"" + "\"  alt=\"\" id=\"user_foo\"></span>";
					text += "<span class=\"usernamme\" id=\""+elem.user._id+"\">" + elem.user.name + "</span>";
					text += "</div>";
					text += "<div class=\"timeline-content\">";
					text += "<p>" + elem.description + "</p>";
					text += "<p class=\"m-t-20\">";
					text += "<img src=\"http://www.api.crefto.studio/img/posts/\"" + elem.postImg + "alt=\"\">";
					text += "</p>";
					text += "</div>";
					text += "<div class=\"timeline-footer\" id=\"" + elem._id + ">";
					text += "<a href=\"javascript:;\" class=\"m-r-15 text-inverse-lighter\"><i class=\"fa fa-heart fa-fw fa-lg m-r-3\"></i>Fav </a>";
					text += "<a href=\"javascript:;\" class=\"m-r-15 text-inverse-lighter\" onclick=\"like(this)\"><i class=\"fa fa-thumbs-up fa-fw fa-lg m-r-3\"></i> Like</a>";
					text += "<a href=\"javascript:;\" class=\"m-r-15 text-inverse-lighter\"><i class=\"fa fa-comments fa-fw fa-lg m-r-3\"></i> Comment</a>";
					text += "</div>";
					text += "<div class=\"timeline-comment-box\">";
					text += "<div class=\"user\"><img src=\"https://bootdey.com/img/Content/avatar/avatar7.png\"></div>";
					text += "<div class=\"input\">";
					text += "<form action=\"\">";
					text += "<div class=\"input-group\">";
					text += "<input type=\"text\" class=\"form-control rounded-corner\" placeholder=\"Write a comment...\">";
					text += "<span class=\"input-group-btn p-l-10\">";
					text += "<button class=\"btn btn-primary f-s-12 rounded-corner\" type=\"button\">Comment</button>";
					text += "</span>";
					text += "</div>";
					text += "</form>";
					text += "</div>";
					text += "</div>";
					text += "</div>";
					
					
				});
				document.getElementById("wall").innerHTML = text;
			}
		})
}

*/

