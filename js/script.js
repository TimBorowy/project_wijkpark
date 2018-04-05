/*
* Layout
* */

window.addEventListener('load', sizeLayouts)
window.addEventListener('resize', sizeLayouts)

// base layout sizes on screen resolution
function sizeLayouts() {

    let footer = document.getElementById('color-footer').offsetHeight
    let header = document.getElementById('title-header').offsetHeight

    let heightResult = screen.availHeight - header - footer;

    document.getElementById('canvas-container').style.height = heightResult + 'px'
}


/*
* Game
* */

// get canvas and set initial canvas state
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

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
let canvasScale = 8;

// amount of initial pixels you can place
let pixels = 5;

// set canvas zoom level
canvas.style.transform = 'scale('+ canvasScale+')'
canvas.style.transformOrigin = 'left top'

// create color selection buttons
for (let color of colors) {

    let button = document.createElement('button');
    button.innerHTML = color.name;
    button.classList.add("colorButton");
    button.style.backgroundColor = color.hexCode;

    // use a light font color on a dark background
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

// initialize qr code scanner
let scanner = new Instascan.Scanner({video: document.getElementById('preview'), mirror: false,});

// listen for successful scans
scanner.addListener('scan', function (content) {
    console.log(content);

    // check if qr code is valid
    if(content === "park_pole1"){
        // add 5 pixels
        pixels +=5
        console.log(pixels)

        closeScanner()
    } else{
        alert('QR code niet geldig')
    }
});


// listen for a click on the canvas
canvas.addEventListener('mousedown', function (event) {
    // get scaled click coordinates
    let x = Math.floor(event.layerX / canvasScale);
    let y = Math.floor(event.layerY / canvasScale);

    if (pixels !== 0) {

        socket.emit('request_pixel_placement', {x: x, y: y, color: selectedColor});
        pixels--
        console.log(pixels)

        if (pixels === 0) {
            alert('je pixels zijn op! Open de scanner. ')
        }
    }
});

document.getElementById('findQRCodes').addEventListener('click', launchCameraHandler)
document.getElementById('closeScanner').addEventListener('click', closeScanner)

// launch camera and view
function launchCameraHandler() {
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            // if a second camera is available (usually the back camera on mobile)
            if(cameras[1]){
                scanner.start(cameras[1]);
            } else{
                scanner.start(cameras[0]);
            }

        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });

    document.getElementById('pixelView').style.display = 'none'
    document.getElementById('codeReader').style.display = 'block'
}

// close scanner and close view
function closeScanner() {
    scanner.stop()
        .then(function () {
            document.getElementById('codeReader').style.display = 'none'
            document.getElementById('pixelView').style.display = 'block'
        })
}

// move canvas around with the arrow keys
document.addEventListener('keydown', function (event) {

    switch (event.keyCode) {
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
});

// move canvas around with touch movements
{
    let start = {x: '', y: '', elemX: '', elemY: ''}
    let moveX
    let moveY

    // when you touch the screen
    document.addEventListener('touchstart', function (e) {
        // save initial movement start position
        start.x = e.touches[0].clientX
        start.y = e.touches[0].clientY

        // save initial element position
        start.elemX = parseInt(canvas.style.left, 10)
        start.elemY = parseInt(canvas.style.top, 10)
    })

    // when you move your finger
    document.addEventListener('touchmove', function (e) {
        // event position
        moveX = e.touches[0].clientX
        moveY = e.touches[0].clientY

        // move the canvas with your finger
        canvas.style.left = start.elemX - (start.x - moveX) + 'px'
        canvas.style.top = start.elemY - (start.y - moveY) + 'px'
    })
}
