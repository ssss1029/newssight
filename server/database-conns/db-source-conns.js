/**
 * Contains all DB connections for source query purposes
 */

require("string-format").extend(String.prototype)
const debug    = require('debug')('newssight:source-conns');
const debugERR = require('debug')('newssight:ERROR:source-conns');
      debugERR.color = require('debug').colors[5] /* RED */
const connection = require('./connection')
const tables     = global.TABLES;

acceptedColumns = new Set(["id", "name", "desciption", "url", "category", "country", "language", "topSortByAvailable", "latestSortByAvailable", "popularSortByAvailable"])

 /**
  * Gets the source(s) that correspond with sourceSettings
  * @param {Object} sourceSettings A mapping of key to value for the properties that we are looking for in the query
  */
 function getSource(sourceSettings, selectClauses) {
    var ORING;
    if (sourceSettings.ORING == undefined || sourceSettings.ORING == false) {
        ORING = false
    } else {
        ORING = true
    }

    var query = "SELECT {0} FROM {1} WHERE {2}".format(_getSelectClauses(selectClauses) , tables.SOURCES, _getWhereClauses(sourceSettings, ORING))
    
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
  * 
  * @param {Array} selectClauses List of all columnds to select
  */
 function _getSelectClauses(selectClauses) {
    if (selectClauses.length == 0 || selectClauses == undefined) {
        return "*"
    }

    var clauses = ""
    for (var i in selectClauses) {
        if (acceptedColumns.has(selectClauses[i])) {
            clauses = clauses + "{0},".format(selectClauses[i])
        }
    }
    clauses = clauses.slice(0, clauses.length - 1); // Remove the last comma 

    return clauses
 }

  /**
  * Returns the whereClauses corresponding to the 
  * @param {Object} sourceSettings 
  * @param {String} query 
  */
 function _getWhereClauses(sourceSettings, ORING) {
    var clauses = ""
    whereClauses = []

    for (var key in sourceSettings) {
        if (acceptedColumns.has(key)) {
            whereClauses.push("{0} = {1}".format(key, connection.escape(sourceSettings[key])));
        }
    }

    for (index in whereClauses) {
        if (index > 0) {
            whereClauses[index] = ORING ? "OR " + whereClauses[index] : "AND " + whereClauses[index]
        }
    }

    for(index in whereClauses) {
        clause = whereClauses[index]
        clauses = clauses + " " + clause
    }

    // Handles the funny case of no where clauses. 
    // Essentially set the clause to "WHERE 1"
    if (whereClauses.length == 0) {
        clauses = clauses + " 1"
    }

    return clauses
 }


 /**
  * Updates the sources of the database with the given data
  * @param {List} sources A list of all the source Objects info to update 
  */
 function updateSources(sources) {
    promises = []
    for (index in sources) {
        promises.push(_doUpdateQuery(sources[index]));
    }

    return Promise.all(promises)
 }

 /**
  * Returns the number of properties in the given object
  * @param {Object} obj
  */
 function _objectLength(obj) {
    let size = 0;
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            size = size + 1;
        }
    }

    return size;
}

/**
 * Returns a promise corresponding to the singular update of a source
 * @param {Object} source The sourcce object. Should contain category, desciption, id, name, etc...
 */
function _doUpdateQuery(source) { 
    const id = source.id;
       
	if (id == null || id == undefined) {
		// Problem. We cannot do this.
		return new Promise(function(resolve, reject) {
			reject("ID not supplied."); 
		});
    } else if (_objectLength(source) <= 1) {
        return new Promise(function(resolve, reject) {
            resolve("Nothing queried. No parameters other than Id detected.")
        })
    } 

    columns = ""
    values = ""
    for (var key in source) {
        if (acceptedColumns.has(key)) {
            columns = columns + "{0},".format(key)
            values = values + "{0},".format(connection.escape(source[key]))
        }
    }
    columns = columns.slice(0, -1);
    values = values.slice(0, -1);

    updateClauses = ""
    for (var key in source) {
        if (acceptedColumns.has(key)) {
            updateClauses = updateClauses + "{0} = {1},".format(key, connection.escape(source[key]))
        }
    }
    updateClauses = updateClauses.slice(0, -1);

    var query = "INSERT INTO {0} ({1}) VALUES ({2}) ON DUPLICATE KEY UPDATE {3};".format(tables.SOURCES, columns, values, updateClauses);
    
    return new Promise(function(resolve, reject) {
        connection.query(query, function(err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}

 module.exports = {
     getSource,
     updateSources
 }
