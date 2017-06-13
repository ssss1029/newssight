
var express = require('express');
var router = express.Router()
var Source = require('../schemas/schema-source');

router.get('/', supported_sources)

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function supported_sources(req, res) {
  console.log("HERE!");
    Source.find({}).exec(function(err, doclist) {
        var response = {
            status : "ok",
            payload : doclist
        }
        console.log("HERE222!");
        respondWithResult(res)(response);
    })
}

module.exports = router;