
var express = require('express');
var router = express.Router()
var path = require('path');

var respondWithResult = require(path.join(global._base, "/server/util")).respondWithResult
var Articles = require(path.join(global._base, "/server/database-conns/db-article-conns"));
const debug    = require('debug')('newssight:/api/articles');
const debugERR = require('debug')('newssight:ERROR:/api/articles');
      debugERR.color = require('debug').colors[5] /* RED */

router.get('/homepage', getHomepageArticles);

const LEV_MATCH_THRESHOLD = 0.83;

/**
 * Get the articles that belong on the home page, grouped by the top trendin entities
 * Right now, we pull ALL articles from the DB, and group them by trending entities
 *      
 *      result: {
 *          entity1: [ {<article1 information>}, {<article2 information>} ... ],
 *          entity2: [ {<article1 information>}, {<article2 information>} ... ],
 *          entity3: [ {<article1 information>}, {<article2 information>} ... ]
 *      }
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
function getHomepageArticles(req, res) {
    Articles.getEntities().then(function(result) {
        var uniqueEntities = {}
        for (var i = 0; i < result.length; i++) {
            var current = result[i]
            var addedCurrent = false;
            // Check if the current result target is in the unique entities object
            for (var entity in uniqueEntities) {
                if (levenshteinRatio(entity, current["target"]) >= LEV_MATCH_THRESHOLD && addedCurrent != true) {
                    uniqueEntities[entity].push(current)
                    addedCurrent = true
                }
            }

            if (addedCurrent == false) {
                // We have a brand new one here
                uniqueEntities[current["target"]] = []
                uniqueEntities[current["target"]].push(current)
            }
        }

        for (var entity in uniqueEntities) {
            if (entity.indexOf("Donald") > -1) {
                debug("Keyword {0} has matched with {1} entity results".format(entity, uniqueEntities[entity].length))
//                debug(uniqueEntities[entity])
            }

//            debug("Keyword {0} has matched with {1} entity results".format(entity, uniqueEntities[entity].length))
        }

        // Finished mapping String -> Array of entities.
        // Do mapping String -> Array of articles
        var entityToArticles = {}
        var promises = []
        for (var key in uniqueEntities) {
            entityToArticles[key] = []
            for (var i = 0; i < uniqueEntities[key].length; i++) {
                var entity = uniqueEntities[key][i]
                var id = entity["articleId"]
                promises.push(Articles.getArticles({id : id}).then(function (results) {
                    var article = results[0]
                    entityToArticles[this.entity].push({
                        id : article["id"],
                        title : article["title"],
                        author : article["author"],
                        sourceId : article["sourceId"],
                        description : article["description"],
                        url : article["url"],
                        urlToImage : article["urlToImage"],
                        publishedAt : article["publishedAt"],
                        savedAt : article["savedAt"],
                    });
                }.bind({entity : key})))
            }
        }

        Promise.all(promises).then(function() {
            var sortable = []
            for (var entity in entityToArticles) {
                var originals = uniqueEntities[entity]
                var totalSalience = 0
                for (var i = 0; i < originals.length; i++) {
                    totalSalience = totalSalience + originals[i]["salience"]
                }

                entityToArticles[entity] = {
                    salience : totalSalience,
                    articles : entityToArticles[entity]
                }
                
                var obj = {
                    entity : entity,
                    salience : totalSalience,
                    articles : entityToArticles[entity]
                }

                sortable.push([totalSalience, obj])
            }

            sortable.sort(function (a, b) {
                return b[0] - a[0]
            });

            debug(sortable[0])

            respondWithResult(res, 200)(sortable)
        })

    }).catch(function(error) {
        debugERR(error)
        respondWithResult(res, 500)("There has been an internal server error at GET /articles/homepage")
    })
}

/**
 * Return a promise that adds the given article with articleId to entityToArticles with the key entity
 * @param {*} entityToArticles 
 * @param {*} entity 
 * @param {*} articleId 
 */
function addArticleToEntity(entityToArticles, entity, articleId) {
    return Articles.getArticles({id : articleId}).then(function (results) {
        entityToArticles[entity].push(results[0]);
    })
}

/**
 * Gets the levenshtein ratio between two strings
 * @param {String} a 
 * @param {String} b 
 */
function levenshteinRatio(a, b) {
    let ld = levenshteinDistance(a, b)
    return 1 - (ld / (a.length + b.length))
}

/**
 * Iterative Implementation of Levenshtein Distance between two strings
 * @param {String} a 
 * @param {String} b 
 */
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length; 
    if (b.length === 0) return a.length; 

    let matrix = [];

    // Create an empty |a| x |b| matrix.
    for (let i = 0; i <= b.length; ++i) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; ++j) {
        matrix[0][j] = j;
    }


    for (let i = 1; i <= b.length; ++i) {
        for (let j = 1; j <= a.length; ++j) {
            if (b[i-1] === a[j-1]) {
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i-1][j-1] + 1,
                    matrix[i][j-1] + 1,
                    matrix[i-1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

module.exports = router;