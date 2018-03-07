
const mysql = require('mysql');
const fs = require('fs');
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
 */
function setupDb(options) {
    const SQLScriptLocation = options.SQLScriptLocation;
    if (SQLScriptLocation = undefined) {
        return "Error setting up Database. Invalid options.";
    }

    // SQLScriptLocaation will be defined.
    const SQL = fs.readFileSync(SQLScriptLocation);
    connection.query(SQL, function(err, results, fields) {
        if (err) {
            debug(err);
        } else {
            debug("Set up database sucessfully.");
        }
    });
}

module.exports = {
    setupDb
};