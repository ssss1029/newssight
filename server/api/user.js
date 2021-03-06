
var express = require('express');
var passport = require('passport')
var router = express.Router();
var path = require('path');
var Users = require(path.join(global._base, "/server/database-conns/db-users-conns"));
var respondWithResult = require(path.join(global._base, "/server/util")).respondWithResult

const debug    = require('debug')('newssight:/api/makeUser');
const debugERR = require('debug')('newssight:ERROR:/api/makeUser');
      debugERR.color = require('debug').colors[5] /* RED */


var bcrypt = require('bcryptjs');
var saltRounds = 10 // To use with bcrypt
var sha1 = require("sha1");

router.post('/make', processMakeUser);
router.post('/removeAll', removeAllUsers);
router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    res.redirect('/');
  }
);


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
    var username = req.body.givenUsername;
    var email = req.body.givenEmail;
    var pass = req.body.givenPassword;
    var confirmPass = req.body.confirmGivenPassword;

    if (username == undefined || 
        email    == undefined || 
        pass     == undefined || 
        confirmPass == undefined) {
            respondWithResult(res, 200)("imprecise_request");
    }

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

    Users.getUser({username : username}).then(function(results) {
        if (results.length != 0) {
            throw Error("username_taken")
        }

        return Users.getUser({email : email});
        
    }).then(function (results) {
        if (results.length != 0) {
            throw new Error("email_taken");
        }

        return Users.makeUser({
            username : username,
            email : email,
            password : bcrypt.hashSync(pass, saltRounds)
        });

    }).then(function(results) {
        respondWithResult(res, 200)("ok");
    }).catch(function(err) {
        respondWithResult(res, 500)("There was an internal server error");
        debugERR(err.toString());
    });
    

}

/**
 * Removes all users from the database
 * @param {Object} req Express Request object
 * @param {Object} res Express Response object
 */
function removeAllUsers(req, res) {
	Users.removeAllUsers().then(function(result) {
		respondWithResult(res, 200)("ok");
	}).catch(function(err) {
		respondWithResult(res, 500)("ERROR: " + err.toString());
	});
}

module.exports = router;
