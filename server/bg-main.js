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

// Stupid shit
mongoose.Promise = require('bluebird');


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
    clearAllMainJobs("inactive");
    clearAllMainJobs("active");
    clearAllMainJobs("complete");
    clearAllMainJobs("failed");
    clearAllMainJobs("delayed");

    
//  Clear the databases
//  debug_important("Wiping the databases of Sources and Articles");
//  clearAllSources(); Theres some good shit in the db, beware before uncommenting
    // This clears BOTH DBS
//  clearAllArticles(); Theres some good shit in the db, beware before uncommenting
    
}


/**
 * Process for updating the database of news articles and watson results
 */
queue.process('main-update-db-worker', function(job, ctx, done) {
    var options = global.NEWS_API_ALLOWED_SOURCES

    var delay =  60000; // Delay is in milliseconds : 300000 ms = 5 minutes
    var job = createDelayedMainUpdateJob(options, delay);
    setupJobDebuggingMessages(job, debug_main_worker);

    var delay =  30000; // Delay is in milliseconds : 300000 ms = 5 minutes
    var job_sources = createDelayedSourceUpdateJob(options, delay);
    setupJobDebuggingMessages(job_sources, debug_source_update_worker);


    mainUpdateDB(job);
    done();
});


/**
 * Process for updating the database of news sources
 */
queue.process('update-news-source-info', function(job, ctx, done) {
    sourceUpdateDB(job);
    done();
});



var mainJob = createMainUpdateJob();
setupJobDebuggingMessages(mainJob, debug_main_worker);

/*
var sourceUpdateOptions = global.NEWS_API_ALLOWED_SOURCES
var sourceUpdateJob = createSourceUpdateJob(sourceUpdateOptions);
setupJobDebuggingMessages(sourceUpdateJob, debug_source_update_worker);
*/

/**
 *  ########################### HELPER FUNCTIONS ############################
 */

/**
 * Updates the main Article documents
 * @param {Job} job
 */
function mainUpdateDB(job) {
    var debug = debug_main_worker;
    debug("Main Updating DB");

    // Query the News API for all the sources in the DB
    Source.find({}, function(err, data) {
        for (var i = 0; i < data.length; i++) {
            var sortBysAvailable = data[i].sortBysAvailable;
            var sortBy = "";
            if (!sortBysAvailable.includes("top")) {
                sortBy = sortBysAvailable[0];
            } else {
                sortBy = "top";
            }

            var url = 'https://newsapi.org/v1/articles?source=' + data[i].name_id + '&sortBy=' + sortBy + '&apiKey=' + process.env.NEWS_API_KEY;
            request.get(url).on('response', processArticlesResponse);
        }
    });

    checkCurrentTopArticles();

}

function processArticlesResponse(response) {
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
}

/**
 * Processes the data received from querying the news api for a source
 * @param {Object} data 
 * @param {Function} debug 
 */
function processNewArticleData(data, debug) {
    try {
        data = JSON.parse(data);
    } catch(err) {
        console.log(err);
        fs.writeFile("errorlog.txt", data, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("SAVED ERROR DATA TO errorlog.txt")
            }
        })
    }

    var newArticles = data.articles;
    var source = data.source;

    for (var i = 0; i < newArticles.length; i++) {
        processArticle(newArticles[i], source, 0);
    }
}

function checkCurrentTopArticles() {
    Source.find({}, function(err, docs) {
        if (err) {
            debug_error(err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                checkCurrentTopArticlesHelper(docs[i].name_id);
            }
        }
    });
}

function checkCurrentTopArticlesHelper(source) {
    CurrentTopArticle.find({source : source}).sort({savedAt : 1}).exec(function(err, docs) {
        if (err) {
            debug_error(err);
            return;
        }

        if (docs.length >= 15) {
            // We need to delete one before adding 
            // Recursion is the only way FML            
            docs[docs.length - 1].remove(function(err, res) {
                if (err) {
                    debug_error(err)
                } else {
                    // Try again
                    checkCurrentTopArticlesHelper(source);
                }
            })
        } else {
            // debug_main_worker("Source: " + source + " has " + docs.length + " articles in the top db.")
        }
        
    })
}

/**
 * Processes a single Article Object, and correctly adds it to the database
 * @param {Object} articleObj 
 * @param {String} source 
 */
function processArticle(articleObj, source) {
    Article.find({ id : sha1(articleObj.url) }, function (err, data) {
        if (data.length == 0) {
            // Put it into the DB
            debug_main_worker("FOUND NEW ARTICLE FROM " + source + ": " + articleObj.title);            
            addToArticleDB(articleObj, source);
        } else {
            // Need to do some more processing
            // JK there is nothing to do here
        }
    });
}


/**
 * Just adds the article to the main DB
 * @param {Object} articleObj 
 * @param {String} source 
 */
function addToArticleDB(articleObj, source) {
    var article = {};

    // Dumb bullshit & horrible code incoming
    if (articleObj.author != undefined) {
        article.author = articleObj.author;
    }

    if (articleObj.title != undefined) {
        article.title = articleObj.title;
    }

    if (articleObj.url != undefined) {
        article.id = sha1(articleObj.url);
        article.url = articleObj.url;
    }

    if (articleObj.description != undefined) {
        article.description = articleObj.description;
    }

    if (articleObj.urlToImage != undefined) {
        article.urlToImage = articleObj.urlToImage;
    }

    if (articleObj.publishedAt != undefined) {
        article.publishedAt = articleObj.publishedAt;
    }

    article.source = source

    // TODO: Here is where we will add all of the watson data



    // Save our shit
    article_main = new Article(article);
    article_main.save();
    
    insertIntoCurrent(article);
}

function insertIntoCurrent(article) {
    CurrentTopArticle.find({source : article.source}).sort({savedAt : 1}).exec(function(err, docs) {
        if (err) {
            debug_error(err);
            return;
        }
        if (docs.length >= 15) {
            // We need to delete one before adding 
            // Recursion is the only way FML
            
            docs[docs.length - 1].remove(function(err, res) {
                if (err) {
                    debug_error(err)
                } else {
                    // Try again
                    insertIntoCurrent(article);
                }
            })
            
        } else {
            // It is okay to add right now            
            article_top = new CurrentTopArticle(article);
            article_top.save();
        }
    })
}

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
function createMainUpdateJob(options) {
    return queue.create('main-update-db-worker', options)
        .attempts(2)
        .backoff( {delay: 15000, type: "fixed"} ) // Delay is in ms. 15000 ms = 15 seconds
        .save(handleErr);
}

/**
 * Creates the delayed jobs for main updates
 * @param {Integer} delay 
 */
function createDelayedMainUpdateJob(options, delay) {
    return queue.create('main-update-db-worker', options)
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