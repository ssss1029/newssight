
var express = require('express');
var router = express.Router()
var path = require('path');
var Sources = require(path.join(global._base, "/server/database-conns/db-source-conns"));
var respondWithResult = require(path.join(global._base, "/server/util")).respondWithResult

const util     = require('util');
const debug    = require('debug')('newssight:/api/sources');
const debugERR = require('debug')('newssight:ERROR:/api/sources');
      debugERR.color = require('debug').colors[5] /* RED */

router.get('/', supported_sources)
router.post('/batchUpdate', batchUpdateSources)

/**
 * Express endpoint
 * Respond with a list of all the supported sources
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

/**
 * Express endpoint
 * Takes in a bunch of new sources and adds them to the database if they do not exist there yet
 * @param {Object} req 
 * @param {Array}  req.body.sources Array of Objects with new source data
 * @param {Object} res 
 */
function batchUpdateSources(req, res) {
	if (req.body.sources == undefined || !(Array.isArray(req.body.sources))) {
		respondWithResult(res, 400)("Invalid request. POST must be of the format { \"sources\" : [{}, {}, {} ... ]}");
		return;
	}

	const sources = req.body.sources;

	debug("Sources received");

	respondWithResult(res, 200)("ok");	
	
}

module.exports = router;