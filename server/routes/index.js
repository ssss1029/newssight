const router = require('express').Router()
const { loginRedirects } = require('./util')

router.use(loginRedirects);

router.get('/', function(req, res, next) {  
	res.render('home');
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

module.exports = router;
