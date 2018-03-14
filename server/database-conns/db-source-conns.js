/**
 * Contains all DB connections for source query purposes
 */

require("string-format").extend(String.prototype)
const debug    = require('debug')('newssight:users-conns');
const debugERR = require('debug')('newssight:ERROR:users-conns');
      debugERR.color = require('debug').colors[5] /* RED */
const connection = require('./connection')
const tables     = global.TABLES;

 /**
  * Gets the source(s) that correspond with sourceSettings
  * @param {Object} sourceSettings A mapping of key to value for the properties that we are looking for in the query
  */
 function getSource(sourceSettings) {
    var ORING;
    if (sourceSettings.ORING == undefined) {
        ORING = false
    } else {
        ORING = true
    }

    var query = _appendWhereClauses(sourceSettings, 
        "SELECT * FROM {0} WHERE".format(tables.SOURCES),
        ORING);
    
    debug("Querying for sources: {0}".format(query));
    
    return new Promise(function(fulfill, reject) {
        connection.query(query, function(error, result, fields) {
            if (error) {
                reject(error)
            } else {
                result = result.length == 0 ? "None" : result
                fulfill(result);
            }
        })
    });
 }

  /**
  * Appends where clausses to the given query and returns it
  * @param {Object} sourceSettings 
  * @param {String} query 
  */
 function _appendWhereClauses(sourceSettings, query, ORING) {
    whereClauses = []

    _pushIfNotNull(whereClauses, "id = " + connection.escape(sourceSettings.id), sourceSettings.id);
    _pushIfNotNull(whereClauses, "name = " + connection.escape(sourceSettings.name), sourceSettings.username);
    _pushIfNotNull(whereClauses, "description = " + connection.escape(sourceSettings.description), sourceSettings.password);
    _pushIfNotNull(whereClauses, "url = " + connection.escape(sourceSettings.url), sourceSettings.first_name);
    _pushIfNotNull(whereClauses, "category = " + connection.escape(sourceSettings.category), sourceSettings.last_name);
    _pushIfNotNull(whereClauses, "country = " + connection.escape(sourceSettings.country), sourceSettings.email);
    _pushIfNotNull(whereClauses, "language = " + connection.escape(sourceSettings.language), sourceSettings.email);
    _pushIfNotNull(whereClauses, "topSortByAvailable = " + connection.escape(sourceSettings.topSortByAvailable), sourceSettings.email);
    _pushIfNotNull(whereClauses, "latestSortByAvailable = " + connection.escape(sourceSettings.latestSortByAvailable), sourceSettings.email);
    _pushIfNotNull(whereClauses, "popularSortByAvailable = " + connection.escape(sourceSettings.popularSortByAvailable), sourceSettings.email);

    for (index in whereClauses) {
        if (index > 0) {
            whereClauses[index] = ORING ? "OR " + whereClauses[index] : "AND " + whereClauses[index]
        }
    }

    for(index in whereClauses) {
        clause = whereClauses[index]
        query = query + " " + clause
    }

    // Handles the funny case of no where clauses. 
    // Essentially set the clause to "WHERE 1"
    if (whereClauses.length == 0) {
        query = query + " 1"
    }

    return query
 }

 /**
  * Pushes value onto list if test != null or undefined
  * @param {Array} list 
  * @param {Object} value 
  * @param {Object} test 
  */
 function _pushIfNotNull(list, value, test) {
    if (test != null && test != undefined) {
        list.push(value)
    }
 }

 module.exports = {
     getSource
 }
