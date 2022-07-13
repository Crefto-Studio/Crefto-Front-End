window.onload=function(){
var jsonResponse='{"0":{"image":"edge_d098dedde4654add8b73d4d9d55afe68.svg"},"1":{"image":"edge_acd8f3866abd4f49343212ac94a87a06.svg"},"2":{"image":"edge_4781751c27e10f4493da48e810224c85.svg"},"3":{"image":"edge_4e318efad78c8ae01632df81e27565a0.svg"},"4":{"image":"edge_9e5e7db1bc3e322d0c684f2c4439b1c7.svg"},"5":{"image":"edge_d5c1b7264ef347ef3eb68f175a3765aa.svg"},"6":{"image":"edge_f5d434fcaad8d5345ba219542ce78d71.svg"},"7":{"image":"edge_896a6923612fc5d4c6a5713ae762e321.svg"},"8":{"image":"edge_fef8af5cb0bb6960f54f6209a357201d.svg"},"9":{"image":"edge_217bbc6ef05fad22abcd3f5ecf585403.svg"}}';
var test=JSON.parse(jsonResponse);
console.log(test);
console.log(test[0].image)
}

// var i=0;
// for(let a=0;a<512;a++){
//     for(let b=0;b<512;b++){
//         imageData.data[i + 0] = arr[0][a][b];  // R value
//         imageData.data[i + 1] = arr[1][a][b];    // G value
//         imageData.data[i + 2] = arr[2][a][b];  // B value
//         imageData.data[i + 3] = 255;  // A value
//         i+=4;
//     }
// }
