/* global MAIN, HELPER, LAYER, EDIT, POP, GUI, EVENTS, IMAGE, EL, fx, ImageFilters, sketchy_brush, shaded_brush, chrome_brush, BezierCurveBrush */
/* global WIDTH, HEIGHT, COLOR, canvas_active, canvas_front */

var DRAW = new DRAW_TOOLS_CLASS();

/** 
 * manages draw tools
 * 
 * @author ViliusL
 */
function DRAW_TOOLS_CLASS() {
	
	/**
	 * user action for selected area
	 */
	this.select_square_action = '';
	
	/**
	 * previous line coordinates [x, y]
	 */
	this.last_line = [];
	
	/**
	 * user selected area config - array(x, y, width, height)
	 */
	this.select_data = false;
	
	/**
	 * currently used tool
	 */
	this.active_tool = 'select_tool';
	
	/**
	 * line points data for curved line
	 */
	var curve_points = [];
	
	/**
	 * image data for cloning tool
	 */
	var clone_data = false;
	
	/**
	 * fx library object
	 */
	var fx_filter = false;

	//mouse icon
	//type = click, right_click, drag, move, release
	this.select_tool = function (type, mouse, event) {
		if (mouse == undefined)
			return false;
		if (mouse.valid == false)
			return true;
		if (mouse.click_valid == false)
			return true;
		if (event != undefined && event.target.id == "canvas_preview")
			return true;
		var active_layer_obj = document.getElementById(LAYER.layers[LAYER.layer_active].name);
		
		if (type == 'drag') {
			canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
			
			if(active_layer_obj.style.visibility != 'hidden'){
				//hide active layer
				active_layer_obj.style.visibility = 'hidden';
			}
			
			if(EVENTS.ctrl_pressed == true){
				//ctrl is pressed
				var xx = mouse.x;
				var yy = mouse.y;
				if (Math.abs(mouse.click_x - mouse.x) < Math.abs(mouse.click_y - mouse.y))
					xx = mouse.click_x;
				else
					yy = mouse.click_y;
				canvas_front.drawImage(canvas_active(true), xx - mouse.click_x, yy - mouse.click_y);
			}
			else{
				canvas_front.drawImage(canvas_active(true), mouse.x - mouse.click_x, mouse.y - mouse.click_y);
			}
		}
		else if (type == 'release') {
			//show active layer
			active_layer_obj.style.visibility = 'visible';
			
			if (mouse.valid == false || mouse.click_x === false){
				return false;
			}
			if (mouse.x - mouse.click_x == 0 && mouse.y - mouse.click_y == 0){
				return false;
			}
			EDIT.save_state();
			var tmp = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
			if(EVENTS.ctrl_pressed == true){
				//ctrl is pressed
				var xx = mouse.x;
				var yy = mouse.y;
				if (Math.abs(mouse.click_x - mouse.x) < Math.abs(mouse.click_y - mouse.y))
					xx = mouse.click_x;
				else
					yy = mouse.click_y;
				canvas_active().putImageData(tmp, xx - mouse.click_x, yy - mouse.click_y);
			}
			else{
				canvas_active().putImageData(tmp, mouse.x - mouse.click_x, mouse.y - mouse.click_y);
			}	
		}
	};


	//text
	this.letters = function (type, mouse, event) {
		var _this = this;
		if (mouse.valid == false)
			return true;
		var xx = mouse.x;
		var yy = mouse.y;
		if (type == 'click') {
			POP.add({name: "text", title: "Text:", value: "", type: 'textarea'});
			POP.add({name: "size", title: "Size:", value: 20, range: [2, 1000], step: 2});
			POP.add({name: "color", title: "Color:", value: "#000000", type: "color"});
			POP.add({name: "style", title: "Font style:", values: ["Normal", "Italic", "Bold", "Bold Italic"], type: 'select'});
			POP.add({name: "family", title: "Font family:", values: ["Arial", "Courier", "Impact", "Helvetica", "monospace", "Times New Roman", "Verdana"], type: 'select'});
			POP.add({name: "size_3d", title: "3D size:", value: 0, range: [0, 200]});
			POP.add({ name: "pos_3d", title: "3D position:", values: ["Top-left", "Top-right", "Bottom-left", "Bottom-right"], type: 'select' });
			//i add color for 3d
			POP.add({ name: "color_3d", title: "3D Color:", value: "#000000", type: "color" });
			POP.add({name: "shadow", title: "Shadow:", values: ["No", "Yes"]});
			POP.add({name: "shadow_blur", title: "Shadow blur:", value: 6, range: [1, 20]});
			POP.add({name: "shadow_color", title: "Shadow color:", value: "#000000", type: "color"});
			POP.add({name: "fill_style", title: "Fill style:", values: ["Fill", "Stroke", "Both"], type: 'select'});
			POP.add({name: "stroke_size", title: "Stroke size:", value: 1, range: [1, 100]});
			POP.preview_in_main = true;
			POP.show(
				'Text', 
				function (user_response) {
					EDIT.save_state();
					var trim_details = IMAGE.trim_info(canvas_active(true));
					if (trim_details.empty == false) {
						LAYER.layer_add();
					}
					text = user_response.text.split("\n");
					for (var i in text) {
						user_response.text = text[i];
						var yyy = yy + i * (parseInt(user_response.size) + 2);
						_this.letters_render(canvas_active(), xx, yyy, user_response);
					}
					canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
				},
				function (user_response) {
					canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
					text = user_response.text.split("\n");
					for (var i in text) {
						user_response.text = text[i];
						var yyy = yy + i * (parseInt(user_response.size) + 2);
						_this.letters_render(canvas_front, xx, yyy, user_response);
					}
				}
			);
		}
	};

	this.letters_render = function (canvas, xx, yy, user_response) {
		var text = user_response.text;
		var size = parseInt(user_response.size);
		var color = user_response.color;
		var dpth = parseInt(user_response.size_3d);
		var pos_3d = user_response.pos_3d;
		//add 3d color
		var color_3d = user_response.color_3d;
		var shadow = user_response.shadow;
		var shadow_blur = parseInt(user_response.shadow_blur);
		var shadow_color = user_response.shadow_color;
		var font = user_response.family;
		var font_style = user_response.style;
		var fill_style = user_response.fill_style;
		var stroke_size = user_response.stroke_size;
		var dx;
		var dy;
		if (pos_3d == "Top-left") {
			dx = -1;
			dy = -1;
		}
		else if (pos_3d == "Top-right") {
			dx = 1;
			dy = -1;
		}
		else if (pos_3d == "Bottom-left") {
			dx = -1;
			dy = 1;
		}
		else if (pos_3d == "Bottom-right") {
			dx = 1;
			dy = 1;
		}

		var color_rgb = HELPER.hex2rgb(color);
		canvas.fillStyle = "rgba(" + color_rgb.r + ", " + color_rgb.g + ", " + color_rgb.b + ", " + ALPHA / 255 + ")";
		canvas.font = font_style + " " + size + "px " + font;
		var letters_height = HELPER.font_pixel_to_height(size);

		//shadow
		if (shadow == 'Yes') {
			canvas.save();
			canvas.shadowColor = shadow_color;
			canvas.shadowBlur = shadow_blur;
			canvas.shadowOffsetX = dx;
			canvas.shadowOffsetY = dy;
			canvas.fillText(text, xx + dx * (dpth - 1), yy + letters_height + dy * (dpth - 1));
			canvas.restore();
		}

		//3d
		if (dpth > 0) {
			//modify
			canvas.fillStyle = color_3d;
			//canvas.fillStyle = HELPER.darkenColor(COLOR, -30);
			//canvas.fillStyle = "rgba(" + color_rgb.r + ", " + color_rgb.g + ", " + color_rgb.b + ", " + ALPHA / 255 + ")";
			for (cnt = 0; cnt < dpth; cnt++)
				canvas.fillText(text, xx + dx * cnt, yy + letters_height + dy * cnt);
			//color_rgb = HELPER.hex2rgb(COLOR);
		}

		//main text
		canvas.fillStyle = "rgba(" + color_rgb.r + ", " + color_rgb.g + ", " + color_rgb.b + ", " + ALPHA / 255 + ")";
		canvas.strokeStyle = "rgba(" + color_rgb.r + ", " + color_rgb.g + ", " + color_rgb.b + ", " + ALPHA / 255 + ")";
		canvas.lineWidth = stroke_size;
		if (fill_style == 'Fill' || fill_style == 'Both')
			canvas.fillText(text, xx, yy + letters_height);
		if (fill_style == 'Stroke' || fill_style == 'Both')
			canvas.strokeText(text, xx, yy + letters_height);

		GUI.zoom();
	};


	this.gradient_tool = function (type, mouse, event) {
		if (mouse != undefined && mouse.valid == false && type != 'init')
			return true;
		var power = GUI.action_data().attributes.power;
		if (power > 99)
			power = 99;

		if (type == 'init') {
			POP.add({name: "param1", title: "Color #1:", value: '#000000', type: 'color'});
			POP.add({name: "param2", title: "Transparency #1:", value: '100', range: [0, 255]});
			POP.add({name: "param3", title: "Color #2:", value: '#ffffff', type: 'color'});
			POP.add({name: "param4", title: "Transparency #2:", value: '100', range: [0, 255]});
			POP.show(
				'Gradient', 
				function (user_response) {
					color1 = HELPER.hex2rgb(user_response.param1);
					color1.a = parseInt(user_response.param2);

					color2 = HELPER.hex2rgb(user_response.param3);
					color2.a = parseInt(user_response.param4);
				}
			);
		}
		else if (type == 'drag') {
			canvas_front.clearRect(0, 0, WIDTH, HEIGHT);

			if (GUI.action_data().attributes.radial == false) {
				//linear
				canvas_front.rect(0, 0, WIDTH, HEIGHT);
				
				var grd = canvas_front.createLinearGradient(
					mouse.click_x, mouse.click_y,
					mouse.x, mouse.y);
				
				grd.addColorStop(0, "rgba(" + color1.r + ", " + color1.g + ", " + color1.b + ", " + color1.a / 255 + ")");
				grd.addColorStop(1, "rgba(" + color2.r + ", " + color2.g + ", " + color2.b + ", " + color2.a / 255 + ")");
				canvas_front.fillStyle = grd;
				canvas_front.fill();
			}
			else {
				//radial
				var dist_x = mouse.click_x - mouse.x;
				var dist_y = mouse.click_y - mouse.y;
				var distance = Math.sqrt((dist_x * dist_x) + (dist_y * dist_y));
				var radgrad = canvas_front.createRadialGradient(
					mouse.click_x, mouse.click_y, distance * power / 100,
					mouse.click_x, mouse.click_y, distance);
				radgrad.addColorStop(0, "rgba(" + color1.r + ", " + color1.g + ", " + color1.b + ", " + color1.a / 255 + ")");
				radgrad.addColorStop(1, "rgba(" + color2.r + ", " + color2.g + ", " + color2.b + ", " + color2.a / 255 + ")");

				canvas_front.fillStyle = radgrad;
				canvas_front.fillRect(0, 0, WIDTH, HEIGHT);
			}
		}
		else if (type == 'release') {
			EDIT.save_state();
			if (GUI.action_data().attributes.radial == false) {
				//linear
				canvas_active().rect(0, 0, WIDTH, HEIGHT);
				var grd = canvas_active().createLinearGradient(
					mouse.click_x, mouse.click_y,
					mouse.x, mouse.y);
				
				grd.addColorStop(0, "rgba(" + color1.r + ", " + color1.g + ", " + color1.b + ", " + color1.a / 255 + ")");
				grd.addColorStop(1, "rgba(" + color2.r + ", " + color2.g + ", " + color2.b + ", " + color2.a / 255 + ")");
				canvas_active().fillStyle = grd;
				canvas_active().fill();
			}
			else {
				//radial
				var dist_x = mouse.click_x - mouse.x;
				var dist_y = mouse.click_y - mouse.y;
				var distance = Math.sqrt((dist_x * dist_x) + (dist_y * dist_y));
				var radgrad = canvas_active().createRadialGradient(
					mouse.click_x, mouse.click_y, distance * power / 100,
					mouse.click_x, mouse.click_y, distance);
				radgrad.addColorStop(0, "rgba(" + color1.r + ", " + color1.g + ", " + color1.b + ", " + color1.a / 255 + ")");
				radgrad.addColorStop(1, "rgba(" + color2.r + ", " + color2.g + ", " + color2.b + ", " + color2.a / 255 + ")");

				canvas_active().fillStyle = radgrad;
				canvas_active().fillRect(0, 0, WIDTH, HEIGHT);
			}
		}
	};


	this.crop_tool = function (type, mouse, event) {
		if (mouse.click_valid == false)
			return true;
		
		if (type == 'drag') {
			if (mouse.x < 0)
				mouse.x = 0;
			if (mouse.y < 0)
				mouse.y = 0;
			if (mouse.x >= WIDTH)
				mouse.x = WIDTH;
			if (mouse.y >= HEIGHT)
				mouse.y = HEIGHT;
			if (mouse.click_x >= WIDTH)
				mouse.click_x = WIDTH;
			if (mouse.click_y >= HEIGHT)
				mouse.click_y = HEIGHT;
			if (this.select_square_action == '') {
				document.body.style.cursor = "crosshair";
				canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
				canvas_front.fillStyle = "rgba(0, 255, 0, 0.3)";
				canvas_front.fillRect(mouse.click_x, mouse.click_y, mouse.x - mouse.click_x, mouse.y - mouse.click_y);
			}
		}
		else if (type == 'move' && this.select_data != false) {
			if (EVENTS.isDrag == true)
				return true;
			canvas_front.lineWidth = 1;
			border_size = 5;
			this.select_square_action = '';

			if (this.select_square_action == ''
				&& mouse.x > this.select_data.x && mouse.y > this.select_data.y
				&& mouse.x < this.select_data.x + this.select_data.w && mouse.y < this.select_data.y + this.select_data.h) {
				this.select_square_action = 'move';
				document.body.style.cursor = 'pointer';
			}
			if (this.select_square_action == '' && mouse.valid == true)
				document.body.style.cursor = "auto";
		}
		else if (type == 'release') {
			if (mouse.x < 0)
				mouse.x = 0;
			if (mouse.y < 0)
				mouse.y = 0;
			if (mouse.x >= WIDTH)
				mouse.x = WIDTH;
			if (mouse.y >= HEIGHT)
				mouse.y = HEIGHT;
			if (mouse.click_x >= WIDTH)
				mouse.click_x = WIDTH;
			if (mouse.click_y >= HEIGHT)
				mouse.click_y = HEIGHT;

			if (this.select_square_action == '') {
				if (mouse.x != mouse.click_x && mouse.y != mouse.click_y) {
					this.select_data = {
						x: Math.min(mouse.x, mouse.click_x),
						y: Math.min(mouse.y, mouse.click_y),
						w: Math.abs(mouse.x - mouse.click_x),
						h: Math.abs(mouse.y - mouse.click_y)
					};
				}
			}
			GUI.draw_selected_area(true);
			//modify:select with crop
			IMAGE.image_crop();
			LAYER.update_info_block();
		}
		else if (type == 'click' && this.select_data != false) {
			document.body.style.cursor = "auto";
			if (mouse.x > this.select_data.x && mouse.y > this.select_data.y
				&& mouse.x < this.select_data.x + this.select_data.w && mouse.y < this.select_data.y + this.select_data.h) {
				EDIT.save_state();
				for (var i in LAYER.layers) {
					var layer = document.getElementById(LAYER.layers[i].name).getContext("2d");
					var tmp = layer.getImageData(this.select_data.x, this.select_data.y, this.select_data.w, this.select_data.h);
					layer.clearRect(0, 0, WIDTH, HEIGHT);
					layer.putImageData(tmp, 0, 0);
					
				}
				
				//resize
				WIDTH = this.select_data.w;
				HEIGHT = this.select_data.h;
				LAYER.set_canvas_size();
				EDIT.edit_clear();
			}
		}
	};


	this.clone_tool = function (type, mouse, event) {
		if (mouse.valid == false)
			return true;
		var size = GUI.action_data().attributes.size;
		var size_half = Math.round(size / 2);

		if (type == 'click') {
			EDIT.save_state();

			if (clone_data === false) {
				POP.add({html: 'Source is empty, right click on image first.'});
				POP.show('Error', '');
			}
			else {
				//draw rounded image
				EL.image_round(canvas_active(), mouse.x, mouse.y, size, clone_data, document.getElementById("canvas_front"), GUI.action_data().attributes.anti_aliasing);
			}
		}
		else if (type == 'right_click') {
			//save clone source
			clone_data = document.createElement("canvas");
			clone_data.width = size;
			clone_data.height = size;
			var xx = mouse.x - size_half;
			var yy = mouse.y - size_half;
			if (xx < 0)
				xx = 0;
			if (yy < 0)
				yy = 0;
			clone_data.getContext("2d").drawImage(canvas_active(true), xx, yy, size, size, 0, 0, size, size);
			return false;
		}
		else if (type == 'drag') {
			if (event.which == 3)
				return true;
			if (clone_data === false)
				return false;	//no source

			//draw rounded image
			EL.image_round(canvas_active(), mouse.x, mouse.y, size, clone_data, document.getElementById("canvas_front"), GUI.action_data().attributes.anti_aliasing);
		}
		else if (type == 'move') {
			//show size
			canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
			EL.circle(canvas_front, mouse.x, mouse.y, size);
		}
	};

	this.select_square = function (type, mouse, event) {
		if (mouse.click_valid == false)
			return true;
		if (type == 'drag') {
			if (mouse.x < 0)
				mouse.x = 0;
			if (mouse.y < 0)
				mouse.y = 0;
			if (mouse.x >= WIDTH)
				mouse.x = WIDTH;
			if (mouse.y >= HEIGHT)
				mouse.y = HEIGHT;
			if (mouse.click_x >= WIDTH)
				mouse.click_x = WIDTH;
			if (mouse.click_y >= HEIGHT)
				mouse.click_y = HEIGHT;
			if (this.select_square_action == '') {
				//user still selecting area
				document.body.style.cursor = "crosshair";
				canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
				canvas_front.fillStyle = "rgba(0, 255, 0, 0.3)";
				canvas_front.fillRect(mouse.click_x, mouse.click_y, mouse.x - mouse.click_x, mouse.y - mouse.click_y);
			}
			else {
				//drag
				if (this.select_square_action == 'move') {
					//move
					try {
						canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
						canvas_front.drawImage(canvas_active(true),
							this.select_data.x, this.select_data.y, this.select_data.w, this.select_data.h,
							mouse.x - mouse.click_x + this.select_data.x,
							mouse.y - mouse.click_y + this.select_data.y,
							this.select_data.w,
							this.select_data.h);
						canvas_front.restore();
					}
					catch (err) {
						console.log("Error: " + err.message);
					}
				}
				else {
					//resize
					var s_x = this.select_data.x;
					var s_y = this.select_data.y;
					var d_x = this.select_data.w;
					var d_y = this.select_data.h;
					if (this.select_square_action == 'resize-left') {
						s_x += mouse.x - mouse.click_x;
						d_x -= mouse.x - mouse.click_x;
					}
					else if (this.select_square_action == 'resize-right')
						d_x += mouse.x - mouse.click_x;
					else if (this.select_square_action == 'resize-top') {
						s_y += mouse.y - mouse.click_y;
						d_y -= mouse.y - mouse.click_y;
					}
					else if (this.select_square_action == 'resize-bottom')
						d_y += mouse.y - mouse.click_y;
					else if (this.select_square_action == 'resize-1') {
						s_x += mouse.x - mouse.click_x;
						s_y += mouse.y - mouse.click_y;
						d_x -= mouse.x - mouse.click_x;
						d_y -= mouse.y - mouse.click_y;
					}
					else if (this.select_square_action == 'resize-2') {
						d_x += mouse.x - mouse.click_x;
						s_y += mouse.y - mouse.click_y;
						d_y -= mouse.y - mouse.click_y;
					}
					else if (this.select_square_action == 'resize-3') {
						d_x += mouse.x - mouse.click_x;
						d_y += mouse.y - mouse.click_y;
					}
					else if (this.select_square_action == 'resize-4') {
						s_x += mouse.x - mouse.click_x;
						d_x -= mouse.x - mouse.click_x;
						d_y += mouse.y - mouse.click_y;
					}
					var s_x = Math.max(s_x, 0);
					var s_y = Math.max(s_y, 0);
					var d_x = Math.max(d_x, 0);
					var d_y = Math.max(d_y, 0);

					canvas_front.save();
					canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
					
					canvas_front.webkitImageSmoothingEnabled = false;
					canvas_front.msImageSmoothingEnabled = false;
					canvas_front.imageSmoothingEnabled = false;
					
					canvas_front.drawImage(canvas_active(true),
						this.select_data.x, this.select_data.y, this.select_data.w, this.select_data.h,
						s_x, s_y, d_x, d_y);
					canvas_front.restore();
				}
			}
		}
		else if (type == 'move' && this.select_data != false) {
			if (EVENTS.isDrag == true)
				return true;
			canvas_front.lineWidth = 1;
			border_size = 5;
			this.select_square_action = '';
			var sr_size = Math.ceil(EVENTS.sr_size / GUI.ZOOM * 100);

			//left
			if (this.check_mouse_pos(this.select_data.x, this.select_data.y + this.select_data.h / 2, sr_size, mouse.x, mouse.y) == true) {
				document.body.style.cursor = "w-resize";
				this.select_square_action = 'resize-left';
			}
			//top
			else if (this.check_mouse_pos(this.select_data.x + this.select_data.w / 2, this.select_data.y, sr_size, mouse.x, mouse.y) == true) {
				document.body.style.cursor = "n-resize";
				this.select_square_action = 'resize-top';
			}
			//right
			else if (this.check_mouse_pos(this.select_data.x + this.select_data.w - sr_size, this.select_data.y + this.select_data.h / 2, sr_size, mouse.x, mouse.y) == true) {
				document.body.style.cursor = "w-resize";
				this.select_square_action = 'resize-right';
			}
			//bottom
			else if (this.check_mouse_pos(this.select_data.x + this.select_data.w / 2, this.select_data.y + this.select_data.h - sr_size, sr_size, mouse.x, mouse.y) == true) {
				document.body.style.cursor = "n-resize";
				this.select_square_action = 'resize-bottom';
			}

			//corner 1
			if (this.check_mouse_pos(this.select_data.x, this.select_data.y, sr_size, mouse.x, mouse.y) == true) {
				document.body.style.cursor = "nw-resize";
				this.select_square_action = 'resize-1';
			}
			//corner 2
			else if (this.check_mouse_pos(this.select_data.x + this.select_data.w - sr_size, this.select_data.y, sr_size, mouse.x, mouse.y) == true) {
				document.body.style.cursor = "ne-resize";
				this.select_square_action = 'resize-2';
			}
			//corner 3
			else if (this.check_mouse_pos(this.select_data.x + this.select_data.w - sr_size, this.select_data.y + this.select_data.h - sr_size, sr_size, mouse.x, mouse.y) == true) {
				document.body.style.cursor = "nw-resize";
				this.select_square_action = 'resize-3';
			}
			//corner 4
			else if (this.check_mouse_pos(this.select_data.x, this.select_data.y + this.select_data.h - sr_size, sr_size, mouse.x, mouse.y) == true) {
				document.body.style.cursor = "ne-resize";
				this.select_square_action = 'resize-4';
			}

			if (this.select_square_action == ''
				&& mouse.x > this.select_data.x && mouse.y > this.select_data.y
				&& mouse.x < this.select_data.x + this.select_data.w && mouse.y < this.select_data.y + this.select_data.h) {
				this.select_square_action = 'move';
				document.body.style.cursor = "move";
			}
			if (this.select_square_action == '' && mouse.valid == true)
				document.body.style.cursor = "auto";
		}
		else if (type == 'release') {
			if (mouse.x < 0)
				mouse.x = 0;
			if (mouse.y < 0)
				mouse.y = 0;
			if (mouse.x >= WIDTH)
				mouse.x = WIDTH;
			if (mouse.y >= HEIGHT)
				mouse.y = HEIGHT;
			if (mouse.click_x >= WIDTH)
				mouse.click_x = WIDTH;
			if (mouse.click_y >= HEIGHT)
				mouse.click_y = HEIGHT;

			if (this.select_square_action == '') {
				if (mouse.x != mouse.click_x && mouse.y != mouse.click_y) {
					this.select_data = {
						x: Math.min(mouse.x, mouse.click_x),
						y: Math.min(mouse.y, mouse.click_y),
						w: Math.abs(mouse.x - mouse.click_x),
						h: Math.abs(mouse.y - mouse.click_y)
					};
				}
			}
			else {
				if (mouse.x - mouse.click_x == 0 && mouse.y - mouse.click_y == 0)
					return false;				
				EDIT.save_state();
				
				if (this.select_square_action == 'move') {
					//move selected area
					if (this.select_data != false) {
						canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
						canvas_front.drawImage(canvas_active(true), 0, 0);
						canvas_active().clearRect(this.select_data.x, this.select_data.y, this.select_data.w, this.select_data.h);
						canvas_active().drawImage(
							document.getElementById("canvas_front"),
							this.select_data.x, this.select_data.y,
							this.select_data.w, this.select_data.h,
							mouse.x - mouse.click_x + this.select_data.x, mouse.y - mouse.click_y + this.select_data.y,
							this.select_data.w, this.select_data.h);
							
						canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
					}
					this.select_data.x += mouse.x - mouse.click_x;
					this.select_data.y += mouse.y - mouse.click_y;
				}
				else {
					//resize selected area
					var s_x = this.select_data.x;
					var s_y = this.select_data.y;
					var d_x = this.select_data.w;
					var d_y = this.select_data.h;

					if (this.select_square_action == 'resize-left') {
						s_x += mouse.x - mouse.click_x;
						d_x -= mouse.x - mouse.click_x;
					}
					else if (this.select_square_action == 'resize-right')
						d_x += mouse.x - mouse.click_x;
					else if (this.select_square_action == 'resize-top') {
						s_y += mouse.y - mouse.click_y;
						d_y -= mouse.y - mouse.click_y;
					}
					else if (this.select_square_action == 'resize-bottom')
						d_y += mouse.y - mouse.click_y;
					else if (this.select_square_action == 'resize-1') {
						s_x += mouse.x - mouse.click_x;
						s_y += mouse.y - mouse.click_y;
						d_x -= mouse.x - mouse.click_x;
						d_y -= mouse.y - mouse.click_y;
					}
					else if (this.select_square_action == 'resize-2') {
						d_x += mouse.x - mouse.click_x;
						s_y += mouse.y - mouse.click_y;
						d_y -= mouse.y - mouse.click_y;
					}
					else if (this.select_square_action == 'resize-3') {
						d_x += mouse.x - mouse.click_x;
						d_y += mouse.y - mouse.click_y;
					}
					else if (this.select_square_action == 'resize-4') {
						s_x += mouse.x - mouse.click_x;
						d_x -= mouse.x - mouse.click_x;
						d_y += mouse.y - mouse.click_y;
					}
					var s_x = Math.max(s_x, 0);
					var s_y = Math.max(s_y, 0);
					var d_x = Math.max(d_x, 0);
					var d_y = Math.max(d_y, 0);

					var tempCanvas = document.createElement("canvas");
					var tempCtx = tempCanvas.getContext("2d");
					tempCanvas.width = Math.max(d_x, this.select_data.w);
					tempCanvas.height = Math.max(d_y, this.select_data.h);
					tempCtx.drawImage(canvas_active(true), this.select_data.x, this.select_data.y, this.select_data.w, this.select_data.h, 0, 0, this.select_data.w, this.select_data.h);

					canvas_active().clearRect(s_x, s_y, d_x, d_y);
					canvas_active().drawImage(tempCanvas, 0, 0, this.select_data.w, this.select_data.h, s_x, s_y, d_x, d_y);

					this.select_data.x = s_x;
					this.select_data.y = s_y;
					this.select_data.w = d_x;
					this.select_data.h = d_y;
				}
			}
			GUI.draw_selected_area();
			LAYER.update_info_block();
		}
	};

	this.check_mouse_pos = function (x, y, size, mouse_x, mouse_y) {
		if (mouse_x > x - Math.round(size) && mouse_x < x + Math.round(size))
			if (mouse_y > y - Math.round(size) && mouse_y < y + Math.round(size))
				return true;
		return false;
	};

}