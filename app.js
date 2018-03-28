const express = require('express');
const app = express();
const path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
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
  res.render('index', {
    title: 'Hey',
    message: 'Hello there!'
  })
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
// Add Submit Post Route
app.post('/users/register', function(req, res) {
  let user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.username = req.body.username;
  user.password = req.body.password;

  user.save(function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
  return;
});

io.on('connection', function(socket) {

  console.log('a user connected');

  socket.on('test_event', function(nickname) {

    socket.emit('test', 'hoi emit');
    socket.broadcast.emit('test', 'hoi broadcast emit');

  });


  socket.on('disconnect', function() {

    console.log('user disconnected');
  });
});

// Routes Files
let users = require('./routes/users');
app.use('/users', users);

// Start Server
http.listen(3000, function() {
  console.log('listening on *:3000');
});
