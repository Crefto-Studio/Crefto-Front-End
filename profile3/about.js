
//get user api:display user info
var userphoto;
var userid;
window.onload=info()
function info() {
	// let token = document.cookie;
	// token = token.split("=");
	let token = document.cookie;
	token = token.split(";");
	//console.log("token:",token);
	var c;
	for (let elem of token) {	
		c = elem.split("=");
	}
	//console.log(c);
	var index;
	for ( let i = 0; i < c.length; i++) {
		if (c[i] == "AuthTokenCookie"||c[i] == " AuthTokenCookie") {
			//console.log("mno", i);
			index = i;
        }
	}
	index = index + 1;

	fetch("http://www.api.crefto.studio/api/v1/users/me", {
		headers: {
			Authorization: `Bearer ${c[index]}`,
		}
	})
		.then(response => response.json())
		.then(json => {
			console.log(json)
			
			if (json.status == "success") {
				userid=json.data.user._id;
				userphoto=json.data.user.photo;
				var arr = document.querySelectorAll(".user_name");
				for (let item of arr) {
					item.innerHTML = json.data.user.name;
				}
				document.getElementById('user_image').src = ("https://crefto.s3.eu-central-1.amazonaws.com/users/" + json.data.user.photo);
				document.getElementById('user_date').innerHTML = json.data.user.birthday;
				document.getElementById('user_gender').innerHTML = json.data.user.gender;
				document.getElementById('user_interest').innerHTML = json.data.user.interest;
				document.getElementById('user_bio').innerHTML = json.data.user.bio;
				document.getElementById('user_phone').innerHTML = json.data.user.phone;
				document.getElementById('user_mail').innerHTML = json.data.user.email;
				document.getElementById('user_add').innerHTML = json.data.user.address;
				document.getElementById('user_face').innerHTML = json.data.user.facebook;
			}
			else {
				alert(json.message);
            }
		})

		dis_posts();
}


//toggle between menus
function display_photos() {
	document.getElementById("about").style.display = "none";
	document.getElementById("photos").style.display = "block";
	document.getElementById("posts").style.display = "none";

	display_gallery();
}

function display_info() {
	document.getElementById("about").style.display = "block";
	document.getElementById("photos").style.display = "none";
	document.getElementById("posts").style.display = "none";
}

function display_posts() {
	document.getElementById("posts").style.display = "block";
	document.getElementById("about").style.display = "none";
	document.getElementById("photos").style.display = "none";
}


//share photos in facebook
function fbs_click(element) {
	var TheImg = element.parentElement.parentElement.firstElementChild;
	u = TheImg.src;
	t = TheImg.getAttribute('alt');
	window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(u) + '&t=' + encodeURIComponent(t), 'sharer', 'toolbar=0,status=0,width=626,height=436'); return false;
}

//share in whatsapp
function whts_click(element){
	var TheImg = element.parentElement.parentElement.firstElementChild;
	let imageURL= TheImg.src;
element.setAttribute('href', 'whatsapp://send?text='+encodeURIComponent(imageURL));
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
		sidebar.classList.toggle("close");
		if(sidebar.classList.contains('close')){
			document.getElementById("posts_btn").style.marginLeft="-2rem";
			document.getElementById("about_btn").style.marginLeft="-1rem";
			document.getElementById("photo_btn").style.marginLeft="-3rem";

		} else{
			document.getElementById("posts_btn").style.marginLeft="-2rem";
			document.getElementById("about_btn").style.marginLeft="-1rem";
			document.getElementById("photo_btn").style.marginLeft="-2.9rem";
		}
}


//logout
function prof_out() {
	// let token = document.cookie;
	// token = token.split("=");
	// console.log("mmmmmm", token[1]);
	let token = document.cookie;
	token = token.split(";");
	//console.log("token:",token);
	var c;
	for (let elem of token) {	
		c = elem.split("=");
	}
	//console.log(c);
	var index;
	for ( let i = 0; i < c.length; i++) {
		if (c[i] == "AuthTokenCookie"||c[i] == " AuthTokenCookie") {
			//console.log("mno", i);
			index = i;
        }
	}
	index = index + 1;
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${c[index]}`);
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
				document.cookie = "AuthTokenCookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
				location.replace("../index.html");
			}
		})
}


//likes
function like(element) {
	//change color
	var btn = element.firstElementChild;
	btn.classList.toggle("blue-like");

	//api
	// let token = document.cookie;
	// token = token.split("=");
	let token = document.cookie;
	token = token.split(";");
	//console.log("token:",token);
	var c;
	for (let elem of token) {	
		c = elem.split("=");
	}
	//console.log(c);
	var index;
	for ( let i = 0; i < c.length; i++) {
		if (c[i] == "AuthTokenCookie"||c[i] == " AuthTokenCookie") {
			//console.log("mno", i);
			index = i;
        }
	}
	index = index + 1;

	var my_id = element.parentElement.id;

	var url = "http://www.api.crefto.studio/api/v1/posts/" + my_id + "/like"
	fetch(url, {
		method:"PUT",
		headers: {
			Authorization: `Bearer ${c[index]}`
		},
		credentials: "same-origin",
	})
		.then(response => response.json())
		.then(json => {
			console.log(json);
			btn.nextSibling.innerHTML=json.likes;
		})
}


//my gallery
function display_gallery() {
	var text="";
	// let token = document.cookie;
	// token = token.split("=");
	let token = document.cookie;
	token = token.split(";");
	//console.log("token:",token);
	var c;
	for (let elem of token) {	
		c = elem.split("=");
	}
	//console.log(c);
	var index;
	for ( let i = 0; i < c.length; i++) {
		if (c[i] == "AuthTokenCookie"||c[i] == " AuthTokenCookie") {
			//console.log("mno", i);
			index = i;
        }
	}
	index = index + 1;

	fetch("http://www.api.crefto.studio/api/v1/posts/getMyPosts", {
		headers: {
			Authorization: `Bearer ${c[index]}`
		},
	})
		.then(response => response.json())
		.then(json => {
			console.log(json);
			json.data.forEach(function (elem) {	
				text += "<div class=\"col-lg-4 col-md-6 portfolio-item first wow fadeInUp\" data-wow-delay=\"0.1s\">";
				text += "<div class=\"rounded overflow-hidden\" >";
				text += "<div class=\"position-relative overflow-hidden\" id=\"parent\">";
				text += "<img class=\"img-fluid w-100\" src=\"https://crefto.s3.eu-central-1.amazonaws.com/posts/" + elem.postImg+ "\">";
				text += "<div class=\"portfolio-overlay\" id=\""+elem._id+"\">";
				text += "<a class=\"btn btn-square btn-outline-light mx-1\" href=\"https://crefto.s3.eu-central-1.amazonaws.com/posts/"+elem.postImg+"\" data-lightbox=\"portfolio\"><i class=\"fa fa-eye\"></i></a>";
				text += "<a class=\"btn btn-square btn-outline-light mx-1\" href=\"\" onclick=\"fbs_click(this)\"><i class=\"fab fa-facebook-f\"></i></a>";
				text += "<a class=\"btn btn-square btn-outline-light mx-1\" href=\"\" onclick=\"whts_click(this)\"><i class=\"fa fa-whatsapp\" aria-hidden=\"true\"></i></a>";
				text += "<a class=\"btn btn-square btn-outline-light mx-1\" href=\"#\" onclick=\"del_post(this)\"><i class=\"far fa-trash-alt \"></i></a>";
				text += "</div>";
				text += "</div>";
				text += "<div class=\"p-4\">";
				text += "<p class=\"text-primary fw-medium mb-2\">"+elem.name+"</p>";
				text += "</div>";
				text += "</div>";
				text += "</div>";
			});
			document.getElementById("gallery").innerHTML = text;
			})
}


//delete post
function del_post(elem) {
	var post_id = elem.parentElement.id;
		var url = "http://www.api.crefto.studio/api/v1/posts/" + post_id;
		// let token = document.cookie;
		// token = token.split("=");
		let token = document.cookie;
	token = token.split(";");
	//console.log("token:",token);
	var c;
	for (let elem of token) {	
		c = elem.split("=");
	}
	//console.log(c);
	var index;
	for ( let i = 0; i < c.length; i++) {
		if (c[i] == "AuthTokenCookie"||c[i] == " AuthTokenCookie") {
			//console.log("mno", i);
			index = i;
        }
	}
	index = index + 1;

	var myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${c[index]}`);

var requestOptions = {
  method: 'DELETE',
  headers: myHeaders,
  redirect: 'follow'
};

fetch(url, requestOptions)
  .then(response => response.text())
  .then(result => {console.log(result);
	if(result.status != "fail"){
		elem.parentElement.parentElement.parentElement.parentElement.style.display="none";
	}
})
  .catch(error => console.log('error', error));
}


//display all posts
var count = 0;
function dis_posts() {
	var text = "";
	var desc;
	var max;
	var img;
	var post_id;
	var likesarr;

	fetch("http://www.api.crefto.studio/api/v1/posts")
		.then(response => response.json())
		.then(json => {
			console.log(json);

			if (json.status == "success") {
				max = json.results;

				text += "<div class=\"timeline-body\">";
				text += "<div class=\"timeline-header\">";

				json.data.posts[count].user._id;
				desc = json.data.posts[count].description;
				img = json.data.posts[count].postImg;
				post_id = json.data.posts[count]._id;
				likesarr = json.data.posts[count].likes;
					
					return fetch("http://www.api.crefto.studio/api/v1/users/" + json.data.posts[count].user._id);
			}
			
		}).then(response => response.json())
		.then(json => {
			console.log(json);
			
			text += "<span class=\"userimage\"><img src=\"https://crefto.s3.eu-central-1.amazonaws.com/users/" + json.data.user.photo  +"\"></span>";
			text += "<span class=\"username\">" + json.data.user.name + "</span>";
			text += "</div>";
			text += "<div class=\"timeline-content\">";
			text += "<p>" + desc + "</p>";
			text += "<p class=\"m-t-20\">";
		    text += "<img src=\"https://crefto.s3.eu-central-1.amazonaws.com/posts/" + img + "\">";
			text += "</p>";
			text += "</div>";
			text += "<div class=\"timeline-footer\" id=\"" + post_id + "\">";
			text += "<a href=\"javascript:;\" class=\"m-r-15 text-inverse-lighter\" onclick=\"like(this)\" id=\"likefirst\"><i class=\"fa fa-thumbs-up fa-fw fa-lg m-r-3\"></i><span>"+likesarr.length+"</span>Like</a>";
			text += "<a href=\"javascript:;\" class=\"m-r-15 text-inverse-lighter\" onclick=\"get_comment(this)\"><i class=\"fa fa-comments fa-fw fa-lg m-r-3\"></i> Comment</a>";
			text += "</div>";
			text += "<div class=\"timeline-comment\">";
			text += "</div>";
			text += "<div class=\"timeline-comment-box\">";
			text += "<div class=\"user\"><img src=\"https://crefto.s3.eu-central-1.amazonaws.com/users/" + userphoto+"\"></div>";
			text += "<div class=\"input\">";
			text += "<form action=\"\">";
			text += "<div class=\"input-group\">";
			text += "<input type=\"text\" class=\"form-control rounded-corner\" placeholder=\"Write a comment...\">";
			text += "<span class=\"input-group-btn p-l-10\">";
			text += "<button class=\"btn btn-primary f-s-12 rounded-corner\" type=\"button\" onclick=\"make_comment(this)\">Comment</button>";
			text += "</span>";
			text += "</div>";
			text += "</form>";
			text += "</div>";
			text += "</div>";
			text += "</div>";

			document.getElementById("wall").innerHTML += text;

			if(likesarr.includes(userid)){
				var xx=document.getElementById(post_id).firstElementChild.firstElementChild;
				xx.classList.add("blue-like");
			}
			count++;
			if (count < max) {
				dis_posts();
			}
			else {
				console.log("noooooooooooooooooooooooooooooo");
            }
		})
}


//create comment
function make_comment(elem) {	
	var node_id = elem.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.id;
	var comment_box = elem.parentElement.previousElementSibling;
	console.log(node_id);
	var url = "http://www.api.crefto.studio/api/v1/posts/" + node_id + "/comments";
	// let token = document.cookie;
	// token = token.split("=");
	let token = document.cookie;
	token = token.split(";");
	//console.log("token:",token);
	var c;
	for (let elem of token) {	
		c = elem.split("=");
	}
	//console.log(c);
	var index;
	for ( let i = 0; i < c.length; i++) {
		if (c[i] == "AuthTokenCookie"||c[i] == " AuthTokenCookie") {
			//console.log("mno", i);
			index = i;
        }
	}
	index = index + 1;
	
	fetch(url, {
		method: "POST",
		body: JSON.stringify({
			"content": comment_box.value,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			Authorization: `Bearer ${c[index]}`,
		}
	})
		.then(response => response.json())
		.then(json => {
			console.log(json);

			if(json.status=="success"){
				comment_box.value=" ";
                var x=elem.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.firstElementChild.nextSibling;
				get_comment(x);
			}
		})
};


//get comments
function get_comment(elem) {
	var text="";
	var node_id = elem.parentElement.id;

	var url = "http://www.api.crefto.studio/api/v1/posts/" + node_id + "/comments";

	fetch(url)
		.then(response => response.json())
		.then(json => {
			console.log(json);

			var place=document.getElementById(node_id);

			if(json.results==0){
				text+="<div class=\"container\">";
				text+="<h1 class=\"comments-title\">Comments (<span>"+json.results+"</span>)</h1>";
				text+="</div>";
				text+="</div>";
			}
			else{
				text+="<div class=\"container\">";
				text+="<h1 class=\"comments-title\" onclick=\"hide_comment(this)\">Comments (<span>"+json.results+"</span>)</h1>";
				text+='<div id="hideall">'
            for(let i=0;i<json.results;i++){
				text+="<div class=\"be-comment\" id=\""+json.data.comments.comments[i]._id+"\">";
				text+="<div class=\"be-img-comment\">";
				text+="<a href=\"#\">";
				var img_user=json.data.comments.comments[i].author.photo;
				text+="<img src=\"https://crefto.s3.eu-central-1.amazonaws.com/users/"+img_user+"\" class=\"be-ava-comment\">";
				text+="</a>";
				text+="</div>";
				text+="<div class=\"be-comment-content\">";
				text+="<span class=\"be-comment-name\">";
				text+="<a href=\"#\">"+json.data.comments.comments[i].author.name+"</a>";
				text+="</span>";
				text+="<span class=\"be-comment-time\">";
				text+="<i class=\"fa fa-clock-o\"></i>"+json.data.comments.comments[i].createdAt;
			    text+="</span>";
				text+="<p class=\"be-comment-text\">"+json.data.comments.comments[i].content;
				text+="</p>";
				text+="</div>";
				if(json.data.comments.comments[i].author._id==userid){
					text+="<a id=\"del_com\" onclick=\"del_com(this)\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i></a>";
				}
				text+="</div>";
            }
			text+='</div>'
			text+="</div>";
			text+="</div>";
		}
			place.nextSibling.innerHTML=text;
		})
};


//hide comments
function hide_comment(elem){
	if(elem.nextSibling.style.display=="none"){
		elem.nextSibling.style.display="block";
	}
	else{
		elem.nextSibling.style.display="none";
	}
}


//delete comments
function del_com(elem){
	// let token = document.cookie;
	// token = token.split("=");
	let token = document.cookie;
	token = token.split(";");
	//console.log("token:",token);
	var c;
	for (let elem of token) {	
		c = elem.split("=");
	}
	//console.log(c);
	var index;
	for ( let i = 0; i < c.length; i++) {
		if (c[i] == "AuthTokenCookie"||c[i] == " AuthTokenCookie") {
			//console.log("mno", i);
			index = i;
        }
	}
	index = index + 1;

	var com_id=elem.parentElement.id;
	var post_id=elem.parentElement.parentElement.parentElement.parentElement.previousElementSibling.id;

	var url="http://www.api.crefto.studio/api/v1/posts/"+post_id+"/"+com_id;
	fetch(url, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${c[index]}`,
		}
	})
		.then(response => response.json())
		.then(json => {
			console.log(json);			
		})
		elem.parentElement.style.display="none";
		elem.parentElement.parentElement.previousElementSibling.firstElementChild.innerHTML-=1;
}