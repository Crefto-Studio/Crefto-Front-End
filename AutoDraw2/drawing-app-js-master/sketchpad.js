var canvas, canvas2,canvas_normal, dataURL, context, context2,context_normal, dragging, x, y, brushColor,
    radius = 10, cPushArray = new Array(),cPushArray2 = new Array(),cPushArray3 = new Array(), cStep = -1,
    mouseup = false, mousedown = false, eraserOn = false, brushOn = false,
    bgFillOn = false,brushOn2=false;

init();

function init() {
    var toolbarHeight, toolbar;
    //canvas for draw: smart draw
    canvas = document.getElementById('myCanvas');
    //canvas for normal draw
    canvas_normal = document.getElementById('myCanvas_normal');
    //canvas for o/p model
    canvas2 = document.getElementById('myCanvas2');

    toolbar = document.getElementById('toolbar');
    toolbarHeight = toolbar.offsetHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - toolbarHeight;
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight - toolbarHeight;
    canvas_normal.width=window.innerWidth;
    canvas_normal.height=window.innerHeight - toolbarHeight;

    dataURL = canvas.toDataURL();
    context = canvas.getContext('2d');
    context2 = canvas2.getContext('2d');
    context_normal=canvas_normal.getContext('2d');

    // var data = context.getImageData(0, 0, canvas.width, canvas.height);
    // console.log(data.data);
    
    dragging = false;
    context.lineWidth = (radius * 2);
    context_normal.lineWidth = (radius * 2);

    deselectTool();
    // Set Brush tool by default
    var brushButton = document.getElementById('brush');
    brushOn = true;
    brushButton.className += ' set';
    brushButton.parentElement.style.backgroundColor="#B87A00";
    // setBrush();
    addSwatches();
    storeSnapshot();
}

//store
function storeSnapshot() {
    cStep++;
    if (cStep < cPushArray.length) {
        cPushArray.length = cStep;
        cPushArray2.length = cStep;
        cPushArray3.length = cStep;
    }
    cPushArray.push(canvas.toDataURL());
    cPushArray2.push(canvas2.toDataURL());
    cPushArray3.push(canvas_normal.toDataURL());
}

//Puts a circle down wherever the user clicks
var putPoint = (e) => {
    if (dragging && !bgFillOn) {
        // x = e.clientX - canvas.offsetLeft-165;
        x = e.offsetX;
        // y = e.clientY - canvas.offsetTop-60;
        y = e.offsetY;
        //context.lineTo(e.clientX - 174, e.clientY - 50);
        if(brushOn||eraserOn){
            context_normal.lineTo(x, y);
            context_normal.stroke();
            context_normal.beginPath();
        }
        else{
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        }
        
        
        if (eraserOn == true) {
            context_normal.globalCompositeOperation = "destination-out";
        } 
        else if(brushOn){
            context_normal.globalCompositeOperation = "source-over";
        }
        else {
            context.globalCompositeOperation = "source-over";
        }
        //context.arc(e.clientX - 174, e.clientY - 50, radius, 0, 2 * Math.PI);
        if(brushOn||eraserOn){
           context_normal.arc(x, y, radius, 0, 2 * Math.PI);
           context_normal.fill();
           context_normal.beginPath();
            //context.moveTo(e.clientX - 174, e.clientY - 50);
           context_normal.moveTo(x, y); 
        }
        else{
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
        context.beginPath();
        //context.moveTo(e.clientX - 174, e.clientY - 50);
        context.moveTo(x, y);
        }
    }
}
var engage = (e) => {
    canvas.addEventListener('mousemove', putPoint);

    // if (bgFillOn) {
    //     context.fillStyle = bgFillColor;
    //     context.fillRect(0, 0, canvas.width, canvas.height);
    // }
    if(eraserOn ||brushOn){
        dragging = true;
        putPoint(e); 
    }
    if ( brushOn2) {
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
    context_normal.beginPath();

    if (eraserOn == true) {
        context_normal.globalCompositeOperation = "source-over";
    }
    storeSnapshot();
}


canvas.addEventListener('mousedown', engage);
canvas_normal.addEventListener('mousedown', engage);
canvas.addEventListener('mouseup', disengage);
canvas_normal.addEventListener('mouseup', engage);
canvas.addEventListener('mouseup', box)


function box() {
    if (brushOn2) {
        var bounds = contextBoundingBox(context);
        context.save();
        context.lineWidth = "1";
        context.strokeStyle = "rgba(0,0,0,0)";
        context.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
        context.restore();
        var datastream = context.getImageData(bounds.x, bounds.y, (bounds.w), (bounds.h));
        console.log("before:",datastream.data);

        var z = document.getElementsByClassName('swatch')[0];
        if (!z.classList.contains('active')) {

            for (i = 0; i < datastream.data.length; i += 4) {
                let count = datastream.data[i] + datastream.data[i + 1] + datastream.data[i + 2];
                let colour = 255;
                if (count == 0) colour = 0;

                datastream.data[i] = colour;
                datastream.data[i + 1] = colour;
                datastream.data[i + 2] = colour;
                datastream.data[i + 3] = 255;
            }
        }



        else {
            for (i = 0; i < datastream.data.length; i += 4) {
                if (datastream.data[i + 3] == 0) {
                    datastream.data[i] = datastream.data[i];
                    datastream.data[i + 1] = datastream.data[i + 1];
                    datastream.data[i + 2] = datastream.data[i + 2];
                    datastream.data[i + 3] = 255;
                }
                else {
                    datastream.data[i] =255- datastream.data[i];
                    datastream.data[i + 1] =255- datastream.data[i + 1];
                    datastream.data[i + 2] = 255-datastream.data[i + 2];
                    datastream.data[i + 3] = 255;

                }
            }
        }

        console.log(datastream.data);
       context2.putImageData(datastream, 0, 0);



        //remove alpha
        var res = datastream.data.filter(function (v, i) {
            return i % 4 != 3;
        });
        console.log(res);

        //remove blue
        var res2 = res.filter(function (v, i) {
            return i % 3 != 2;
        });
        console.log(res2);

        //remove green
        var res3 = res2.filter(function (v, i) {
            return i % 2 != 1;
        });
        console.log(res3);
        

        

        
        const myJSON = JSON.stringify(res3);
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
            .then(function (jsonResponse) {
            console.log(jsonResponse);
            
             })
            ;


    }
}


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
//    bgFillColor = color;
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
  //  bgFillOn = false;
    brushOn = true;
    isDrawing = false;
    brushOn2 = false;

    /*Select current swatch */
    deselectTool();
    clicked = false;

    if (!brushButton.classList.contains('set')) {
        brushButton.className += ' set';
        brushButton2.parentElement.style.backgroundColor="";
        eraser.parentElement.style.backgroundColor="";
        brushButton.parentElement.style.backgroundColor="#B87A00";
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
   // bgFillOn = false;
    brushOn = false;
    isDrawing = false;
    brushOn2 = true;

    /*Select current swatch */
    deselectTool();

    if (!brushButton2.classList.contains('set')) {
        brushButton2.className += ' set';
        brushButton.parentElement.style.backgroundColor="";
        eraser.parentElement.style.backgroundColor="";
        brushButton2.parentElement.style.backgroundColor="#1C699C";
        
        /*var active = document.getElementsByClassName('active')[0];
        if (active) {
            active.className = 'swatch';
        }*/
    }
}

// /* Background Fill */
// var fillButton = document.getElementById('filldrip');
// fillButton.addEventListener('click', setBackgroundFill);

// function setBackgroundFill(e) {
//     eraserOn = false;
//     bgFillOn = true;
//     isDrawing = false;
//     deselectTool();

//     //var bgFill = document.getElementById('filldrip');
//     if (!fillButton.classList.contains('set')) {
//         fillButton.className += ' set';
//         var active = document.getElementsByClassName('active')[0];
//         if (active) {
//             //  active.className = 'swatch';
//         }

//     }
//     // alert('Fill the background');
// }

/* Erase */
var eraserButton = document.getElementById('eraser');
eraserButton.addEventListener('click', setEraser);

function setEraser(e) {
    eraserOn = true;
   // bgFillOn = false;
    brushOn = false;
    isDrawing = false;
    deselectTool()

    var eraser = document.getElementById('eraser');
    if (!eraser.classList.contains('set')) {
        eraser.className += ' set';
        brushButton.parentElement.style.backgroundColor="";
        brushButton2.parentElement.style.backgroundColor="";
        eraser.parentElement.style.backgroundColor="#FF311F";
        var active = document.getElementsByClassName('active')[1];
        if (active) {
            active.className = 'swatch';
        }
    }
}


/* Clear Canvas */
var clearButton = document.getElementById('clearCanvas');
clearButton.addEventListener('click', clearCanvas);

function clearCanvas(e) {
    brushButton.parentElement.style.backgroundColor="";
    brushButton2.parentElement.style.backgroundColor="";
    eraser.parentElement.style.backgroundColor="";
    storeSnapshot();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context2.clearRect(0, 0, canvas2.width, canvas2.height);
    context_normal.clearRect(0, 0, canvas_normal.width, canvas_normal.height);
    restore_colors();
    
}

/* Undo */
var undoButton = document.getElementById('undo')
undoButton.addEventListener('click', cUndo);

function cUndo() {
    brushButton.parentElement.style.backgroundColor="";
    brushButton2.parentElement.style.backgroundColor="";
    eraser.parentElement.style.backgroundColor="";
    var canvasPic = new Image();
    var canvasPic2 = new Image();
    var canvasPic3 = new Image();
    if (cStep > 0) {
        cStep--;
        canvasPic.src = cPushArray[cStep];
        canvasPic2.src = cPushArray2[cStep];
        canvasPic3.src = cPushArray3[cStep];
        canvasPic.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(canvasPic, 0, 0);
        }
        canvasPic2.onload = function () {
            context2.clearRect(0, 0, canvas2.width, canvas2.height);
            context2.drawImage(canvasPic2, 0, 0);
        }
        canvasPic3.onload = function () {
            context_normal.clearRect(0, 0, canvas_normal.width, canvas_normal.height);
            context_normal.drawImage(canvasPic3, 0, 0);
        }

    } else {
        canvasPic.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(canvasPic.src, 0, 0);
        }
        canvasPic2.onload = function () {
            context2.clearRect(0, 0, canvas2.width, canvas2.height);
            context2.drawImage(canvasPic2.src, 0, 0);
        }
        canvasPic3.onload = function () {
            context_normal.clearRect(0, 0, canvas_normal.width, canvas_normal.height);
            context_normal.drawImage(canvasPic3.src, 0, 0);
        }
    }
    restore_colors();
}

/* Redo */
var restoreButton = document.getElementById('restore');
restoreButton.addEventListener('click', restoreCanvas);

function restoreCanvas(e) {
    brushButton.parentElement.style.backgroundColor="";
    brushButton2.parentElement.style.backgroundColor="";
    eraser.parentElement.style.backgroundColor="";
    if (cStep >= 0 && (cStep < cPushArray.length - 1)) {
        cStep++;
        var canvasPic = new Image();
        var canvasPic2 = new Image();
        var canvasPic3 = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic2.src = cPushArray2[cStep];
        canvasPic3.src = cPushArray3[cStep];
        canvasPic.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(canvasPic, 0, 0);
        }
        canvasPic2.onload = function () {
            context2.clearRect(0, 0, canvas2.width, canvas2.height);
            context2.drawImage(canvasPic2, 0, 0);
        }
        canvasPic3.onload = function () {
            context_normal.clearRect(0, 0, canvas_normal.width, canvas_normal.height);
            context_normal.drawImage(canvasPic3, 0, 0);
        }
    }
    restore_colors();
}

document.onkeydown = KeyPress;


/* This is the function that will take care of image extracting and
 * setting proper filename for the download.
 * IMPORTANT: Call it from within a onclick event.
 */
function downloadCanvas(link, canvasId, context_normal, filename) {
    context_normal.drawImage(canvas, 0, 0);
    context_normal.drawImage(canvas2, 0, 0);
    
    link.href = document.getElementById(canvasId).toDataURL();
    console.log(link.href);
    link.download = filename;
}

/** 
 * The event handler for the link's onclick event. We give THIS as a
 * parameter (=the link element), ID of the canvas and a filename.
 */
document.getElementById('save').addEventListener('click', function () {
    downloadCanvas(this, 'myCanvas_normal', context_normal, 'Drawing.png');
    restore_colors();

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
    
    var bounds = contextBoundingBox(context);
    context.clearRect(bounds.x, bounds.y, (bounds.w) + 1, (bounds.h) + 1);
    // context2.drawImage(img, bounds.x, bounds.y, bounds.w, bounds.h);
    context2.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);
    storeSnapshot();

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

function restore_colors(){
    setTimeout(function(){
        if(brushButton.classList.contains('set')){
            brushButton.parentElement.style.backgroundColor="#B87A00";
         }
         if(brushButton2.classList.contains('set')){
            brushButton2.parentElement.style.backgroundColor="#1C699C";
         }
         if(eraser.classList.contains('set')){
            eraser.parentElement.style.backgroundColor="#FF311F";
         }
    },700);
}






