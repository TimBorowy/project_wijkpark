const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db){
  if (err) throw err;
  var dbo = db.db("project_wijkpark");
  //Create a collection name "customers":
  dbo.createCollection("users", function(err, res){
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});

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

// Express Session MiddleWare
var sessionStore = new session.MemoryStore;
app.use(session({
  store: sessionStore,
  secret: 'wijkpark',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});
// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
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

// Passport config
require('./config/passport')(passport);
// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// index View
app.get('/', function(req, res){
    res.render('home', {title: 'Project Wijkpark, an interactive project'})
});

app.get('/pixel', function(req, res){
    res.render('pixel-place', { title: 'Place your pixels', message: 'Hello there!' })
});

app.get('/pixel/view', function (req, res) {
    res.render('pixel-view', {title: 'Canvas overview'})
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
    socket.on('current_canvas', function (canvas){
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