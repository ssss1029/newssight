/**
 * Contains all DB connections for user query purposes
 */

require("string-format").extend(String.prototype)
const debug    = require('debug')('newssight:users-conns');
const debugERR = require('debug')('newssight:ERROR:users-conns');
      debugERR.color = require('debug').colors[5] /* RED */
const connection = require('./connection')
const tables     = global.TABLES;

 /**
  * Remove all the users in the database
  * @returns {Promise} for the result of the query
  */
 function removeAllUsers() {
    var query = "DELETE FROM users WHERE 1";
    return new Promise(function (fulfill, reject) {
        connection.query(query, function(err, results, fields) {
            if (err) {
                reject(err);
            } else {
                fulfill(results);
            }
        });
    });
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
    return new Promise(function(fulfill, reject) {
        connection.query(query, function(error, results, fields) {
            if (error) {
                reject(error)
            } else {
                fulfill(results);
            }
        });
    })
 }

 /**
  * Appends where clausses to the given query and returns it
  * @param {Object} userSettings 
  * @param {String} query 
  */
 function _appendWhereClauses(userSettings, query) {
    whereClauses = []

    _pushIfNotNull(whereClauses, "id = "         + connection.escape(userSettings.id),         userSettings.id);
    _pushIfNotNull(whereClauses, "username = "   + connection.escape(userSettings.username),   userSettings.username);
    _pushIfNotNull(whereClauses, "password = "   + connection.escape(userSettings.password),   userSettings.password);
    _pushIfNotNull(whereClauses, "first_name = " + connection.escape(userSettings.first_name), userSettings.first_name);
    _pushIfNotNull(whereClauses, "last_name = "  + connection.escape(userSettings.last_name),  userSettings.last_name);
    _pushIfNotNull(whereClauses, "email = "      + connection.escape(userSettings.email),      userSettings.email);

    for (index in whereClauses) {
        if (index > 0) {
            whereClauses[index] = "AND " + whereClauses[index]
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
     removeAllUsers,
     makeUser,
     getUser
 }