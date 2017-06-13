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
var sha1 = require('sha1')

// Schemas
var Article = require('./schemas/schema-article');
var Source = require('./schemas/schema-source');

// Debuggers 
var debug_main_worker = debug('newssight:main-worker');
var debug_source_update_worker = debug('newssight:source-worker');
var debug_error = debug('newssight:ERROR!');

// Stupid shit
mongoose.Promise = require('bluebird');

function handleErr(err) {
    if (err != undefined) {
        console.log("Error: ")
        debug_error(JSON.stringify(error));
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


var mainJob = createMainUpdateJob();
setupJobDebuggingMessages(mainJob, debug_main_worker);


var sourceUpdateOptions = global.NEWS_API_ALLOWED_SOURCES
var sourceUpdateJob = createSourceUpdateJob(sourceUpdateOptions);
setupJobDebuggingMessages(sourceUpdateJob, debug_source_update_worker);


/**
 *  ########################### HELPER FUNCTIONS ############################
 */


function mainUpdateDB(job) {
    var debug = job.debuggerOBJ;
    job.debuggerOBJ("Main Updating DB");

    // Query the News API
    Source.find({}, function(err, data) {
        for (var i = 0; i < data.length; i++) {
            var sortBysAvailable = data[i].sortBysAvailable;
            var sortBy = "";
            if (!sortBysAvailable.includes("top")) {
                debug_error("Source does not support sorting by top: " + data[i].name);
                sortBy = sortBysAvailable[0];
            } else {
                sortBy = "top";
            }

            var url = 'https://newsapi.org/v1/articles?source=' + data[i].name_id + '&sortBy=' + sortBy + '&apiKey=' + process.env.NEWS_API_KEY;
            request.get(url).on('response', function(response) {
                responseData = "";

                response.on('data', function(chunk) {
                    responseData += chunk;
                });

                response.on('end', function() {
                    processNewArticleData(responseData, debug);
                });

                response.on('error', function(err) {
                    debug_error(err);
                });
            });
        }
    });
}

/**
 * Processes the data received from querying the news api for a source
 * @param {Object} data 
 * @param {Function} debug 
 */
function processNewArticleData(data, debug) {
    data = JSON.parse(data);
    var newArticles = data.articles;
    var source = data.source;

    for (var i = 0; i < newArticles.length; i++) {
        processArticle(newArticles[i], debug, source);
    }
}

function processArticle(articleObj, debug, source) {

    Article.find({ id : sha1(articleObj.url) }, function (err, data) {
        if (data.length == 0) {
            // Put it into the DB
            debug("FOUND NEW ARTICLE FROM " + source + ": " + articleObj.title);
        } else {
            // Need to do some more processing!
        }
    });

}

/**
 * Called directly from the job, in order to update the DB 
 * @param {Job} job 
 */
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
                debug_error(err);
            });
        });

    // If we want to expand past the NEWS API, we can do so here.

}

/**
 * Process raw data returned from the News API
 * @param {Object} data 
 * @param {Function} debug 
 */
function processNewSourceData(data, debug) {
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

        addSourceToDb(sourceSchemaObj, source.id, sourceDocument, debug);
    }
}

/**
 * 
 * @param {Source} sourceSchemaObj 
 * @param {String} source_name_id 
 * @param {Object} sourceDocument 
 * @param {Function} debug 
 */
function addSourceToDb(sourceSchemaObj, source_name_id, sourceDocument, debug) {
    // Check if the db is already populated with the given source
    Source.find({ name_id : source_name_id }).exec(function(err, docList) {
        if (docList.length == 0) {
            debug("Nothing found to match id: " + source_name_id + ". putting it in now.");
            // Put it in
            sourceSchemaObj.save();
        } else if (docList.length == 1) {
            // Update the given one with this new information
            // debug("Updating to match id: " + source_name_id);
            var current_source_in_db = docList[0];
            Source.update({ name_id : source_name_id }, sourceDocument, function(err, raw) {
                if (err != undefined) {
                    debug_error("Something went wrong when trying to put into db: " + err.toString());
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
 * Clears all the queued up jobs with the given status
 * @param {String} status // Job statuses. See Kue docs for more info
 */
function clearAllMainJobs(status) {
    kue.Job.rangeByState(status, 0, 1000, 'asc', function( err, jobs ) {
        jobs.forEach( function( job ) {
            job.remove();
        });
    });
}

/**
 * Creates the first, non-delayed job for source updates
 * @param {Object} options 
 */
function createSourceUpdateJob(options) {
    return queue.create('update-news-source-info', options)
        .attempts(2)
        .backoff( {delay: 15000, type : "fixed"} ) // Delay is in ms. 15000 ms = 15 seconds
        .save(handleErr);
}


/**
 * Creates the delayed jobs for source updates
 * @param {Object} options 
 * @param {Integer} delay 
 */
function createDelayedSourceUpdateJob(options, delay) {
    return queue.create('update-news-source-info', options)
        .delay(delay)
        .attempts(2)
        .backoff( {delay: 15000, type : "fixed"} ) // Delay is in ms. 15000 ms = 15 seconds
        .save(handleErr);
}

/**
 * Creates the first, non-delayed job for main updates
 */
function createMainUpdateJob() {
    return queue.create('main-update-db-worker')
        .attempts(2)
        .backoff( {delay: 15000, type: "fixed"} ) // Delay is in ms. 15000 ms = 15 seconds
        .save(handleErr);
}

/**
 * Creates the delayed jobs for main updates
 * @param {Integer} delay 
 */
function createDelayedMainUpdateJob(delay) {
    return queue.create('main-update-db-worker')
        .delay(delay)
        .attempts(2)
        .backoff( {delay: 15000, type: "fixed"} ) // Delay is in ms. 15000 ms = 15 seconds
        .save(handleErr);
}

/**
 * Sets up debugger messages for they look nice on the console.
 * Also sets up a job.debuggerOBJ property for each job it gets
 * @param {Job} job 
 * @param {Function} debug 
 */
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
        debug_error('Job failed');
    });
    
    job.on('progress', function(progress, data) {
        debug('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );
    });
}