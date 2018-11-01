const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressMessages = require('express-messages');

const dbConfig = require('./config/database');
const appConfig = require('./config/app');

const app = express();

// Database setup
mongoose.connect(dbConfig.database);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to database.');
});

app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Messaging
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
});

// static files
app.use(express.static('public'));

// Load models
let Task = require('./models/task');

app.get('/', function (req, res) {
  Task.find({}, function (err, tasks) {
    if (err) console.error(err);

    res.render('index', {
      title: 'Home',
      tasks: tasks
    });
  });
});

// Routes
const todo = require('./routes/tasks');
app.use('/tasks', todo);

app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));

app.listen(appConfig.port, function () {
  console.log('Server started on port ' + appConfig.port);
});
