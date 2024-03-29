// logic for canvas element
// three mouse event: down move and up
//inside the eventopject check the properties with coordiantes

//Get the Canvas Element
const canvasSignature = document.getElementById("signature");

//Find the Canvas Element
const context = canvasSignature.getContext('2d');

context.fillStyle = "#000000";

function draw(x,y){
    context.lineTo(x,y);
    context.stroke();
}
function handleMove(e) {
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    draw(x, y);
}

function mousemove(e){
    draw(e.offsetX, e.offsetY);
}
// Mouse events
canvasSignature.addEventListener("mousedown", (e) => {

    context.moveTo(e.offsetX, e.offsetY);
    console.log('mousedown: ', 'startingpoint');
    canvasSignature.addEventListener("mousemove", mousemove);
});
// REMOVE Mouse event
document.addEventListener("mouseup", function(){  
    console.log("end point");
    canvasSignature.removeEventListener("mousemove", mousemove);
    console.log(canvasSignature.toDataURL);
    document.querySelector("input[type='hidden']").value = canvasSignature.toDataURL();
});

function checkURL (abc) {
    var string = abc.value;
    if (!~string.indexOf("http") || !~string.indexOf("https")  ) {
        string = "http://" + string;
    }
    abc.value = string;
    return abc;
}