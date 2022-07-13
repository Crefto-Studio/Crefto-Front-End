/**
 * main config file
 * 
 * @author ViliusL
 */

//canvas layers
var canvas_back = document.getElementById("canvas_back").getContext("2d");		//layer for grid/transparency
var canvas_front = document.getElementById("canvas_front").getContext("2d");		//tmp layer
var canvas_grid = document.getElementById("canvas_grid").getContext("2d");		//grid layer
var canvas_preview = document.getElementById("canvas_preview").getContext("2d");	//mini preview


//global settings
var VERSION = '3.3.6';
var WIDTH;						//canvas midth
var HEIGHT;						//canvas height
var COLOR = '#0000ff';				//active color
var ALPHA = 255;					//active color alpha
var LANG = 'zh';					//active language

//cancel: remove draw elements in left menu
var DRAW_TOOLS_CONFIG = [
	{name: 'select_tool', 	title: 'Select object tool',	icon: ['sprites.png', 0+7, 2],	attributes: {}		},
	{name: 'select_square', title: 'Select area tool', 	icon: ['sprites.png', -50+4, 5],	attributes: {}		},
	{ name: 'letters', title: 'Draw letters', icon: ['sprites.png', -350 + 3, 4], attributes: {} },
	{ name: 'clone_tool', title: 'Clone tool', icon: ['sprites.png', -450 + 3, -100 + 3],attributes: {size: 30, anti_aliasing: true}	},
	{ name: 'gradient_tool', title: 'Gradient', icon: ['sprites.png', -450 + 3, -100 + 3],attributes: {radial: false, power: 50}	},
	{ name: 'crop_tool', title: 'Crop', icon: ['sprites.png', -450 + 2, -50 + 2], attributes: {} },
];
