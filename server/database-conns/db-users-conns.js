/**
 * Contains all DB connections for user query purposes
 */

require("string-format").extend(String.prototype)
const debug    = require('debug')('newssight:users-conns');
const debugERR = require('debug')('newssight:ERROR:users-conns');
      debugERR.color = require('debug').colors[5] /* RED */
const connection = require('./connection')
const queryDatabase = require("./utils").queryDatabase;
const tables     = global.TABLES;

const userTableColumns = ["id", "username", "password", "first_name", "last_name", "email"]

 /**
  * Remove all the users in the database
  * @returns {Promise} for the result of the query
  */
 function removeAllUsers() {
    var query = "DELETE FROM users WHERE 1";
    return queryDatabase(query, connection)
 }

 /**
  * Make a new user with the given settings
  * Does not do any username & email consistency checks
  * @param {Object} userSettings 
  * @returns {Promise} for the result of the query
  */
 function makeUser(userSettings) {
    return new Promise(function(fulfill, reject) {
        var query = "INSERT INTO users SET ?";
        connection.query(query, userSettings, function(error, results, fields) {
            if (error) {
                reject(error);
            } else {
                fulfill(results);
            }
        });
    });
 }

 /**
  * Gets user with the given settings
  * @param {Object} userSettings 
  * @returns {Promise} for the result of the query
  */
 function getUser(userSettings) {
    var query = _appendWhereClauses(userSettings, "SELECT * FROM {0} WHERE".format(tables.USERS)); 
    debug("Query = {0}".format(query))
    return queryDatabase(query, connection)
 }

 /**
  * Appends where clausses to the given query and returns it
  * @param {Object} userSettings 
  * @param {String} query 
  */
 function _appendWhereClauses(userSettings, query) {
    var whereClauses = []

    // Create all clauses
    for (var key in userSettings) {
        if (userTableColumns.indexOf(key) > -1) {
            // Acceptable to add into the query
            whereClauses.push("{0} = {1}".format(key, connection.escape(userSettings[key])))
        }
    }

    // Handles the funny case of no where clauses. 
    if (whereClauses.length == 0) {
        query = query + " 1"
        return query
    }

    for (index in whereClauses) {
        if (index > 0) {
            whereClauses[index] = "AND " + whereClauses[index]
        }
    }

    for(index in whereClauses) {
        clause = whereClauses[index]
        query = query + " " + clause
    }

    return query;
 }

 module.exports = {
     removeAllUsers,
     makeUser,
     getUser
 }