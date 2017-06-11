/**
 * Handles processes that will run in the background (using kue)
 */

var kue = require('kue');
var queue = kue.createQueue();
var Article = require('schemas/article');
var debug = require("debug")('newssight:bg-main');

function handleErr(err) {
    if (err != undefined) {
        console.log("Error: ")
        debug(JSON.stringify(error));
    }
}

queue.process('main-update-db-worker', function(job, done) {
    var delay =  300000; // Delay is in milliseconds : 300000 ms = 5 minutes
    var job = createDelayedMainUpdateJob();
    setupJobDebuggingMessages(job);
})

var job = createMainUpdateJob();
setupJobDebuggingMessages(job);

/**
 *  ########################### HELPER FUNCTIONS ############################
 */
function createMainUpdateJob() {
    return queue.create('main-update-db-worker')
        .attempts(2)
        .backoff( {delay: 15000, type: "fixed"} ) // Delay is in ms. 15000 ms = 15 seconds
        .save(handleErr);
}

function createDelayedMainUpdateJob() {
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