var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.set('view engine', 'hbs');

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res){
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

var currentCavas;

io.on('connection', function(socket){

	console.log('a user connected');

	// send canvas to new user
	socket.emit('newPlayer', currentCavas);

    socket.on('placePixel', function(event){

        io.emit('drawPixel', event);
        //socket.broadcast.emit('test', 'hoi broadcast emit');
        
    });

    socket.on('currentCanvas', function (canvas) {

        currentCavas = canvas;
        console.log(currentCavas)
    });


    socket.on('disconnect', function(){

        console.log('user disconnected');
    });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});