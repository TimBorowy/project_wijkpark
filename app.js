var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.set('view engine', 'hbs');

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));

app.get('/', function(req, res){
  res.render('home')
});

app.get('/pixel', function(req, res){
    res.render('index', { title: 'Hey', message: 'Hello there!' })
});

io.on('connection', function(socket){

	console.log('a user connected');

    socket.on('test_event', function(nickname){
        
        socket.emit('test', 'hoi emit');
        socket.broadcast.emit('test', 'hoi broadcast emit');
        
    });


    socket.on('disconnect', function(){

        console.log('user disconnected');
    });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});