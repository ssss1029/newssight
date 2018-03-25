/**
 * DEV API
 * Be sure to remove before deploying 
 * This will remove all the current Users from the database
 */

var express = require('express');
var router = express.Router();
var path = require("path");
var Users = require(path.join(global._base, "/server/database-conns/db-users-conns"));
var respondWithResult = require(path.join(global._base, "/server/util")).respondWithResult;

router.post('/', removeAllUsers)

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