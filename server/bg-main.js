/**
 * Handles processes that will run in the background (using kue)
 */

var express = require("express");
var app = express();
var debug = require("debug");
var mongoose = require("mongoose");
var kue = require('kue');
var queue = kue.createQueue();
var request = require('request');

// Schemas
var Article = require('./schemas/schema-article');
var Source = require('./schemas/schema-source');

// Debuggers 
var debug_main_worker = debug('newssight:main-worker');
var debug_source_update_worker = debug('newssight:source-worker');


function handleErr(err) {
    if (err != undefined) {
        console.log("Error: ")
        debug(JSON.stringify(error));
    }
}

/**
 * Reset the Queue on startup
 */
if (process.env.NODE_ENV == 'development') {
    // Clear all jobs
    clearAllMainJobs("inactive");
    clearAllMainJobs("active");
    clearAllMainJobs("complete");
    clearAllMainJobs("failed");
    clearAllMainJobs("delayed");
}


/**
 * Process for updating the database of news articles and watson results
 */
queue.process('main-update-db-worker', function(job, ctx, done) {
    var delay =  5000; // Delay is in milliseconds : 300000 ms = 5 minutes
    var job = createDelayedMainUpdateJob(delay);
    setupJobDebuggingMessages(job, debug_main_worker);
    mainUpdateDB(job);
    done();
});

/**
 * Process for updating the database of news sources
 */
queue.process('update-news-source-info', function(job, ctx, done) {
    var delay =  7000; // Delay is in milliseconds : 300000 ms = 5 minutes
    var sourceUpdateOptions = global.NEWS_API_ALLOWED_SOURCES
    var sourceUpdateJob = createDelayedSourceUpdateJob(sourceUpdateOptions, delay);
    setupJobDebuggingMessages(sourceUpdateJob, debug_source_update_worker);

    sourceUpdateDB(sourceUpdateJob);
    done();
});

/*
var mainJob = createMainUpdateJob();
setupJobDebuggingMessages(mainJob, debug_main_worker);
*/

var sourceUpdateOptions = global.NEWS_API_ALLOWED_SOURCES
var sourceUpdateJob = createSourceUpdateJob(sourceUpdateOptions);
setupJobDebuggingMessages(sourceUpdateJob, debug_source_update_worker);


/**
 *  ########################### HELPER FUNCTIONS ############################
 */

function mainUpdateDB(job) {
    var debug = job.debuggerOBJ;
    job.debuggerOBJ("Main Updating DB");

    // Query the News API and run it through Watson!

}

function sourceUpdateDB(job) {
    var debug = job.debuggerOBJ;
    debug("Beginning source updating for DB");

    // Query the News API to update the DB of sources
    var allowed_langauge = job.data.language;
    var news_api_key = process.env.NEWS_API_KEY;
    
    request.get('https://newsapi.org/v1/sources?language=' + allowed_langauge)
        .on('response', function(response) {
            
            responseData = "";

            response.on('data', function(chunk) {
                responseData += chunk;
            });

            response.on('end', function() {
                debug("Done Receiving new info from API")
                processNewSourceData(responseData, debug);
            });

            response.on('error', function(err) {
                debug(err);
            });
        });

    // If we want to expand past the NEWS API, we can do so here.

}

/**
 * Processes new data from the NEWS API
 */
function processNewSourceData(data, debug) {
    var data = JSON.parse(data);
    if (data.status != "ok") {
        debug("We messed up: " + data);
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

        addSourceToDb(sourceSchemaObj, source.id, sourceDocument, debug);
    }
}

function addSourceToDb(sourceSchemaObj, source_name_id, sourceDocument, debug) {
    // Check if the db is already populated with the given source
    Source.find({ name_id : source_name_id }).exec(function(err, docList) {
        if (docList.length == 0) {
            debug("Nothing found to match id: " + source_name_id + ". putting it in now.");
            // Put it in
            sourceSchemaObj.save();
        } else if (docList.length == 1) {
            // Update the given one with this new information
            debug("Updating to match id: " + source_name_id);
            var current_source_in_db = docList[0];
            Source.update({ name_id : source_name_id }, sourceDocument, function(err, raw) {
                if (err != undefined) {
                    debug("Something went wrong when trying to put into db: " + err.toString());
                }
            })
        } else {
            // Something is wrong. Remove all instance and re-insert them. 
            debug("Looks like there is a duplicate in the databse for id: " + source_name_id + "\n "
                + "Removing and re-inserting now.");
            for (var k = 0; k < docList.length; k++) {
                docList[i].remove();
            }

            // Recursion!
            addSourceToDb(sourceSchemaObj, source_name_id, sourceDocument, debug);
        }
    });  
}


/**
 * Job helpers
 */
function clearAllMainJobs(status) {
    kue.Job.rangeByState(status, 0, 1000, 'asc', function( err, jobs ) {
        jobs.forEach( function( job ) {
            job.remove();
        });
    });
}

function createSourceUpdateJob(options) {
    return queue.create('update-news-source-info', options)
        .attempts(2)
        .backoff( {delay: 15000, type : "fixed"} ) // Delay is in ms. 15000 ms = 15 seconds
        .save(handleErr);
}

function createDelayedSourceUpdateJob(options, delay) {
    return queue.create('update-news-source-info', options)
        .delay(delay)
        .attempts(2)
        .backoff( {delay: 15000, type : "fixed"} ) // Delay is in ms. 15000 ms = 15 seconds
        .save(handleErr);
}

function createMainUpdateJob() {
    return queue.create('main-update-db-worker')
        .attempts(2)
        .backoff( {delay: 15000, type: "fixed"} ) // Delay is in ms. 15000 ms = 15 seconds
        .save(handleErr);
}

function createDelayedMainUpdateJob(delay) {
    return queue.create('main-update-db-worker')
        .delay(delay)
        .attempts(2)
        .backoff( {delay: 15000, type: "fixed"} ) // Delay is in ms. 15000 ms = 15 seconds
        .save(handleErr);
}

function setupJobDebuggingMessages(job, debug) {
    job.debuggerOBJ = debug;

    job.on('complete', function(result){
        debug('Job completed with data ', result);
    });
    
    job.on("enqueue", function() {
        debug('Job enqueued');        
    });

    job.on("startt", function() {
        debug('Job started');        
    });
    
    job.on('failed', function(errorMessage) {
        debug('Job failed');
    });
    
    job.on('progress', function(progress, data) {
        debug('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );
    });
}