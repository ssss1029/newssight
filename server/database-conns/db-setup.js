/**
 * Runs the database setup SQL scripts that are in this project.
 * If this module is called as main, the script is still executed.
 */

if (process.env.DEBUG == undefined) {
    process.env.DEBUG = "newssight*";
}

const mysql = require('mysql');
const fs    = require('fs');
const path  = require('path');
const debug = require('debug')('newssight:database-conns');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'developer',
  password : 'developer',
  multipleStatements : true
});

/**
 * Sets up the database
 * @param {Object} options 
 * @param {String} options.SQLScriptLocation The location of the SQL Script to be executed to setup the DB
 */
function setupDb(options) {
    debug("Clearing and resetting up DB");
    const SQLScriptLocation = options.SQLScriptLocation;
    if (SQLScriptLocation == undefined) {
        return "Error setting up Database. Invalid options.";
    }

    // SQLScriptLocaation will be defined.
    const SQL = fs.readFileSync(SQLScriptLocation);
    connection.query(SQL.toString(), function(err, results, fields) {
        if (err) {
            debug(err);
        } else {
            debug("Set up database sucessfully.");
        }
    });
}

if (!module.parent) {
    // This is the main module
    setupDb({SQLScriptLocation : path.join(__dirname, '../../scripts/mysql/CLEAR_AND_CREATE_DATABASE.sql')});
}

module.exports = {
    setupDb
};