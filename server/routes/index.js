const router = require('express').Router()
const { loginRedirects } = require('./util')

router.get('/', function(req, res, next) {  
    console.log(res.app.locals)
    res.render('home');
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

module.exports = router;
