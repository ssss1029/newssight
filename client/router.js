var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("here");
  res.sendFile('index.html', {root: __dirname });
});

module.exports = router;
