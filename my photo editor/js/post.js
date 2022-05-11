//popmenu
 function togg() {
	 if (document.getElementById("pop_post").style.display == "none") {
		 document.getElementById("pop_post").style.display = "block";
	}
	 else {
		 document.getElementById("pop_post").style.display = "none";
        } 
}


// post
var url;
function post() {
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
	//console.log(token);
	var c;
	for (let elem of token) {	
		c = elem.split("=");
	}
	//console.log(c);
	var index;
	for ( let i = 0; i < c.length; i++) {
		if (c[i] == "AuthTokenCookie") {
			//console.log("mno", i);
			index = i;
        }
	}
	index = index + 1;
	//console.log(c[index]);

	var formdata = new FormData();
	formdata.append('name', document.getElementById('post_name').value);
	formdata.append('type', "Photo Editor");
	formdata.append('postImg', fileData);
	formdata.append('description', document.getElementById('post_des').value);

	var myHeaders = new Headers();

	myHeaders.append("Authorization", `Bearer ${c[index]}`);

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
			alert("mabroook");
		})

		.catch((err) => {
			console.error(err);
		})
}
