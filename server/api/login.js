
var express = require('express');
var router = express.Router();

router.post('/', processLogin)

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}


module.exports = router;