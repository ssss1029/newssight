var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var sha1 = require('sha1');
var bcrypt = require('bcrypt');
  var saltRounds = 10; // For bcrypt

var app = express();
var kue = require('kue');
var queue = kue.createQueue();

var debug = require("debug")('newssight:app.js');

var User = require('./server/schemas/schema-user');

if (process.env.NODE_ENV == "development") {
  app.use('/api', kue.app);
} 

// view engine setup
app.set('views', path.join(__dirname, 'client/html/'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// Passport and session stuff
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
   secret: 'keyboard cat', 
   resave: true, 
   rolling : true,
   saveUninitialized: false,
   store : new MongoStore({
     mongooseConnection : mongoose.connection
   })
}));

passport.serializeUser(function(user, done) {
  var userID = user.id;
  console.log(JSON.stringify(user));
  console.log(userID);
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  console.log(id);
  User.find({id : id}, function (err, user) {
    
    if (!user) {
      // Handle the case where no user is found and the cookie is still there 
    }

    done(err, user);
  })
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { 
        return done(err); 
      }
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      console.log(user.password);
      console.log(bcrypt.hashSync(password, saltRounds));
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    });
  }
));

// Routes
var index = require('./client/router');
var api = require('./server/api/router');
app.use('/', index);
app.use('/api', api);


// Statics 
app.use('/css', express.static('client/css/dist'));
app.use('/img', express.static('client/img/dist'));
app.use('/js',  express.static('client/js/dist'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err) {
    console.log(err);
  }

  // render the error page
  res.status(err.status || 500);
  res.send("There has been an error");
});

// Set up the server
require('./server/main');

module.exports = app;
