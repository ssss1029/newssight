
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


/**
 * Updates the main Article documents
 * @param {Job} job
 */
function mainUpdateDB(job) {
    var debug = debug_article_worker;
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
    if (newArticles != null) {
        for (var i = 0; i < newArticles.length; i++) {
            processArticle(newArticles[i], source, 0);
        }
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
            // debug_article_worker("Source: " + source + " has " + docs.length + " articles in the top db.")
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
            debug_article_worker("FOUND NEW ARTICLE FROM " + source + ": " + articleObj.title);            
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

const funcs = {
    mainUpdateDB,
    processArticlesResponse,
    processNewArticleData,
    checkCurrentTopArticles,
    checkCurrentTopArticlesHelper,
    processArticle,
    addToArticleDB, 
    insertIntoCurrent
}

module.exports = funcs;