/*
* Web sockets
* */

// connect to wss
const socket = io({reconnectionAttempts: 7});

// handle successful socket connection
socket.on('connect', function (connection) {
    console.log('Connection made/restored');
    // hide connection error box
    document.getElementById('errorContainer').style.display = 'none';
});

// handle incoming draw pixel event
socket.on('draw_pixel', function (event) {

    // draw pixel on canvas
    ctx.fillStyle = event.color;
    ctx.fillRect(event.x, event.y, 1, 1);

    // get current state of canvas
    let currentCanvas = ctx.getImageData(0, 0, 100, 100);
    // emit state to server
    socket.emit('current_canvas', currentCanvas.data);
});

socket.on('new_player', function (canvasData) {

    let fuckingHell = []

    // make array of object
    for (let index in canvasData) {
        fuckingHell.push(canvasData[index])
    }

    // create new image data instance with available canvas state
    // this took way to much time to figure out ctx.createImageData creates an instance of imagedata with protected properties
    // so I needed to set the properties when creating a new instance
    let state = new ImageData(Uint8ClampedArray.from(fuckingHell), 100, 100)

    // place current state on board
    ctx.putImageData(state, 0, 0);
});

// handle wss connection error
socket.on('connect_error', function (err) {
    console.log('Socket connection error');

    // show connection error box
    document.getElementById('errorContainer').style.display = 'block';
});

// handle wss reconnection error
socket.on('reconnect_error', function (err) {
    console.log('Socket reconnection error');

    // show connection error box
    document.getElementById('errorContainer').style.display = 'block';
});
