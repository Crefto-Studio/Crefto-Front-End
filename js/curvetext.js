
window.onload = function () {

    let canvas = document.getElementById("canv");

    let context = canvas.getContext("2d");

    
    context.font = "bold 38px jost, sans-serif";
    context.fillStyle = "#FBA504";

  

   
   

    let string = "Photastic";

    let angle = Math.PI * 0.6; // in radians
    let radius = 140;

    context.translate(300, 300);
    context.rotate(-1 * angle / 1.9);

    for (let i = 0; i < string.length; i++) {
        context.rotate(angle / string.length);
        context.save();
        context.translate(-15, -0.7 * radius);
        context.fillText(string[i], 0, 0);
        context.restore();
       
    }

    window.onscroll = function () { myFunction() };

    function myFunction() {
        if (context.scrollTop > 45) {
            $('#canv').addClass('sticky-top');
        } else {
            context.fillStyle = "blue";
        }
    }
    

 
};





