
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

function processMakeUser(req, res) {
    console.log("Making user!");
    var username = req.body.givenUsername;
    var email = req.body.givenEmail;
    var pass = req.body.givenPassword;
    var confirmPass = req.body.confirmGivenPassword;

    // Check if the passwords match 
    if (pass != confirmPass) {
        respondWithResult(res, 200)({
            whatWentWrong : "1" //  Sent when passwords dont match
        })

        return;
    }

    // Check if the password is long enough 
    if (pass.length < 10) {
        respondWithResult(res, 200)({
            whatWentWrong : "2" //  Sent when the password is invalid
        })
        
        return;
    }

    // Check if the username is not taken
    User.find({ username : username }, function(err, response) {
        if (response.length != 0) {
            respondWithResult(res, 200)({
                whatWentWrong : "3" // Sent when the user already exists
            })
            return;
        }

        User.find({ email : email }, function(err, response) {
            if (response.length != 0) {
                respondWithResult(res, 200)({
                    whatWentWrong : "5" // Sent when the user already exists
                })
                return;
            }

            // Add the user to DB
            var newUser = new User({
                id : sha1(username),
                username : username,
                password : bcrypt.hashSync(pass, saltRounds),
                email : email
            });

            newUser.save();

            // Log in the user with the given information
            req.logIn(newUser, function(err) {
                if (err) {
                    
                    console.log(err);
                    respondWithResult(res, 500)({
                        whatWentWrong : "4" // Internal Server Error
                    });

                } else {
                    res.redirect("/");
                }
            });
        });
    });
}

module.exports = router;
