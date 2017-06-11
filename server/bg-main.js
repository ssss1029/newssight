/**
 * Handles processes that will run in the background (using kue)
 */

var express = require("express");
var app = express();
var debug = require("debug")('newssight:bg-main');
var mongoose = require("mongoose");
var kue = require('kue');
var queue = kue.createQueue();

// Schemas
var Article = require('./schemas/article');


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
    setupJobDebuggingMessages(job);
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
    setupJobDebuggingMessages(sourceUpdateJob);

    sourceUpdateDB(job);
    done();
});


var mainJob = createMainUpdateJob();
setupJobDebuggingMessages(mainJob);

var sourceUpdateOptions = global.NEWS_API_ALLOWED_SOURCES
var sourceUpdateJob = createSourceUpdateJob(sourceUpdateOptions);
setupJobDebuggingMessages(sourceUpdateJob);


/**
 *  ########################### HELPER FUNCTIONS ############################
 */

/**
 * The meat of this file
 */
function mainUpdateDB(job) {
    debug("Updating Main DB");

    // Query the News API and run it through Watson.
}

function sourceUpdateDB(job) {
    debug("Updating Sources DB");

    // Query the News API to update the DB of sources
    
}

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

function setupJobDebuggingMessages(job) {
    job.on('complete', function(result){
        debug('Job completed with data ', result);
    });
    
    job.on("enqueue", function() {
        debug('Job enqueued');        
    });

    job.on("startt", function() {
        debug('Job started');        
    });
    
    job.on('failed', function(errorMessage){
        debug('Job failed');
    });
    
    job.on('progress', function(progress, data){
        debug('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );
    });
}