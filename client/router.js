var express = require('express');
var router = express.Router();

// Need to dynamically update this
var loggedIn = false;

/* GET home page. */
router.get('/', function(req, res, next) {  
	res.render('home', {
		loggedIn : loggedIn
	});
});


router.get('/login', function(req, res, next) {
    res.render('login', {
		loggedIn : loggedIn
    });
});

module.exports = router;
