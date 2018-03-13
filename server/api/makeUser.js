
var express = require('express');
var router = express.Router();
var User = require('../schemas/schema-user');
var bcrypt = require('bcrypt');
var saltRounds = 10 // To use with bcrypt
var sha1 = require("sha1");
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

/**
 * Processes a /makeUser request
 *  - Checks if passwords match
 *  - Checks if the password is long enough
 *  - Check if username and email are not taken
 *  - Add the new user to the database
 *      - Password is stored with bcrypt.hashSync() function
 *  - Log in the new user and redirect to / 
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 */
function processMakeUser(req, res) {
    console.log("Making user!");
    var username = req.body.givenUsername;
    var email = req.body.givenEmail;
    var pass = req.body.givenPassword;
    var confirmPass = req.body.confirmGivenPassword;

    // Check if the passwords match 
    if (pass != confirmPass) {
        respondWithResult(res, 200)({
            errorCode : "passwords_confirm_mismatch" //  Sent when passwords dont match
        })

        return;
    }

    // Check if the password is long enough 
    if (pass.length < global.MIN_PASSWORD_LENGTH) {
        respondWithResult(res, 200)({
            errorCode : "password_length_short" //  Sent when the password is invalid
        })
        return;
    }

    

}

module.exports = router;
