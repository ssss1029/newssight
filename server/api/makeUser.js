
var express = require('express');
var router = express.Router()

router.post('/', processMakeUser);

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function processMakeUser(req, res) {
    console.log("Making user!");

    // Check if the emails match 

    // Check if the username is not taken 

    // Add the user to DB

    // Log in the user with the given information
    
}

module.exports = router;
