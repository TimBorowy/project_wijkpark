/*
* Web sockets
* */

// connect to wss
const socket = io({reconnectionAttempts: 7});

// handle successful socket connection
socket.on('connect', function (connection) {
    console.log('Connection made/restored');

    document.getElementById('errorContainer').style.display = 'none';
});

// handle incoming draw pixel event
socket.on('draw_pixel', function (event) {
    console.log(event)

    // draw pixel on canvas
    ctx.fillStyle = event.color;
    ctx.fillRect(event.x, event.y, 1, 1);

    // get current state of canvas
    let currentCanvas = ctx.getImageData(0, 0, 100, 100);
    socket.emit('current_canvas', currentCanvas.data);
});

socket.on('new_player', function (canvasData) {

    let fuckingHell = []

    // make array of object
    for (let index in canvasData) {
        fuckingHell.push(canvasData[index])
    }

    console.log('bullshit', fuckingHell)

    // create new image data instance with available canvas state
    let state = new ImageData(Uint8ClampedArray.from(fuckingHell), 100, 100)

    // place current state on board
    ctx.putImageData(state, 0, 0);
});

// handle wss connection error
socket.on('connect_error', function (err) {
    console.log('Socket connection error');

    //todo: show connection error message
    document.getElementById('errorContainer').style.display = 'block';


});

// handle wss reconnection error
socket.on('reconnect_error', function (err) {
    console.log('Socket reconnection error');

    //todo: show connection error message
    document.getElementById('errorContainer').style.display = 'block';

});

/*
* Layout
* */


window.addEventListener('load', sizeLayouts)
window.addEventListener('resize', sizeLayouts)

function sizeLayouts() {

    let footer = document.getElementById('color-footer').offsetHeight
    let header = document.getElementById('title-header').offsetHeight

    let heightResult = screen.availHeight - header - footer;

    document.getElementById('canvas-container').style.height = heightResult+'px'
}


/*
* Game
* */


let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
// ctx.webkitImageSmoothingEnabled = true;
// ctx.imageSmoothingEnabled = true;


// available colors
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
// set initial color
let selectedColor = colors[0];
// canvas zoom level
let canvasScale = 7;


// create color selection buttons
for (let color of colors) {

    let button = document.createElement('button');
    button.innerHTML = color.name;
    button.classList.add("colorButton");
    button.style.backgroundColor = color.hexCode;

    if (color.light) {
        button.style.color = '#2e2e2e';
    }

    document.querySelector('#colors').appendChild(button)
}

// add event listeners to those buttons
for (let colorButton of document.querySelectorAll('.colorButton')) {
    colorButton.addEventListener('click', function (e) {
        selectedColor = this.style.backgroundColor;
        console.log(selectedColor)
    })
}

canvas.addEventListener('mousedown', function (event) {
    // get scaled click coordinates
    let x = Math.floor(event.layerX / canvasScale);
    let y = Math.floor(event.layerY / canvasScale);

    socket.emit('request_pixel_placement', {x: x, y: y, color: selectedColor});
});

document.addEventListener('keydown', function (event) {
    console.log(event.keyCode)
    //console.log(canvas.style.top)

    switch (event.keyCode){
        case 38: //up
            canvas.style.top = parseInt(canvas.style.top, 10) - 20 + 'px'
            break;
        case 40: //down
            canvas.style.top = parseInt(canvas.style.top, 10) + 20 + 'px'
            break;
        case 37: //left
            console.log(canvas.style.left)
            canvas.style.left = parseInt(canvas.style.left, 10) - 20 + 'px'
            break;
        case 39: //right
            console.log(parseInt(canvas.style.left, 10))
            canvas.style.left = parseInt(canvas.style.left, 10) + 20 + 'px'
            break;
    }
})

