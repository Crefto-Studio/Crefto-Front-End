
var IMAGE = new IMAGE_CLASS();

/** 
 * manages image actions
 * 
 * @author ViliusL
 */
function IMAGE_CLASS() {


	//crop
	this.image_crop = function () {
		EDIT.save_state();
		if (DRAW.select_data == false) {
			POP.add({html: 'Select area first'});
			POP.show('Error', '');
		}
		else {
			for (var i in LAYER.layers) {
				var layer = document.getElementById(LAYER.layers[i].name).getContext("2d");

				var tmp = layer.getImageData(DRAW.select_data.x, DRAW.select_data.y, DRAW.select_data.w, DRAW.select_data.h);
				layer.clearRect(0, 0, WIDTH, HEIGHT);
				layer.putImageData(tmp, 0, 0);
			}
			
			

			//resize for cropping
			EDIT.save_state();
			WIDTH = DRAW.select_data.w;
			HEIGHT = DRAW.select_data.h;
			LAYER.set_canvas_size();

			DRAW.select_data = false;
			canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
		}
	};


	//zoom

	//zoom in
	this.zoom_in = function () {
		GUI.zoom(+1, true);
	};
	//zoom out
	this.zoom_out = function () {
		GUI.zoom(-1, true);
	};
	//zoom original:make it 100%
	this.zoom_original = function () {
		GUI.zoom(100, true);
	};
	//zoom fit: make it suitable for window
	this.zoom_auto = function () {
		GUI.zoom_auto();
	};


	//resize
	this.image_resize = function () {
		this.resize_box();
	};

	this.resize_box = function () {
		POP.add({ name: "width", title: "Width (pixels):", value: '', placeholder: WIDTH });
		POP.add({ name: "height", title: "Height (pixels):", value: '', placeholder: HEIGHT });
		POP.show('Resize', [IMAGE, "resize_layer"]);
	};

	this.resize_layer = function (user_response) {
		EDIT.save_state();
		var width = parseInt(user_response.width);
		var height = parseInt(user_response.height);
		if (isNaN(width) && isNaN(height))
			return false;
		if (width == WIDTH && height == HEIGHT)
			return false;


		//if only 1 dimension was provided
		if (isNaN(width) || isNaN(height)) {
			var ratio = WIDTH / HEIGHT;
			if (isNaN(width))
				width = Math.round(height * ratio);
			if (isNaN(height))
				height = Math.round(width / ratio);
		}

		//simple resize - max speed
		resize_type = 'Default';
		tmp_data = document.createElement("canvas");
		tmp_data.width = WIDTH;
		tmp_data.height = HEIGHT;
		tmp_data.getContext("2d").drawImage(canvas_active(true), 0, 0);

		canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
		WIDTH = width;
		HEIGHT = height;
		LAYER.set_canvas_size();
		canvas_active().drawImage(tmp_data, 0, 0, width, height);
		GUI.zoom();
	};


//rotate
	//rotate left
	this.image_rotate_left = function () {
		EDIT.save_state();
		this.rotate_resize_doc(270, WIDTH, HEIGHT);
		this.rotate_layer({angle: 270}, canvas_active(), WIDTH, HEIGHT);
	};

	//rotate right
	this.image_rotate_right = function () {
		EDIT.save_state();
		this.rotate_resize_doc(90, WIDTH, HEIGHT);
		this.rotate_layer({ angle: 90 }, canvas_active(), WIDTH, HEIGHT);
		
	};

	//rotate
	this.image_rotate = function () {
		POP.add({name: "angle", title: "Enter angle (0-360):", value: 0, range: [0, 360]});
		POP.show(
			'Rotate', 
			function (response) {
				EDIT.save_state();
			//	if(response.mode == 'All')
				IMAGE.rotate_resize_doc(response.angle, WIDTH, HEIGHT);
				IMAGE.rotate_layer(response, canvas_active(), WIDTH, HEIGHT);
			},
			function (response, canvas_preview, w, h) {
				IMAGE.rotate_layer(response, canvas_preview, w, h);
			}
		);
	};


	//prepare rotation - increase doc dimensions if needed
	this.rotate_resize_doc = function (angle, w, h) {
		var o = angle * Math.PI / 180;
		var new_x = w * Math.abs(Math.cos(o)) + h * Math.abs(Math.sin(o));
		var new_y = w * Math.abs(Math.sin(o)) + h * Math.abs(Math.cos(o));
		new_x = Math.ceil(Math.round(new_x * 1000) / 1000);
		new_y = Math.ceil(Math.round(new_y * 1000) / 1000);

		if (WIDTH != new_x || HEIGHT != new_y) {
			EDIT.save_state();
			var dx = 0;
			var dy = 0;
			if (new_x > WIDTH) {
				dx = Math.ceil(new_x - WIDTH) / 2;
				WIDTH = new_x;
			}
			if (new_y > HEIGHT) {
				dy = Math.ceil(new_y - HEIGHT) / 2;
				HEIGHT = new_y;
			}
			LAYER.set_canvas_size();

			var tmp = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
			canvas_active().putImageData(tmp, dx, dy);
		}
	};

	//rotate layer
	this.rotate_layer = function (user_response, canvas, w, h) {
		var TO_RADIANS = Math.PI / 180;
		angle = user_response.angle;
	//	mode = user_response.mode;

		var area_x = 0;
		var area_y = 0;
		var area_w = w;
		var area_h = h;

		var dx = 0;
		var dy = 0;

		var tempCanvas = document.createElement("canvas");
		var tempCtx = tempCanvas.getContext("2d");
		tempCanvas.width = area_w;
		tempCanvas.height = area_h;
		var imageData = canvas.getImageData(area_x, area_y, area_w, area_h);
		tempCtx.putImageData(imageData, 0, 0);

		//rotate
		canvas.clearRect(area_x, area_y, area_w, area_h);
		canvas.save();
		canvas.translate(area_x + Math.round(area_w / 2), area_y + Math.round(area_h / 2));
		canvas.rotate(angle * TO_RADIANS);
		canvas.drawImage(tempCanvas, -Math.round(area_w / 2), -Math.round(area_h / 2));
		canvas.restore();
		if (w == WIDTH && h == HEIGHT) {
			//if main canvas
			GUI.zoom();
		}
	};



	//flip

	//vertical flip
	this.image_vflip = function () {
		EDIT.save_state();
		var tempCanvas = document.createElement("canvas");
		var tempCtx = tempCanvas.getContext("2d");
		tempCanvas.width = WIDTH;
		tempCanvas.height = HEIGHT;
		tempCtx.drawImage(canvas_active(true), 0, 0, WIDTH, HEIGHT);
		//flip
		canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
		canvas_active().save();
		canvas_active().scale(1, -1);
		canvas_active().drawImage(tempCanvas, 0, -HEIGHT);
		canvas_active().restore();
	};


	//horizontal flip
	this.image_hflip = function () {
		EDIT.save_state();
		var tempCanvas = document.createElement("canvas");
		var tempCtx = tempCanvas.getContext("2d");
		tempCanvas.width = WIDTH;
		tempCanvas.height = HEIGHT;
		tempCtx.drawImage(canvas_active(true), 0, 0, WIDTH, HEIGHT);
		//flip
		canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
		canvas_active().save();
		canvas_active().scale(-1, 1);
		canvas_active().drawImage(tempCanvas, -WIDTH, 0);
		canvas_active().restore();
	};


	//color corrections
	this.image_colors = function () {
		POP.add({name: "param1", title: "Brightness:", value: "0", range: [-100, 100]});
		POP.add({name: "param2", title: "Contrast:", value: "0", range: [-100, 100]});
		POP.add({});
		POP.add({name: "param_red", title: "Red channel:", value: "0", range: [-255, 255]});
		POP.add({name: "param_green", title: "Green channel:", value: "0", range: [-255, 255]});
		POP.add({name: "param_blue", title: "Blue channel:", value: "0", range: [-255, 255]});
		POP.add({});
		POP.add({name: "param_h", title: "Hue:", value: "0", range: [-180, 180]});
		POP.add({name: "param_s", title: "Saturation:", value: "0", range: [-100, 100]});
		POP.add({name: "param_l", title: "Luminance:", value: "0", range: [-100, 100]});

		POP.show(
			'Color corrections', 
			function (user_response) {
				EDIT.save_state();
				var param1 = parseInt(user_response.param1);
				var param2 = parseInt(user_response.param2);
				var param_red = parseInt(user_response.param_red);
				var param_green = parseInt(user_response.param_green);
				var param_blue = parseInt(user_response.param_blue);
				var param_h = parseInt(user_response.param_h);
				var param_s = parseInt(user_response.param_s);
				var param_l = parseInt(user_response.param_l);

				var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
				//Brightness/Contrast
				var filtered = ImageFilters.BrightnessContrastPhotoshop(imageData, param1, param2);
				//RGB corrections
				var filtered = ImageFilters.ColorTransformFilter(filtered, 1, 1, 1, 1, param_red, param_green, param_blue, 1);
				//hue/saturation/luminance
				var filtered = ImageFilters.HSLAdjustment(filtered, param_h, param_s, param_l);
				canvas_active().putImageData(filtered, 0, 0);
				GUI.zoom();
			},
			function (user_response, canvas_preview, w, h) {
				var param1 = parseInt(user_response.param1);
				var param2 = parseInt(user_response.param2);
				var param_red = parseInt(user_response.param_red);
				var param_green = parseInt(user_response.param_green);
				var param_blue = parseInt(user_response.param_blue);
				var param_h = parseInt(user_response.param_h);
				var param_s = parseInt(user_response.param_s);
				var param_l = parseInt(user_response.param_l);

				var imageData = canvas_preview.getImageData(0, 0, w, h);
				//Brightness/Contrast
				var filtered = ImageFilters.BrightnessContrastPhotoshop(imageData, param1, param2);	//add effect
				//RGB corrections
				var filtered = ImageFilters.ColorTransformFilter(filtered, 1, 1, 1, 1, param_red, param_green, param_blue, 1);
				//hue/saturation/luminance
				var filtered = ImageFilters.HSLAdjustment(filtered, param_h, param_s, param_l);
				canvas_preview.putImageData(filtered, 0, 0);
			}
		);
	};


	//convert to grayscale
	this.image_GrayScale = function () {
		EDIT.save_state();
		var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
		var filtered = ImageFilters.GrayScale(imageData);	//add effect
		canvas_active().putImageData(filtered, 0, 0);
	};
	

	/**
	 * get canvas painted are coords
	 *
	 * @param {HtmlElement} canvas
	 * @param {boolean} trim_white
	 */

	//related to rotate 
	//i see it not useful but when removing it don't work baaaad
	this.trim_info = function (canvas, trim_white) {
		var top = 0;
		var left = 0;
		var bottom = 0;
		var right = 0;
		var img = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
		var imgData = img.data;
		var empty = false;
		if(trim_white == undefined)
			trim_white = true;
		//check top
		main1:
			for (var y = 0; y < img.height; y++) {
			for (var x = 0; x < img.width; x++) {
				var k = ((y * (img.width * 4)) + (x * 4));
				if (imgData[k + 3] == 0)
					continue; //transparent 
				if (trim_white == true && imgData[k] == 255 && imgData[k + 1] == 255 && imgData[k + 2] == 255)
					continue; //white
				break main1;
			}
			top++;
		}
		//check left
		main2:
			for (var x = 0; x < img.width; x++) {
			for (var y = 0; y < img.height; y++) {
				var k = ((y * (img.width * 4)) + (x * 4));
				if (imgData[k + 3] == 0)
					continue; //transparent 
				if (trim_white == true && imgData[k] == 255 && imgData[k + 1] == 255 && imgData[k + 2] == 255)
					continue; //white
				break main2;
			}
			left++;
		}
		//check bottom
		main3:
			for (var y = img.height - 1; y >= 0; y--) {
			for (var x = img.width - 1; x >= 0; x--) {
				var k = ((y * (img.width * 4)) + (x * 4));
				if (imgData[k + 3] == 0)
					continue; //transparent 
				if (trim_white == true && imgData[k] == 255 && imgData[k + 1] == 255 && imgData[k + 2] == 255)
					continue; //white
				break main3;
			}
			bottom++;
		}
		//check right
		main4:
			for (var x = img.width - 1; x >= 0; x--) {
			for (var y = img.height - 1; y >= 0; y--) {
				var k = ((y * (img.width * 4)) + (x * 4));
				if (imgData[k + 3] == 0)
					continue; //transparent 
				if (trim_white == true && imgData[k] == 255 && imgData[k + 1] == 255 && imgData[k + 2] == 255)
					continue; //white
				break main4;
			}
			right++;
		}
		
		if(top == canvas.height && left == canvas.width){
			//canvas is empty
			empty = true;
		}
		
		return {
			top: top,
			left: left,
			bottom: bottom,
			right: right,
			empty: empty,
		};
	};

}