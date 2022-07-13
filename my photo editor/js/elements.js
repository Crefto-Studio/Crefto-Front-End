/* global WIDTH, HEIGHT */

var EL = new ELEMENTS_CLASS();

/**
 * class that draw simple elements
 * 
 * @author ViliusL
 */
function ELEMENTS_CLASS() {


	//draws rectangle:usd in borders
	this.rectangle = function (ctx, x, y, width, height, fill, stroke) {
		x = x + 0.5;
		y = y + 0.5;
		if (typeof stroke == "undefined")
			stroke = true;
		if(fill == false && stroke == undefined)
			stroke = true;
		
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + width, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y);
		ctx.lineTo(x + width, y + height);
		ctx.quadraticCurveTo(x + width, y + height, x + width, y + height);
		ctx.lineTo(x, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height);
		ctx.lineTo(x, y);
		ctx.quadraticCurveTo(x, y, x, y);
		ctx.closePath();
		if (stroke) {
			ctx.stroke();
		}
		if (fill) {
			ctx.fill();
		}
	};
	

	// used in clone option
	this.circle = function (ctx, x, y, size, color) {
		ctx.lineWidth = 1;
		if(color != undefined)
			ctx.strokeStyle = color;
		else
			ctx.strokeStyle = "#000000";
			
		ctx.beginPath();
		ctx.arc(x, y, size / 2, 0, Math.PI * 2, true);
		ctx.stroke();
	};

	
	//used in clone option
	this.image_round = function (canvas, mouse_x, mouse_y, size, img_data, canvas_tmp, anti_aliasing) {
		var size_half = Math.round(size / 2);
		var ctx_tmp = canvas_tmp.getContext("2d");
		var xx = mouse_x - size_half;
		var yy = mouse_y - size_half;
		if (xx < 0)
			xx = 0;
		if (yy < 0)
			yy = 0;

		ctx_tmp.clearRect(0, 0, WIDTH, HEIGHT);
		ctx_tmp.save();
		//draw main data
		try {
			ctx_tmp.drawImage(img_data, mouse_x - size_half, mouse_y - size_half, size, size);
		}
		catch (err) {
			try {
				ctx_tmp.putImageData(img_data, xx, yy);
			}
			catch (err) {
				console.log("Error: " + err.message);
			}
		}
		ctx_tmp.globalCompositeOperation = 'destination-in';

		//create form
		ctx_tmp.fillStyle = '#ffffff';
		if (anti_aliasing == true) {
			var gradient = ctx_tmp.createRadialGradient(mouse_x, mouse_y, 0, mouse_x, mouse_y, size_half);
			gradient.addColorStop(0, '#ffffff');
			gradient.addColorStop(0.8, '#ffffff');
			gradient.addColorStop(1, 'rgba(255,255,255,0');
			ctx_tmp.fillStyle = gradient;
		}
		ctx_tmp.beginPath();
		ctx_tmp.arc(mouse_x, mouse_y, size_half, 0, 2 * Math.PI, true);
		ctx_tmp.fill();
		//draw final data
		if (xx + size > WIDTH)
			size = WIDTH - xx;
		if (yy + size > HEIGHT)
			size = HEIGHT - yy;
		canvas.drawImage(canvas_tmp, xx, yy, size, size, xx, yy, size, size);
		//reset
		ctx_tmp.restore();
		ctx_tmp.clearRect(0, 0, WIDTH, HEIGHT);
	};
}

//http://www.script-tutorials.com/html5-canvas-custom-brush1/
var BezierCurveBrush = {
	// inner variables
	iPrevX: 0,
	iPrevY: 0,
	points: null,
	// initialization function
	init: function () {
	},
	startCurve: function (x, y) {
		this.iPrevX = x;
		this.iPrevY = y;
		this.points = new Array();
	},
	getPoint: function (iLength, a) {
		var index = a.length - iLength, i;
		for (i = index; i < a.length; i++) {
			if (a[i]) {
				return a[i];
			}
		}
	},
	draw: function (ctx, color_rgb, x, y, size) {
		if (Math.abs(this.iPrevX - x) > 5 || Math.abs(this.iPrevY - y) > 5) {
			this.points.push([x, y]);

			// draw main path stroke
			ctx.beginPath();
			ctx.moveTo(this.iPrevX, this.iPrevY);
			ctx.lineTo(x, y);

			ctx.lineWidth = size;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.strokeStyle = 'rgba(' + color_rgb.r + ', ' + color_rgb.g + ', ' + color_rgb.b + ', 0.9)';
			ctx.stroke();
			ctx.closePath();

			// draw extra strokes
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(' + color_rgb.r + ', ' + color_rgb.g + ', ' + color_rgb.b + ', 0.2)';
			ctx.beginPath();
			var iStartPoint = this.getPoint(25, this.points);
			var iFirstPoint = this.getPoint(1, this.points);
			var iSecondPoint = this.getPoint(5, this.points);
			ctx.moveTo(iStartPoint[0], iStartPoint[1]);
			ctx.bezierCurveTo(iFirstPoint[0], iFirstPoint[1], iSecondPoint[0], iSecondPoint[1], x, y);
			ctx.stroke();
			ctx.closePath();

			this.iPrevX = x;
			this.iPrevY = y;
		}
	}
};