//popmenu
function display_pop(){
    document.getElementById('wrapper2').style.display="block";
}
function lock_pop(){
    document.getElementById('wrapper2').style.display="none";
}
//  function togg() {
// 	 if (document.getElementById("pop_post").style.display == "none") {
// 		 document.getElementById("pop_post").style.display = "block";
// 	}
// 	 else {
// 		 document.getElementById("pop_post").style.display = "none";
//         } 
// }

//for del btn
function trash(){
	document.querySelector('#title').value = '';
	document.querySelector('#desc').value = '';
  //   quill.setText('');
  //   toaster('Trashed');
  }


// post
var url;
function post() {
	document.getElementById('post_btn').innerHTML='<i class="fas fa-spinner fa-spin"></i>'
    var only_one_layer = false;
    var type = 'PNG';
    var tempCanvas = document.createElement("canvas");
    var tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = WIDTH;
    tempCanvas.height = HEIGHT;
    LAYER.export_layers_to_canvas(tempCtx, type, only_one_layer);
   /* tempCanvas.toBlob(function (blob) {
    url = URL.createObjectURL(blob);
    console.log("mno", url);*/
	url = tempCanvas.toDataURL();
	//console.log("mno", url);
	// })	;

	function dataURLtoFile(dataurl, filename) {
		var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	}

	var fileData = dataURLtoFile(url, "imageName.jpg");
	console.log("Here is JavaScript File Object", fileData);

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
	//console.log(c[index]);

	var formdata = new FormData();
	formdata.append('name', document.getElementById('title').value);
	formdata.append('type', "Photo Editor");
	formdata.append('postImg', fileData);
	formdata.append('description', document.getElementById('desc').value);

	var myHeaders = new Headers();

	myHeaders.append("Authorization", `Bearer ${c[index]}`);
	console.log("222222222222222222");
	console.log(c[index]);
	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: formdata,
		redirect: 'follow'
	};

	fetch("http://www.api.crefto.studio/api/v1/posts", requestOptions)

		.then(response => response.json())

		.then(json => {
			console.log(json);
			if(json.status=="success"){
				// alert("mabroook");
				document.getElementById('post_btn').innerHTML='Post';
				document.getElementById('fail_cond').style.color="#49D907";
				document.getElementById('fail_cond').innerHTML="Posted Successfully";
				trash();
				}
				else{
					document.getElementById('fail_cond').style.color="#FBA504";
					document.getElementById('fail_cond').innerHTML="&nbsp;Fail!! "+json.message;
					document.getElementById('post_btn').innerHTML='Post';
				}
		})

		.catch((err) => {
			console.error(err);
		})
}
