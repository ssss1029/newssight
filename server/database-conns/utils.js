
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
                results = results.length == 0 ? "None" : results
                fulfill(results)
            }
        });
    });
}


module.exports = {
    queryDatabase
}