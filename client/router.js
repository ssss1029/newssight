var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  // Will modify this to make sure that the options are dynamically set
  
  res.render('home', {
    loggedIn : false
  });

});



module.exports = router;
