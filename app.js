let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let bodyParser = require('body-parser');

app.set('view engine', 'hbs');

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res){
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

let currentCanvas;

io.on('connection', function(socket){
    // socket connects
	console.log('a user connected');

    if(currentCanvas != null){
        // send current state of canvas to new socket
        socket.emit('new_player', currentCanvas);
    }

    // handle incoming place pixel events
    socket.on('request_pixel_placement', function(event){

        //todo: check if event is valid

        // emit pixel placement event to all sockets
        io.emit('draw_pixel', event);
    });

    // handle incoming canvas update events
    socket.on('current_canvas', function (canvas) {
        //todo: make p2p style request canvas state method
        // save canvas state on server
        currentCanvas = canvas;
    });


    socket.on('disconnect', function(){
        // socket disconnected
        console.log('user disconnected');
    });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});