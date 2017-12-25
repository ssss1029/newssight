
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
var debug_main_worker = debug('newssight:main-worker');
var debug_source_update_worker = debug('newssight:source-worker');
var debug_error = debug('newssight:ERROR!');
var debug_important = debug('newssight:IMPORTANT_INFO');

mongoose.Promise = require('bluebird');


/**
 * Sets up debugger messages for they look nice on the console.
 * Also sets up a job.debuggerOBJ property for each job it gets
 * @param {Job} job 
 * @param {Function} debug 
 */
function setupJobDebuggingMessages(job, debug) {
    job.on('complete', function(result){
        debug('Job completed with data ', result);
    });
    
    job.on("enqueue", function() {
        debug('Job enqueued');        
    });

    job.on("start", function() {
        debug('Job started');        
    });
    
    job.on('failed', function(errorMessage) {
        debug_error('Job failed');
    });
    
    job.on('progress', function(progress, data) {
        debug('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );
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
 * Removes all the Source items from the DB
 */
function clearAllSources() {
    Source.find({}, function (err, docList) {
        for (var i = 0; i < docList.length; i++) {
            docList[i].remove();
        }
    });
}

/**
 * Removes all the Article items from the DB
 */
function clearAllArticles() {
    Article.find({}, function (err, docList) {
        for (var i = 0; i < docList.length; i++) {
            docList[i].remove();
        }
    });

    CurrentTopArticle.find({}, function (err, docList) {
        for (var i = 0; i < docList.length; i++) {
            docList[i].remove();
        }
    });
}

const funcs = {
    setupJobDebuggingMessages,    
    clearAllMainJobs,
    clearAllSources,    
    clearAllArticles
}

module.exports = funcs;