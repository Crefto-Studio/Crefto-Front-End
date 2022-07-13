/* global POP, MAIN, SIFT, LAYER, IMAGE, EVENTS, HELPER, EDIT, GUI, EL */
/* global WIDTH, HEIGHT, COLOR, canvas_active */

var TOOLS = new TOOLS_CLASS();

/** 
 * manages various tools
 * 
 * @author ViliusL
 */
function TOOLS_CLASS() {

	
	//adds borders
	this.tools_borders = function () {
		POP.add({name: "color", title: "Color:", value: COLOR, type: 'color'});
		POP.add({name: "shadow", title: "Shadow:", values: ["No", "Yes"]});
		POP.add({ name: "size", title: "Size:", value: "5", range: [1, 100] });

		POP.show(
			'Borders',
			function (user_response) {
				EDIT.save_state();
				var color = user_response.color;
				var size = Math.round(WIDTH / 100 * user_response.size);
				var shadow = false;
				if(user_response.shadow == 'Yes')
					shadow = true;
				
				TOOLS.add_borders(canvas_active(), WIDTH, HEIGHT, color, size, shadow);
				GUI.zoom();
				
			},
			function (user_response, canvas_preview, w, h) {
				var color = user_response.color;
				var size = Math.round(w / 100 * user_response.size);
				var shadow = false;
				if(user_response.shadow == 'Yes')
					shadow = true;
				
				TOOLS.add_borders(canvas_preview, w, h, color, size, shadow);
				
			}
		);
	};

	this.add_borders = function (context, W, H, color, size, shadow) {
		context.save();
		if (shadow == true) {
			//with shadow
			context.beginPath();
			context.lineWidth = size;
			context.strokeStyle = 'green';
			context.shadowColor = color;
			context.shadowBlur = size / 2;
			context.rect(-size / 2, -size / 2, W + size, H + size);
			context.stroke();
			context.stroke();
			context.stroke();
			context.stroke();
			context.stroke();
		}
		else {
			context.strokeStyle = color;
			context.lineWidth = size;
			EL.rectangle(context, 0, 0, W - 1, H - 1, false, true);
		}
		context.restore();
	};

}