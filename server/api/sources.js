
var express = require('express');
var router = express.Router()
var path = require('path');
var Sources = require(path.join(global._base, "/server/database-conns/db-source-conns"));

router.get('/', supported_sources)

/**
 * Exposes a function that takes in a JSON response and sends it.
 * @param {Object} res Express response object
 * @param {Integer} statusCode HTTP Status code for the response
 */
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
 * Uses the res object to respond with a list of all the supported sources
 * @param {Object} req Express Request object
 * @param {Object} res Express Response object
 */
function supported_sources(req, res) {
	Sources.getSource({}).then(function(result) {
		respondWithResult(res, 200)(result);			
	}).catch(function(error) {
		respondWithResult(res, 200)(error.toString());
	});
} 

module.exports = router;