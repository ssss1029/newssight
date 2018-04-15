const router = require('express').Router()
const { loginRedirects } = require('./util')

router.get('/', function(req, res, next) {  
    res.render('landing');
});

router.get('/home', function(req, res, next) {  
    res.render('home');
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

module.exports = router;
