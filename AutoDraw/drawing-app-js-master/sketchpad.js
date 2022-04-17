var canvas, canvas2, dataURL, context, context2, dragging, x, y, brushColor, bgFillColor,
    radius = 10, cPushArray = new Array(), cStep = -1,
    mouseup = false, mousedown = false, eraserOn = false, brushOn = false,
    bgFillOn = false,brushOn2=false;

init();




function init() {
    var toolbarHeight, toolbar;
    canvas = document.getElementById('myCanvas');
    canvas2 = document.getElementById('myCanvas2');

    toolbar = document.getElementById('toolbar');
    toolbarHeight = toolbar.offsetHeight;
    //canvas.width = 1000; //window.innerWidth;
    //canvas.height = 550; //window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - toolbarHeight;
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight - toolbarHeight;

    dataURL = canvas.toDataURL();
    context = canvas.getContext('2d');
    context2 = canvas2.getContext('2d');






    dragging = false;
    context.lineWidth = (radius * 2);

    deselectTool();

    // Set Brush tool by default
    var brushButton = document.getElementById('brush');
    brushOn = true;
    brushButton.className += ' set';


    // setBrush();
    addSwatches();
    storeSnapshot();
}

function storeSnapshot() {
    cStep++;
    if (cStep < cPushArray.length) {
        cPushArray.length = cStep;
    }
    cPushArray.push(canvas.toDataURL());
}

//Puts a circle down wherever the user clicks
var putPoint = (e) => {
    if (dragging && !bgFillOn) {
        // x = e.clientX - canvas.offsetLeft-165;
        x = e.offsetX;
        // y = e.clientY - canvas.offsetTop-60;
        y = e.offsetY;
        //context.lineTo(e.clientX - 174, e.clientY - 50);
        context.lineTo(x, y);

        context.stroke();
        context.beginPath();
        if (eraserOn == true) {
            context.globalCompositeOperation = "destination-out";
        } else {
            context.globalCompositeOperation = "source-over";
        }
        //context.arc(e.clientX - 174, e.clientY - 50, radius, 0, 2 * Math.PI);
        context.arc(x, y, radius, 0, 2 * Math.PI);

        context.fill();
        context.beginPath();
        //context.moveTo(e.clientX - 174, e.clientY - 50);
        context.moveTo(x, y);
    }
}
var engage = (e) => {
    canvas.addEventListener('mousemove', putPoint);

    if (bgFillOn) {
        context.fillStyle = bgFillColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

    }
    if (brushOn || eraserOn || brushOn2) {
        dragging = true;
        putPoint(e);
    }
    if (brushOn2) {
        var x = document.getElementById('hide1');
        var y = document.getElementById('hide2');
        x.style.display = "block";
        y.style.display = "block";

    }
    if (!brushOn2) {
        var x = document.getElementById('hide1');
        var y = document.getElementById('hide2');
        x.style.display = "none";
        y.style.display = "none";
    }

}

var disengage = () => {
    dragging = false;

    mouseup = true;
    mousedown = false;
    context.beginPath();

    if (eraserOn == true) {
        context.globalCompositeOperation = "source-over";
    }
    storeSnapshot();
}

/*document.documentElement.addEventListener('mouseout', function (e) {
    var str = "pressed Mouse leaving ";
    console.log(str);
    if (!mousedown && e.target == canvas) {
        console.log('Mouse is up now');
    } 
});

document.documentElement.addEventListener('mouseup', function (e) {
    mousedown = false;
    console.log('mouse is up');
});*/


canvas.addEventListener('mousedown', engage);
canvas.addEventListener('mouseup', disengage);
canvas.addEventListener('mouseup', box)


function box() {
    if (brushOn2) {
        var bounds = contextBoundingBox(context);
        context.save();
        context.lineWidth = "1";
        context.strokeStyle = "blue";
        context.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
        context.restore();
        var datastream = context.getImageData(bounds.x, bounds.y, bounds.w, bounds.h);
        console.log(datastream.data);
        for (i = 0; i < datastream.data.length; i += 4) {
            let count = datastream.data[i] + datastream.data[i + 1] + datastream.data[i + 2];
            let colour = 0;
            if (count > 383) colour = 255;

            datastream.data[i] = colour;
            datastream.data[i + 1] = colour;
            datastream.data[i + 2] = colour;
            datastream.data[i + 3] = 255;
        }
        console.log(datastream.data);
        //context.putImageData(datastream, 0, 0);
        const myJSON = JSON.stringify(datastream.data);

        var url = 'https://inputtools.google.com/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8';
        fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            }),
            body: myJSON,
        }).then(function (response) {
            return response.json();
        })
            //.then(function (jsonResponse) {
            //console.log(jsonResponse);
            //displaySuggestions(jsonResponse[1][0][1]);
            // })
            ;
        /*
        const resp = fetch('https://inputtools.google.com/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8',
            {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: myJSON
            })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                console.log("result");
            })

            ;*/


    }
}







// context.clearRect(bounds.x, bounds.y, bounds.w, bounds.h);
// context.restore();
//cUndo();

//canvas.addEventListener('mousemove', putPoint);

/* When mouse leaves the canvas and mouse lets up, disengage the mouse

*/

/* Disengage on mouseleave && mouseup */
//canvas.addEventListener('mouseleave', console.log("mouse leave"));

/*Tool Bar Script*/
var minRad = 0.5,
    maxRad = 100,
    defaultRad = 20,
    interval = 5,
    radSpan = document.getElementById('radval'),
    decRad = document.getElementById('decrad'),
    incRad = document.getElementById('incrad');

var setRadius = (newRadius) => {
    if (newRadius < minRad)
        newRadius = minRad
    else if (newRadius > maxRad)
        newRadius = maxRad;
    radius = newRadius;
    context.lineWidth = radius * 2;
    radSpan.innerHTML = radius;
}

// Decrease radius of drawing tool
decRad.addEventListener('click', () => {
    setRadius(radius - interval);
});

// Increase radius of drawing tool
incRad.addEventListener('click', () => {
    if (radius % 1 !== 0) {
        setRadius(parseInt(radius) + interval);
    } else {
        setRadius(radius + interval);
    }
});

function addSwatches() {
    var colors = ['black', 'maroon', 'grey', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'brown', 'pink', 'teal'];
    // var swatches = document.getElementsByClassName('swatch');
    for (var i = 0, n = colors.length; i < n; i++) {
        var swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = colors[i];
        swatch.addEventListener('click', setSwatch);
        document.getElementById('colors').appendChild(swatch);
    }
}

function setColor(color) {
    context.fillStyle = color;
    context.strokeStyle = color;
    bgFillColor = color;
    brushColor = color;

    var active = document.getElementsByClassName('active')[0];
    if (active) {
        active.className = 'swatch';
    }
}

function setSwatch(e) {
    //identify swatch being clicked
    if (!eraserOn) {
        var swatch = e.target;
        setColor(swatch.style.backgroundColor);
        swatch.className += ' active';

        // Refactor this - remove class 'set' from all elements with drawTool class.
        var eraser = document.getElementById('eraser');
        eraser.classList.remove('set');

    }
}

// sets first swatch as selected
setSwatch({
    target: document.getElementsByClassName('swatch')[0]
});



function deselectTool() {
    // Remove set class from other draw tools
    var drawTools = document.querySelectorAll(".drawTool");

    [].forEach.call(drawTools, function (el) {
        el.classList.remove('set');
    });
}


/* Brush */
var brushButton = document.getElementById('brush');
brushButton.addEventListener('click', setBrush);

function setBrush() {
    eraserOn = false;
    bgFillOn = false;
    brushOn = true;
    isDrawing = false;
    brushOn2 = false;

    /*Select current swatch */
    deselectTool();
    clicked = false;

    if (!brushButton.classList.contains('set')) {
        brushButton.className += ' set';
        /*var active = document.getElementsByClassName('active')[0];
        if (active) {
            active.className = 'swatch';
        }*/
    }
}
/* Brush */
var brushButton2 = document.getElementById('brush2');
brushButton2.addEventListener('click', setBrush2);

function setBrush2() {
    eraserOn = false;
    bgFillOn = false;
    brushOn = false;
    isDrawing = false;
    brushOn2 = true;

    /*Select current swatch */
    deselectTool();

    if (!brushButton2.classList.contains('set')) {
        brushButton2.className += ' set';
        
        /*var active = document.getElementsByClassName('active')[0];
        if (active) {
            active.className = 'swatch';
        }*/
    }
}

/* Background Fill */
var fillButton = document.getElementById('filldrip');
fillButton.addEventListener('click', setBackgroundFill);

function setBackgroundFill(e) {
    eraserOn = false;
    bgFillOn = true;
    isDrawing = false;
    deselectTool();

    //var bgFill = document.getElementById('filldrip');
    if (!fillButton.classList.contains('set')) {
        fillButton.className += ' set';
        var active = document.getElementsByClassName('active')[0];
        if (active) {
            //  active.className = 'swatch';
        }

    }
    // alert('Fill the background');
}
//select
/*
var selectButton = document.getElementById('selectCanvas');
selectButton.addEventListener('click', setselect);

function setselect(e) {
    eraserOn = false;
    bgFillOn = false;
    brushOn = false;
    isDrawing = true;
    deselectTool()
    clicked = true;

    var sel = document.getElementById('selectCanvas');
    if (!sel.classList.contains('set')) {
        sel.className += ' set';
        if (clicked == true) {
            select();
        }
        
    }
}
*/

/* Erase */
var eraserButton = document.getElementById('eraser');
eraserButton.addEventListener('click', setEraser);

function setEraser(e) {
    eraserOn = true;
    bgFillOn = false;
    brushOn = false;
    isDrawing = false;
    deselectTool()

    var eraser = document.getElementById('eraser');
    if (!eraser.classList.contains('set')) {

        eraser.className += ' set';
        var active = document.getElementsByClassName('active')[0];
        if (active) {
            active.className = 'swatch';
        }
    }
}


/* Clear Canvas */
var clearButton = document.getElementById('clearCanvas');
clearButton.addEventListener('click', clearCanvas);

function clearCanvas(e) {
    storeSnapshot();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context2.clearRect(0, 0, canvas.width, canvas.height);

}

/* Undo */
var undoButton = document.getElementById('undo')
undoButton.addEventListener('click', cUndo);

function cUndo() {
    var canvasPic = new Image();
    if (cStep > 0) {
        cStep--;
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(canvasPic, 0, 0);
        }

    } else {
        canvasPic.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(canvasPic.src, 0, 0);
        }
    }
}

/* Redo */
var restoreButton = document.getElementById('restore');
restoreButton.addEventListener('click', restoreCanvas);

function restoreCanvas(e) {
    if (cStep >= 0 && (cStep < cPushArray.length - 1)) {
        cStep++;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(canvasPic, 0, 0);
        }
    }
}

document.onkeydown = KeyPress;


/* This is the function that will take care of image extracting and
 * setting proper filename for the download.
 * IMPORTANT: Call it from within a onclick event.
 */
function downloadCanvas(link, canvasId, context, context2, filename) {
    context.drawImage(canvas2, 0, 0);
    link.href = document.getElementById(canvasId).toDataURL();
    console.log(link.href);
    link.download = filename;
}

/** 
 * The event handler for the link's onclick event. We give THIS as a
 * parameter (=the link element), ID of the canvas and a filename.
 */
document.getElementById('save').addEventListener('click', function () {
    downloadCanvas(this, 'myCanvas', context, context2, 'Drawing.png');

}, false);


/* Undo/Redo on KeyPress */
function KeyPress(e) {
    var evtobj = window.event ? event : e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
        cUndo();
    } else if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
        restoreCanvas();
    }
}

/*function myfunction() {
    document.getElementById('colors').style.opacity = 1;
}*/

//colors display
function myfunction() {
    var x = document.getElementById("colors");
    if (x.style.display === "none") {
        x.style.display = "flex";
        x.style.flexDirection = "column";
        x.style.alignContent = "center";
    }
    else {
        x.style.display = "none";
    }
}





var img = document.getElementById('mno');
img.addEventListener('click', func);

//put image on click
function func(e) {
    storeSnapshot();
    var bounds = contextBoundingBox(context);
    context.clearRect(bounds.x, bounds.y, (bounds.w) + 1, (bounds.h) + 1);
    // context2.drawImage(img, bounds.x, bounds.y, bounds.w, bounds.h);
    context2.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);

}


//get area of drawing
function contextBoundingBox(context, alphaThreshold) {
    if (alphaThreshold === undefined) alphaThreshold = 15;
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    var w = context.canvas.width, h = context.canvas.height;
    var data = context.getImageData(0, 0, w, h).data;
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



//var sel_tool = document.getElementById('selectCanvas');
//sel_tool.addEventListener('click', select);
//select tool

/*
function clearOverlay() {
   
    var canvasPic = new Image();
    canvasPic.src = cPushArray[cStep];
    context2.clearRect(0, 0, canvas2.width, canvas2.height);
    canvasPic.onload = function () {
        //context.clearRect(0, 0, canvas.width, canvas.height);
        context2.drawImage(canvasPic, 0, 0);
    }
   
}




canvas.addEventListener('contextmenu', e =>{
    console.log(clicked);
}
)

function select() {
   
    var startX = 0, startY = 0;
   
        // Add mouse events
        canvas2.addEventListener('mousedown', e => {
            startX = e.offsetX;
            startY = e.offsetY;
            isDrawing = true;
            clearOverlay();
            canvas2.style.cursor = "crosshair";
        });



        canvas2.addEventListener('mouseup', e => {
           
                clearOverlay();
                context2.strokeStyle = '#ff0000';
                context2.lineWidth = 1;
                context2.beginPath();
                context2.rect(startX, startY, e.offsetX - startX, e.offsetY - startY);
                context2.stroke();
                isDrawing = false;
                // region.innerHTML = "Decode a region: (" + startX + ", " + startY + ", " + e.offsetX + ", " + e.offsetY + "). ";
                canvas2.style.cursor = "default";

           
        });
   
};
*/



