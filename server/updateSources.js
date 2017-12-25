
// Requirements
var express = require("express");
var app = express();
var debug = require("debug");
var mongoose = require("mongoose");
var kue = require('kue');
var queue = kue.createQueue();
var request = require('request');
var sha1 = require('sha1')
var fs = require('fs');

// Schemas
var Article = require('./schemas/schema-article');
var Source = require('./schemas/schema-source');
var CurrentTopArticle = require('./schemas/schema-current-top-article');

// Debuggers 
var debug_source_update_worker = debug('newssight:source-worker');
var debug_error = debug('newssight:ERROR!');
var debug_important = debug('newssight:IMPORTANT_INFO');

mongoose.Promise = require('bluebird');


/**
 * Called directly from the job, in order to update the DB 
 * @param {Job} job 
 */
function sourceUpdateDB(job) {
    var debug = debug_source_update_worker;
    debug("Beginning source updating for DB");

    // Query the News API to update the DB of sources
    var allowed_langauge = job.data.language;
    var news_api_key = process.env.NEWS_API_KEY;
    
    request.get('https://newsapi.org/v1/sources?language=' + allowed_langauge)
        .on('response', processSourcesResponse);

    // If we want to expand past the NEWS API, we can do so here.

}

function processSourcesResponse(response) {            
    responseData = "";

    response.on('data', function(chunk) {
        responseData += chunk;
    });

    response.on('end', function() {
        debug_source_update_worker("Done Receiving new info from API")
        processNewSourceData(responseData);
    });

    response.on('error', function(err) {
        debug_error(err);
    });
}

/**
 * Process raw data returned from the News API
 * @param {Object} data 
 */
function processNewSourceData(data) {
    var data = JSON.parse(data);
    if (data.status != "ok") {
        debug_error("We messed up: " + data);
        return;
    }

    var sourceList = data.sources;
    for (var i = 0; i < sourceList.length; i++) {
        var source = sourceList[i];
        var sourceDocument = {
                name_id : source.id,
                name : source.name, 
                description : source.description,
                url : source.url,
                category : source.category,
                language : source.language,
                country : source.country,
                sortBysAvailable : source.sortBysAvailable
        };
        var sourceSchemaObj = new Source(sourceDocument);

        addSourceToDb(sourceSchemaObj, source.id, sourceDocument);
    }
}

/**
 * 
 * @param {Source} sourceSchemaObj 
 * @param {String} source_name_id 
 * @param {Object} sourceDocument 
 */
function addSourceToDb(sourceSchemaObj, source_name_id, sourceDocument) {
    // Check if the db is already populated with the given source
    Source.find({ name_id : source_name_id }).exec(function(err, docList) {
        if (docList.length == 0) {
            debug_source_update_worker("Nothing found to match id: " + source_name_id + ". putting it in now.");
            // Put it in
            sourceSchemaObj.save();
        } else if (docList.length == 1) {
            // Update the given one with this new information
            // debug_source_update_worker("Updating to match id: " + source_name_id);
            var current_source_in_db = docList[0];
            Source.update({ name_id : source_name_id }, sourceDocument, function(err, raw) {
                if (err != undefined) {
                    debug_error("Something went wrong when trying to put into db: " + err.toString());
                }
            })
        } else {
            // Something is wrong. Remove all instance and re-insert them. 
            debug_source_update_worker("Looks like there is a duplicate in the databse for id: " + source_name_id + "\n "
                + "Removing and re-inserting now.");
            for (var k = 0; k < docList.length; k++) {
                docList[i].remove();
            }

            // Recursion
            addSourceToDb(sourceSchemaObj, source_name_id, sourceDocument, debug);
        }
    });  
}

const funcs = {
    sourceUpdateDB,
    processSourcesResponse,
    processNewSourceData,
    addSourceToDb
}

module.exports = funcs;