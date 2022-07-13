
var FILE = new FILE_CLASS();

/** 
 * manages files actions
 * @author ViliusL
 */
function FILE_CLASS() {

	/**
	 * file info: exif, general data 
	 */
	this.file_info = {
		general: [],
		exif: [],
	};

	
	
	//open 
	this.file_open = function () {
		EDIT.save_state();
		this.open(); //func implement later
	};

	this.open = function () {
		var self = this;

		document.getElementById("tmp").innerHTML = '';
		var a = document.createElement('input');
		a.setAttribute("id", "file_open");
		a.type = 'file';
		a.multiple = 'multiple ';
		document.getElementById("tmp").appendChild(a);
		document.getElementById('file_open').addEventListener('change', function (e) {
			self.open_handler(e);
		}, false);

		//force click
		document.querySelector('#file_open').click();
	};

	this.open_image = function (image_id) {
		var img = document.getElementById(image_id);

		//set name
		var name = img.src.replace(/^.*[\\\/]/, '');
		//add to layer
		LAYER.layer_add(name);
		LAYER.layer_remove(1);

		//specifiy the size
		if (img.width > WIDTH || img.height > HEIGHT) {
			if (img.width > WIDTH)
				WIDTH = img.width;
			if (img.height > HEIGHT)
				HEIGHT = img.height;
			LAYER.set_canvas_size();
		}

		//draw canvas
		canvas_active().drawImage(img, 0, 0);
		IMAGE.trim();
		GUI.zoom_auto(true);
	};

	//when open photo: rsstore grid
	this.check_open = function (e) {
		var files = e.target.files;
		if (files.length == 0) {
			return true;
		}
		else
			return false;
    }
	//open handler
	this.open_handler = function (e) {
		var files = e.target.files;
		var self = this;
		if (files == undefined) {
			//drag and drop
			files = e.dataTransfer.files;
		}

		for (var i = 0, f; i < files.length; i++) {
			f = files[i];
			if (!f.type.match('image.*') && !f.name.match('.json')) {
				console.log('Wrong file type, must be image or json.');
				continue;
			}
			if (files.length == 1)
				this.SAVE_NAME = f.name.split('.')[f.name.split('.').length - 2];

			var FR = new FileReader();
			FR.file = files[i];

			FR.onload = function (event) {
				if (this.file.type.match('image.*')) {
					//image
					LAYER.layer_add(this.file.name, event.target.result, this.file.type);
					self.save_file_info(this.file);
				}
				//want to remove this else
				else {
					//json
					var responce = self.load_json(event.target.result);
					if (responce === true)
						return false;
				}//end
			};
			//want to remove this if and elseif
			if (f.type == "text/plain")
				FR.readAsText(f);
			else if (f.name.match('.json'))
				FR.readAsText(f);//end
			else
				FR.readAsDataURL(f);
		}
	};


	//open url
	this.file_open_url = function(){
		POP.add({name: "url", title: "URL:", value: ""});
		POP.show('Open URL', [FILE, 'file_open_url_handler']);
	};

	//handler for open url
	this.file_open_url_handler = function(user_response){
		var url = user_response.url;
		if(url == '')
			return;
		
		var layer_name = url.replace(/^.*[\\\/]/, '');
		
		var img = new Image();
		img.crossOrigin = "Anonymous";
		img.onload = function () {
			EDIT.save_state();
			LAYER.layer_add(layer_name);
			
			if (img.width > WIDTH)
				WIDTH = img.width;
			if (img.height > HEIGHT)
				HEIGHT = img.height;
			LAYER.set_canvas_size();
			
			canvas_active().drawImage(img, 0, 0);
			if(EVENTS.autosize == true)
				IMAGE.trim();
			GUI.zoom_auto(true);
			GUI.redraw_preview();
		};
		img.onerror = function (ex) {
			POP.add({html: 'Sorry, image could not be loaded. Try copy image and paste it.'});
			POP.show('Error', '.');
		};
		img.src = url;
	};



	/**
	 * default name used for saving file
	 */
	this.SAVE_NAME = 'example';			//default save name


	/**
	 * save as option 
	 * 
	 * save types config
	 */
	this.SAVE_TYPES = [
		"PNG - Portable Network Graphics",	//default
		"JPG - JPG/JPEG Format",		//autodetect on photos where png useless?
	];

	//save
	this.file_save = function () {
		this.save_dialog();
	};


	//print
	this.file_print = function () {
		window.print();
	};

	
	//inside save as//
	this.save_dialog = function (e) {
		//find default format
		var save_default = this.SAVE_TYPES[0];	//png
		if (HELPER.getCookie('save_default') == 'jpg')
			save_default = this.SAVE_TYPES[1]; //jpg
		
		calc_size_value = 'No';
		calc_size = false;
		if(WIDTH * HEIGHT < 1000000){
			calc_size_value = 'Yes';
			calc_size = true;
		}

		POP.add({name: "name", title: "File name:", value: this.SAVE_NAME});
		POP.add({name: "type", title: "Save as type:", values: this.SAVE_TYPES, value: save_default, onchange: "FILE.save_dialog_onchange(this)"});
		POP.add({name: "layers", title: "Save layers:", values: ['All', 'Selected'], onchange: "FILE.save_dialog_onchange(this)"});
		POP.add({title: "File size:", html: '<span id="file_size">-</span>'});
		POP.show('Save as', [FILE, 'save']);
		document.getElementById("pop_data_name").select();
		if (e != undefined)
			e.preventDefault();

		if (calc_size == true) {
			//calc size once
			this.save_dialog_onchange();
		}
	};
	
	//activated on save dialog parameters change
	this.save_dialog_onchange = function (object){
		var _this = this;
		this.update_file_size('...');
		
		//get values
		var only_one_layer = document.getElementById("pop_data_layers_poptmp1").checked;

		//make size always calculated
		var calc_size = true/*document.getElementById("pop_data_calc_size_poptmp1").checked*/;

		//set the quality of jpeg const
		var quality = 90/* document.getElementById("pop_data_quality").value*/;
		
		var type = null;
		for(var i in this.SAVE_TYPES){
			if(document.getElementById("pop_data_type_poptmp" + i).checked){
				type = this.SAVE_TYPES[i];
			}
		}
		var parts = type.split(" ");
		type = parts[0];
		
		if(calc_size == false){
			document.getElementById('file_size').innerHTML = '-';
			return;
		}
		
		if (type != 'JSON' && type != 'GIF') {
			//create temp canvas
			var tempCanvas = document.createElement("canvas");
			var tempCtx = tempCanvas.getContext("2d");
			tempCanvas.width = WIDTH;
			tempCanvas.height = HEIGHT;
			
			//ask data
			LAYER.export_layers_to_canvas(tempCtx, type, only_one_layer);
		}
		
		//calc size
		if (type == 'PNG') {
			//png
			tempCanvas.toBlob(function(blob) {
				_this.update_file_size(blob.size);
			});
		}
		else if (type == 'JPG') {
			//jpg
			tempCanvas.toBlob(function (blob) {
				_this.update_file_size(blob.size);
			}, "image/jpeg", quality);
		}
	};
	
	this.update_file_size = function (file_size){
		if(typeof file_size == 'string'){
			document.getElementById('file_size').innerHTML = file_size;
			return;
		}
		
		if(file_size > 1024 * 1024)
			file_size = HELPER.number_format(file_size / 1024 / 1024, 2) + ' MB';
		else if(file_size > 1024)
			file_size = HELPER.number_format(file_size / 1024, 2) + ' KB';
		else 
			file_size = (file_size) + ' B';
		document.getElementById('file_size').innerHTML = file_size;
	};

	this.save = function (user_response) {
		fname = user_response.name;
		if(user_response.layers == 'All')
			only_one_layer = false;
		else
			only_one_layer = true;
		
		var quality = parseInt(user_response.quality);
		if (quality > 100 || quality < 1 || isNaN(quality) == true)
			quality = 90;
		quality = quality / 100;
		
		delay = parseInt(user_response.delay);
		if (delay < 0 || isNaN(quality) == true)
			quality = 500;
		
		//detect type
		var type = user_response.type;
		var parts = type.split(" ");
		type = parts[0];
		
		if (HELPER.strpos(fname, '.png') !== false)
			type = 'PNG';
		else if (HELPER.strpos(fname, '.jpg') !== false)
			type = 'JPG';
		
		//save type as cookie
		var save_default = this.SAVE_TYPES[0]; //png
		if (HELPER.getCookie('save_default') == 'jpg')
			save_default = this.SAVE_TYPES[1]; //jpg
		if (user_response.type != save_default && user_response.type == this.SAVE_TYPES[0])
			HELPER.setCookie('save_default', 'png');
		else if (user_response.type != save_default && user_response.type == this.SAVE_TYPES[1])
			HELPER.setCookie('save_default', 'jpg');
		
		if (type != 'JSON' && type != 'GIF') {
			//create temp canvas
			var tempCanvas = document.createElement("canvas");
			var tempCtx = tempCanvas.getContext("2d");
			tempCanvas.width = WIDTH;
			tempCanvas.height = HEIGHT;
			
			//ask data
			LAYER.export_layers_to_canvas(tempCtx, type, only_one_layer);
		}

		if (type == 'PNG') {
			//png - default format
			if (HELPER.strpos(fname, '.png') == false)
				fname = fname + ".png";
			
			tempCanvas.toBlob(function(blob) {
				saveAs(blob, fname);
				//var url = URL.createObjectURL(blob);
				//console.log("mno", url);
			});
		}
		else if (type == 'JPG') {
			//jpg
			if (HELPER.strpos(fname, '.jpg') == false)
				fname = fname + ".jpg";
			
			tempCanvas.toBlob(function (blob) {
				saveAs(blob, fname);
			}, "image/jpeg", quality);
		}
		
	};
	
	this.check_format_support = function(canvas, data_header, show_error){
		var data = canvas.toDataURL(data_header);
		var actualType = data.replace(/^data:([^;]*).*/, '$1');
		
		if (data_header != actualType && data_header != "text/plain") {
			if(show_error == undefined || show_error == true) {
				//error - no support
				POP.add({title: "Error:", value: 'Your browser does not support this format.'});
				POP.show('Sorry', '');
			}
			delete data;
			return false;
		}
		delete data;
		return true;
	};
	
	this.save_cleanup = function (a) {
		a.textContent = 'Downloaded';
		setTimeout(function () {
			a.href = '';
			var element = document.getElementById("save_data");
			element.parentNode.removeChild(element);
		}, 3000);
	};
	
	this.save_file_info = function (object) {
		this.file_info = {
			general: [],
			exif: [],
		};
		//exif data
		EXIF.getData(object, function() {
			FILE.file_info.exif = this.exifdata;
		});
		
		//general
		if(object.name != undefined)
			FILE.file_info.general.Name = object.name;
		if(object.size != undefined)
			FILE.file_info.general.Size = HELPER.number_format(object.size/1000, 2)+' KB';
		if(object.type != undefined)
			FILE.file_info.general.Type = object.type;
		if(object.lastModified != undefined)
			FILE.file_info.general['Last modified'] = HELPER.format_time(object.lastModified);
	};
	
	this.export_as_json = function(){
		var export_data = {};
		
		//get date
		var today = new Date();
		var yyyy = today.getFullYear();
		var mm = today.getMonth()+1; //January is 0!
		var dd = today.getDate();
		if(dd < 10)
			dd = '0'+dd;
		if(mm < 10)
			mm = '0'+mm;
		var today = yyyy+'-'+mm+'-'+dd;

		//basic info
		export_data.info = {
			width: WIDTH,
			height: HEIGHT,
			about: 'Image data with multi-layers. Can be opened using miniPaint, https://github.com/viliusle/miniPaint',
			date: today,
		};

		//layers
		export_data.layers = [];
		for(var i = LAYER.layers.length-1; i >=0; i--){
			var layer = {
				name:LAYER.layers[i].name,
				title:LAYER.layers[i].title, 
				visible: 1,
				opacity: LAYER.layers[i].opacity,
			};
			if (LAYER.layers[i].visible == false)
				layer.visible = 0;
			export_data.layers.push(layer);
		}

		//image data
		export_data.image_data = [];
		for(var i = LAYER.layers.length-1; i >=0; i--){
			var data_tmp = document.getElementById(LAYER.layers[i].name).toDataURL("image/png");
			export_data.image_data.push({name: LAYER.layers[i].name, data: data_tmp});
		}

		var data_json = JSON.stringify(export_data, null, 6);
		delete export_data;

		return data_json;	
	};
	
	this.load_json = function (data) {
		var json = JSON.parse(data);

		//init new file
		GUI.ZOOM = 100;
		MAIN.init();
		
		LAYER.remove_all_layers();

		//set attributes
		WIDTH = parseInt(json.info.width);
		HEIGHT = parseInt(json.info.height);
		LAYER.set_canvas_size();

		//add layers
		for(var i in json.layers){
			var layer = json.layers[i];
			var name = layer.name.replace(/[^0-9a-zA-Z-_\. ]/g, "");
			var title = layer.title;
			var visible = parseInt(layer.visible);
			var opacity = parseInt(layer.opacity);

			LAYER.layer_add(name);
			//update attributes
			LAYER.layers[LAYER.layer_active].title = title;
			if (visible == 0)
				LAYER.layer_visibility(LAYER.layer_active);
			LAYER.layers[LAYER.layer_active].opacity = opacity;
		}
		LAYER.layer_renew();
	
		for(var i in json.image_data){
			var layer = json.image_data[i];
			var name = layer.name.replace(/[^0-9a-zA-Z-_\. ]/g, "");
			var data = layer.data;

			var img = new Image();
			img.onload = (function(name, value){
				return function(){
					document.getElementById(name).getContext('2d').drawImage(value, 0, 0);

					LAYER.layer_renew();
					GUI.zoom();
				};
			})(name, img);
			img.src = data;
			
		}
	};


}