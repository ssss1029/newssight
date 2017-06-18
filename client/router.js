var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('home.html', {root: __dirname + "/html" });
});

module.exports = router;
