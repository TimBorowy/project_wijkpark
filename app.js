const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');

// Connect to db and check for errors
mongoose.connect('mongodb://localhost/project_wijkpark');
let db = mongoose.connection;
db.once('open', function() {
  console.log('Connected to MongoDB');
});
db.on('error', function(err) {
  console.log(err);
});

// Bring in Models
let User = require('./models/user');
// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// index View
app.get('/', function(req, res) {
    res.render('home', {title: 'Project Wijkpark, an interactive project'})
});


// Register View
app.get('/users/register', function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('user_registration', {
        title: 'Registration',
        users: users
      });
    }
  });
});

app.get('/pixel', function(req, res){
    res.render('pixel', { title: 'Place your pixels', message: 'Hello there!' })
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

// Routes Files
let users = require('./routes/users');
app.use('/users', users);

http.listen(3000, function(){
  console.log('listening on *:3000');
});