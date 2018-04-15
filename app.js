var express = require('express')
var app = express();
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sha1 = require('sha1');
var bcrypt = require('bcrypt');
var expose = require('express-expose');
	app = expose(app);

var debug = require("debug")('newssight:app.js');
var authConns = require('./server/database-conns/db-auth-conns');  
var Users = require("./server/database-conns/db-users-conns");

var saltRounds = 10; // For bcrypt
global._base = __dirname;

// view engine setup
app.set('views', path.join(__dirname, 'client/html/'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (process.env["TESTING"] != "true") {
  app.use(logger('dev'));
}


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
	if (user.id == undefined) {
		debug("Serialize user failed with id = {0}".format(user.id))
		done("The given user object doesn't have an id!")
	} else {
		debug("Serialize user success with id = {0}".format(user.id))
		done(null, user.id)
	}
});

passport.deserializeUser(function(id, done) {
  Users.getUser({"id" : id}).then(function(results) {
	if (results.length == 0) {
		debug("Deserialize user failed with results: {0}".format(results[0].toString()))
		done("No users with id = {0}".format(id.toString()));
	} else {
		debug("Deserialize user success with results: {0}".format(results[0].toString()))
		done(null, results[0]);
	}
  });
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
	function(username, password, done) {
		Users.getUser({"username" : username}).then(function(results) {
			if (results.length == 0 || results == null || results == undefined) {
				done(null, false, {message : "Incorrect username"});
				return;
			}
			debug("LocalStrategy query results = {0}".format(results.toString()))
			user = results[0];
			if (bcrypt.compareSync(password, user.password) == true) {
				done(null, user);
			} else {
				done(null, false, {message : "Incorrect password"});
			}
			console.log(results);
		}).catch(function(error) { 
			done(error);
		});
	}
));


// Statics 
app.use('/css', express.static('client/css/dist'));
app.use('/img', express.static('client/img/dist'));
app.use('/js',  express.static('client/js/dist'));

// Expose logged-in user to the frontend
app.use(function(req, res, next) {
	if (req.user == undefined) {
		next();
		return;
	}

    let user = {
        username : req.user.username,
        first_name : req.user.first_name,
        last_name : req.user.last_name
	}

	res.expose(user, 'app.user', 'user');	
	next();
});

// Routes
var index = require('./server/routes/index');
var api = require('./server/api/router');
app.use('/api', api);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('404 - Not Found');	
  err.status = 404;
  console.log("Made 404 Error object")
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log("In error handler")
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
