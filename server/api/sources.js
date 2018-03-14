
var express = require('express');
var router = express.Router()
var path = require('path');
var Sources = require(path.join(global._base, "/server/database-conns/db-source-conns"));
var respondWithResult = require(path.join(global._base, "/server/util"))

router.get('/', supported_sources)

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