var express = require('express')
var app = express();
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sha1 = require('sha1');
var bcrypt = require('bcrypt');

var debug = require("debug")('newssight:app.js');
var authConns = require('./server/database-conns/db-auth-conns');  

var saltRounds = 10; // For bcrypt
global._base = __dirname;

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
app.use(session({
   secret: 'keyboard cat', 
   resave: true, 
   rolling : true,
   saveUninitialized: false,
   store : authConns.getSessionStore(session)
}));

passport.serializeUser(function(user, done) {
  var userID = authConns.serializeUser(user);
  done(null, userID);
});

passport.deserializeUser(function(id, done) {
  user = authConns.deserializeUser(id);
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    authConns.getUser({ "Username": username }, function (err, user) {
      if (err) { 
        return done(err); 
      }
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Incorrect password for the given username.' });
      }

      return done(null, user);
    });
  }
));

// Statics 
app.use('/css', express.static('client/css/dist'));
app.use('/img', express.static('client/img/dist'));
app.use('/js',  express.static('client/js/dist'));

// Routes
var index = require('./server/routes/index');
var api = require('./server/api/router');
app.use('/api', api);
app.use('/', index);

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
