var canvas, canvas2,canvas_normal,canvas_post, dataURL, context, context2,context_normal, dragging, x, y, brushColor,
    radius = 10, cPushArray = new Array(),cPushArray2 = new Array(),cPushArray3 = new Array(), cStep = -1,
    mouseup = false, mousedown = false, eraserOn = false, brushOn = false,
    bgFillOn = false,brushOn2=false, slideIndex = 1;

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
        console.log("I ENTER NOWWWWW");
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
    //    context2.putImageData(datastream, 0, 0);



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
        let token = document.cookie;
        // console.log(token);
        token = token.split("=");
        var test=JSON.stringify({
            "token": token[1],
            "data":res3,});
            console.log(test);
        var url = 'https://autodraw-service-1.lusl2hv0nq5h6.us-west-2.cs.amazonlightsail.com';
       
        setTimeout(() => {
            fetch(url, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=utf-8',
                }),
                body:  JSON.stringify({
                    "token": token[1],
                    "data":res3,
                }),
            }).then(function (response) {
                return response.json();
            })
                .then(function (jsonResponse) {
                console.log(jsonResponse);
    
                var test=JSON.parse(jsonResponse);
                console.log(test);
    
                var bar=document.getElementById("hide2");
                var text="";
                for(let i=0;i<10;i++){
                  text+='<img id="mno" src="https://autodraw.s3.us-west-2.amazonaws.com/SVGICON/SVGICON/'+test[i].image+'" onclick="func(this)" width="50" height="50"/>';
                }
                bar.innerHTML+=text;
                });
        }, 8000);
        
        // fetch(url, {
        //     method: 'POST',
        //     headers: new Headers({
        //         'Content-Type': 'application/json; charset=utf-8',
        //     }),
        //     body:  JSON.stringify({
        //         "token": token[1],
        //         "data":res3,
        //     }),
        // }).then(function (response) {
        //     return response.json();
        // })
        //     .then(function (jsonResponse) {
        //     console.log(jsonResponse);

        //     var test=JSON.parse(jsonResponse);
        //     console.log(test);

        //     var bar=document.getElementById("hide2");
        //     var text="";
        //     for(let i=0;i<10;i++){
        //       text+='<img id="mno" src="https://autodraw.s3.us-west-2.amazonaws.com/SVGICON/SVGICON/'+test[i].image+'" onclick="func(this)" width="50" height="50"/>';
        //     }
        //     bar.innerHTML+=text;
        //     });


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
    context_normal.lineWidth=radius*2;
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

function prev(){
    document.getElementById('button').scrollLeft -= 270;
}

function next()
{
    document.getElementById('button').scrollLeft += 270;
}

function addSwatches() {
    var text="";
    var colors = ['black', 'maroon', 'grey', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'brown', 'pink', 'teal','beige', 'aqua','purple'];
    var swatches = document.getElementsByClassName('swatch');
    text +='<div onclick="plusSlides(-4)" class="control-prev-btn">';
    text +='<i class="fas fa-arrow-left"></i>';
    text +='</div>';
    document.getElementById('next').innerHTML +=text;

    for (var i = 0, n = colors.length; i < n; i++) {
        var swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = colors[i];
        swatch.addEventListener('click', setSwatch);
        document.getElementById('colors').appendChild(swatch);
        
    }
    text="";
    text +='<div onclick="plusSlides(4)" class="control-next-btn">';
    text +='<i class="fas fa-arrow-right"></i>';
    text+='</div>';
    document.getElementById('prev').innerHTML +=text;
    showSlides();
}

function setColor(color) {
    context.fillStyle = color;
    context.strokeStyle = color;
    context_normal.fillStyle = color;
    context_normal.strokeStyle = color;
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
    document.getElementById('eraser').parentElement.parentElement.style.display="block";
    document.getElementById('mynav').style.height="32rem";
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
    document.getElementById('eraser').parentElement.parentElement.style.display="none";
   document.getElementById('mynav').style.height="28.5rem";
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
    // context_normal.drawImage(canvas2, 0, 0);

    link.href = document.getElementById(canvasId).toDataURL();
    console.log(link.href);
    link.download = filename;
}

/** 
 * The event handler for the link's onclick event. We give THIS as a
 * parameter (=the link element), ID of the canvas and a filename.
 */
document.getElementById('save').addEventListener('click', function () {
    brushButton.parentElement.style.backgroundColor="";
    brushButton2.parentElement.style.backgroundColor="";
    eraser.parentElement.style.backgroundColor="";
    downloadCanvas(this, 'myCanvas_normal', context_normal, 'Drawing.png');
    restore_colors();

}, false);

//post
function display_pop(){
    document.getElementById('wrapper').style.display="block";
}
function lock_pop(){
    document.getElementById('wrapper').style.display="none";
}



//for post btn
function post_submit(e){
    e.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
    setTimeout(function () {
      var title = document.querySelector('#title').value ;
      var posted = (title) ? ' posted' : 'Posted'
      e.innerHTML = 'Post';
      toaster('<i>'+title+'</i>'+posted)
  }, 1000)
  }

//for del btn
function trash(){
  document.querySelector('#title').value = '';
  document.querySelector('#desc').value = '';
//   quill.setText('');
//   toaster('Trashed');
}


//convert inside canvas
function dataURLtoFile(dataurl, filename) {
     // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataurl.split(',')[1]);

    // separate out the mime component
    var mimeString = dataurl.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //New Code
    return new Blob([ab], {type: mimeString});
}





function post_prof(){
    document.getElementById('post_btn').innerHTML='<i class="fas fa-spinner fa-spin"></i>';
    var data = context2.getImageData(0, 0, canvas2.width, canvas2.height);
    
  context2.globalCompositeOperation="destination-over";
    context2.beginPath();
	context2.rect(0, 0, canvas_normal.width, canvas_normal.height);
	context2.fillStyle = "#ffffff";
	context2.fill();
    context2.globalCompositeOperation="source-over";
    context2.drawImage(canvas, 0, 0);
    context2.drawImage(canvas_normal, 0, 0);
    url = document.getElementById('myCanvas2').toDataURL();
    context2.clearRect(0, 0, canvas2.width, canvas2.height); 
    context2.putImageData(data,0,0);  
    

    console.log(url);

    var fileData = dataURLtoFile(url, "imageName.png");
    console.log("Here is JavaScript File Object", fileData);

    let token = document.cookie;
    console.log(token);
	token = token.split("=");

    var formdata = new FormData();
	formdata.append('name', document.getElementById('title').value);
	formdata.append('type', "Auto Draw");
	formdata.append('postImg', fileData);
	formdata.append('description', document.getElementById('desc').value);

	var myHeaders = new Headers();

	myHeaders.append("Authorization", `Bearer ${token[1]}`);
	console.log("222222222222222222");
	console.log(token[1]);
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
            if(json.status=="success"){
			// alert("mabroook");
            document.getElementById('post_btn').innerHTML='Post';
            document.getElementById('fail_cond').style.color="#49D907";
            document.getElementById('fail_cond').innerHTML="Posted Successfully";
            trash();
            }
            else{
                document.getElementById('fail_cond').style.color="#FBA504";
                document.getElementById('fail_cond').innerHTML="&nbsp;Fail!! "+json.message;
                document.getElementById('post_btn').innerHTML='Post';
            }
		})

		.catch((err) => {
			console.error(err);
		})
}


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
    // var x = document.getElementById("colors");
    // if (x.style.display === "none") {
    //     x.style.display = "flex";
    //     x.style.flexDirection = "row";
    //     x.style.alignContent = "center";
    // }
    // else {
    //     x.style.display = "none";
    // }
    var x = document.getElementById("tool-color");
    x.firstElementChild.firstElementChild.style.display="none";
    x.firstElementChild.firstElementChild.nextElementSibling.style.display="none";
    document.getElementById("large").style.display="flex";
    
}





// var img = document.getElementById('mno');
// img.addEventListener('click', func);

//put image on click
function func(e) {
    var bounds = contextBoundingBox(context);
    context.clearRect(bounds.x, bounds.y, (bounds.w) + 1, (bounds.h) + 1);
    context2.drawImage(e, bounds.x, bounds.y, bounds.w, bounds.h);
    // context2.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);
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



//show colors
function plusSlides(n) {
  showSlides(slideIndex += n);
  console.log("mmmmmmmmmmmmmmmmmmmmmmmm");
}


function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("swatch");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slides[slideIndex-1].style.display = "block";  
  slides[slideIndex].style.display = "block"; 
  slides[slideIndex+1].style.display = "block"; 
  slides[slideIndex+2].style.display = "block"; 
}



