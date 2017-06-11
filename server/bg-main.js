/**
 * Handles processes that will run in the background (using kue)
 */

var express = require("express");
var app = express();
var debug = require("debug")('newssight:bg-main');

var kue = require('kue');
var queue = kue.createQueue();

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


queue.process('main-update-db-worker', function(job, ctx, done) {
    var delay =  5000; // Delay is in milliseconds : 300000 ms = 5 minutes
    var job = createDelayedMainUpdateJob(delay);
    setupJobDebuggingMessages(job);
    updateDB(job);
    done();
})

var job = createMainUpdateJob();
setupJobDebuggingMessages(job);

/**
 *  ########################### HELPER FUNCTIONS ############################
 */

/**
 * The meat of this file
 */
function updateDB(job) {
    debug("Updating DB!!!");
}

function clearAllMainJobs(status) {
    kue.Job.rangeByState(status, 0, 1000, 'asc', function( err, jobs ) {
        jobs.forEach( function( job ) {
            job.remove();
        });
    });
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
        .backoff( {delay: 15000, type: "fixed"} )
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