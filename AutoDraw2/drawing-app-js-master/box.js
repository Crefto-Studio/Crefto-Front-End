var can = document.getElementById('myCanvas'),
	ctx = can.getContext('2d'),
	ms = document.querySelector('#ms'),
	path = [];
window.onresize = resize;
can.addEventListener('mousedown', startDrawing, false);
resize();

function resize() {
	can.width = can.offsetWidth;
	can.height = can.offsetHeight;
	redraw();
}

function startDrawing(e) {
	path.length = 0;
	addPt(e);
	can.addEventListener('mousemove', addToDrawing, false);
	can.addEventListener('mouseup', function () {
		can.removeEventListener('mousemove', addToDrawing, false);
	}, false);
}
function addToDrawing(e) {
	addPt(e);
	redraw();
};

function addPt(e) { path.push([e.layerX, e.layerY]); }

function redraw() {
	ctx.clearRect(0, 0, can.width, can.height);
	if (!path.length) return;
	ctx.beginPath();
	ctx.moveTo.apply(ctx, path[0]);
	for (var i = 1, len = path.length; i < len; ++i) ctx.lineTo.apply(ctx, path[i]);
	ctx.strokeStyle = '#000';
	ctx.stroke();
	var start = new Date;
	var bounds = contextBoundingBox(ctx);
	ms.value = ms.value * 1 + Math.round(((new Date) - start - ms.value) / 4);
	ctx.strokeStyle = '#c00';
	ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
}

function contextBoundingBox(ctx, alphaThreshold) {
	if (alphaThreshold === undefined) alphaThreshold = 15;
	var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
	var w = ctx.canvas.width, h = ctx.canvas.height;
	var data = ctx.getImageData(0, 0, w, h).data;
	for (var x = 0; x < w; ++x) {
		for (var y = 0; y < h; ++y) {
			var a = data[(w * y + x) * 4 + 3];
			if (a > alphaThreshold) {
				if (x > maxX) maxX = x;
				if (x < minX) minX = x;
				if (y > maxY) maxY = y;
				if (y < minY) minY = y;
			}
		}
	}
	return { x: minX, y: minY, maxX: maxX, maxY: maxY, w: maxX - minX, h: maxY - minY };
}


