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
    //console.log(event)

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
