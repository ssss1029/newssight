/**
 * DEV API
 * Be sure to remove before deploying
 * 
 * ############################# THIS IS SUPER DANGEROUS LMFAO #############################
 * 
 * This will remove all the current Users from the database
 */

var express = require('express');
var router = express.Router();
var User = require('../schemas/schema-user');

router.get('/', remove_all_users)

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function remove_all_users(req, res) {
  console.log("REMOVING ALL USERS!");
  User.find({}, function(err, doclist) {
      if (err) {
        respondWithResult(res, 500, {
            error : "Error #y9583jpr. Failed to remove any users from the db."
        })
      }


      for (var i = 0; i < doclist.length; i++) {
          var user = doclist[i];
          user.remove();
      }

        var response = {
            status : "ok",
            removedCount : doclist.length
        }
        respondWithResult(res)(response);

  })
}

module.exports = router;