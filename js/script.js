var socket = io();

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
// ctx.webkitImageSmoothingEnabled = true;
// ctx.imageSmoothingEnabled = true;

let colors = [
    {name: 'red', hexCode: '#f44336', light: false},
    {name: 'blue', hexCode: '#2196f3', light: false},
    {name: 'green', hexCode: '#4caf50', light: false},
    {name: 'orange', hexCode: '#ff5722', light: true},
    {name: 'purple', hexCode: '#673AB7', light: false},
    {name: 'yellow', hexCode: '#ffeb3b', light: true},
    {name: 'black', hexCode: '#000', light: false},
    {name: 'white', hexCode: '#FFF', light: true}
];
let color = colors[0];
let canvasScale = 7;

for (col of colors) {
    let button = document.createElement('button');
    button.innerHTML = col.name;
    button.classList.add("colorButton");
    button.style.backgroundColor = col.hexCode;
    if (col.light) {
        button.style.color = '#2e2e2e';
    }

    document.querySelector('#colors').appendChild(button)
}

for (c of document.querySelectorAll('.colorButton')) {
    c.addEventListener('click', function (e) {
        color = this.style.backgroundColor;
        console.log(color)
    })
}

canvas.addEventListener('mousedown', function (event) {
    // get click coordinates
    let x = Math.floor(event.layerX / canvasScale);
    let y = Math.floor(event.layerY / canvasScale);

    // get
    let currentCanvas = ctx.getImageData(0, 0, 100, 100);

    socket.emit('placePixel', {x: x, y: y, color: color});
    socket.emit('currentCanvas', currentCanvas.data);

    // draw pixel on canvas
    /*ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);*/
});

socket.on('drawPixel', function (event) {
    console.log(event)
    ctx.fillStyle = event.color;
    ctx.fillRect(event.x, event.y, 1, 1);
});

socket.on('newPlayer', function(canvasData){

    // place current state on board
    //let state = ctx.createImageData(100, 100)

    //console.log('dit', state)

    let fuckingHell = []

    for(index in canvasData){
        fuckingHell.push(canvasData[index])
    }

    console.log('bullshit', fuckingHell)


    let state = new ImageData(Uint8ClampedArray.from(fuckingHell), 100, 100)

    console.log(state.data)
    ctx.putImageData(state, 0, 0);
});
