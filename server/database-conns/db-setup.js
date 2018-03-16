/**
 * Runs the database setup SQL scripts that are in this project.
 * If this module is called as main, the script is still executed.
 */

if (process.env.DEBUG == undefined) {
    process.env.DEBUG = "newssight*";
}

const mysql    = require('mysql');
const fs       = require('fs');
const path     = require('path');
const debug    = require('debug')('newssight:database-conns');
const debugERR = require('debug')('newssight:ERROR:database-conns');
      debugERR.color = require('debug').colors[5] /* RED */

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'developer',
  password : 'developer',
  multipleStatements : true
});

/**
 * Sets up the database
 * @param {Object} options 
 * @param {String} options.scripts The locations for the scripts to be executed
 */
function setupDb(options) {
    debug("Clearing and resetting up DB");
    const scripts = options.scripts;
    if (scripts == undefined) {
        debugERR("Error setting up Database. Invalid options.");
        return;
    }

    var promises = []
    for (index in scripts) {
        let SQL = fs.readFileSync(scripts[index]);
        promises.push(queryDatabase(SQL.toString(), connection));
    }

    return Promise.all(promises)
}

/**
 * Returns a promise for a db query
 * @param {*} query The SQL String to pass to the connection
 * @param {*} connection MySQL connection
 */
function queryDatabase(query, connection) {
    return new Promise(function(fulfill, reject) {
        connection.query(query, function(error, results, fields) {
            if (error) {
                reject(error)
            } else {
                fulfill(results)
            }
        });
    });
}

if (!module.parent) {
    // This is the main module
    setupDb({
        scripts : [
            path.join(global._base, 'scripts/mysql/CLEAR_AND_CREATE_DATABASE.sql'),
            path.join(global._base, 'scripts/mysql/INSERT_DUMMY_DATA.sql')
        ]
    });
}

module.exports = {
    setupDb
};