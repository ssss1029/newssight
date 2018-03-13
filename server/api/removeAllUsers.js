/**
 * DEV API
 * Be sure to remove before deploying 
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

/**
 * Removes all users from the database
 * @param {Object} req Express Request object
 * @param {Object} res Express Response object
 */
function remove_all_users(req, res) {
  
}

module.exports = router;