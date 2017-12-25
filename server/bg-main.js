/**
 * Handles processes that will run in the background (using kue)
 */

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
var debug_article_worker = debug('newssight:article-worker');
var debug_source_update_worker = debug('newssight:source-worker');
var debug_error = debug('newssight:ERROR!');
var debug_important = debug('newssight:IMPORTANT_INFO');

mongoose.Promise = require('bluebird');

// Helper modules
sourceUpdator = require('./updateSources')
articleUpdator = require('./updateArticles')
util = require('./util')
newsAPIOptions = global.NEWS_API_ALLOWED_SOURCES

function handleErr(err) {
    if (err != undefined) {
        console.log("Error: ")
        debug_error(JSON.stringify(error));
    }
}

/**
 * Reset and clear everything from Mongo and Redis on startup if development
 */
if (process.env.NODE_ENV == 'development') {
    // Clear all jobs
    debug_important("Clearing all redis jobs now");
    util.clearAllMainJobs("inactive");
    util.clearAllMainJobs("active");
    util.clearAllMainJobs("complete");
    util.clearAllMainJobs("failed");
    util.clearAllMainJobs("delayed");    
}

/**
 * Process for updating the database of news articles and watson results
 */
queue.process('main-update-db-worker', function(job, ctx, done) {

    var job = queue.create('main-update-db-worker', newsAPIOptions)
                .delay(60000) // In Milliseconds
                .attempts(2)
                .backoff( {delay: 15000, type: "fixed"} ) // Delay is in ms. 15000 ms = 15 seconds
                .save(handleErr);
    var job_sources = queue.create('update-news-source-info', newsAPIOptions)
                .delay(30000)
                .attempts(2)
                .backoff( {delay: 15000, type : "fixed"} ) // Delay is in ms. 15000 ms = 15 seconds
                .save(handleErr);

    util.setupJobDebuggingMessages(job, debug_article_worker);            
    util.setupJobDebuggingMessages(job_sources, debug_source_update_worker);

    articleUpdator.mainUpdateDB(job);
    done();
});


/**
 * Process for updating the database of news sources
 */
queue.process('update-news-source-info', function(job, ctx, done) {
    sourceUpdator.sourceUpdateDB(job);
    done();
});


var mainJob = queue.create('main-update-db-worker', newsAPIOptions)
                .attempts(2)
                .backoff( {delay: 15000, type: "fixed"} ) // Delay is in ms. 15000 ms = 15 seconds
                .save(handleErr);
util.setupJobDebuggingMessages(mainJob, debug_article_worker);