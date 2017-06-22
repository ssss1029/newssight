
var express = require('express');
var router = express.Router();
var User = require('../schemas/schema-user');

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
    var username = req.body.givenUsername;
    var email = req.body.givenEmail;
    var pass = req.body.givenPassword;
    var confirmPass = req.body.confirmGivenPassword;

    // Check if the passwords match 
    if (pass != confirmPass) {
        respondWithResult(res, 400)({
            error : "1" //  Sent when passwords dont match
        })
    }

    // Check if the username is not taken
    User.find({ username : username }, function(err, response) {
        if (response.length != 0) {
            respondWithResult(res, 400)({
                error : "2" // Sent when the user already exists
            })
            
            return;
        }

        // Add the user to DB

        // Log in the user with the given information
    });
}

/**
 * Add the user to db. user object is of the following form:
 * @param {Object} user { username, password, email }
 */
function addUserToDB(user) {

}

module.exports = router;
