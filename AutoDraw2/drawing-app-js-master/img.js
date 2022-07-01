var mainCanvasContext = document.getElementById("myCanvas").getContext("2d");

/* Creates our layer's array */
var layers = [];

function addNewLayer(layers) {
    /* Creates the layer as a new canvas */
    var layer = document.createElement("canvas");
    var layerContext = layer.getContext("2d");

    /* Clears the canvas */
    layerContext.clearRect(0, 0, 400, 200);

    /* Adds it to our layers array */
    layers.push(layer);

    /* Returns the new layer to use it straight away */
    return layer;
}

/* Draws each layer on top of the other */
function drawImage(canvasContext, layers) {
    /* Clears the original canvas */
    canvasContext.clearRect(0, 0, 400, 200);
    for (var i = 0; i < layers.length; i++) {
        canvasContext.drawImage(layers[i], 0, 0);
    }
}

/* Creates new layer and adds a square to it */
var layer1 = addNewLayer(layers);
var layer1Context = layer1.getContext("2d");
layer1Context.fillStyle = "#FF0000";
layer1Context.fillRect(0, 0, 80, 100);

/* Creates new layer and adds a square to it */
var layer1 = addNewLayer(layers);
layer1Context = layer1.getContext("2d");
layer1Context.fillStyle = "#00FF00";
layer1Context.fillRect(10, 10, 80, 100);
//newLayerContext.clearRect(10, 10, 80, 100);



/* On each change to the layers, draw the image again */
drawImage(mainCanvasContext, layers);




