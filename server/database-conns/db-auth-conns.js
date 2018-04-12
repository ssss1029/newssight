/**
 * Contains all connections to the database for authentication purposes.
 */


/**
 * Returns the DynamoDB Storage object that is used for storing session data
 * by express-session. Uses the dynamodb-store package.
 * @param {Object} session result of require('express-session')
 */
function getSessionStore(session) {
    var MySQLStore = require('express-mysql-session')(session);
 
    var options = {
        host: 'localhost',
        port: 3306,
        user: 'developer',
        password: 'developer',
        database: 'newssight',
        createDatabaseTable: true,
        // How frequently expired sessions will be cleared; milliseconds:
        checkExpirationInterval: 900000,
        // The maximum age of a valid session; milliseconds:
        expiration: 86400000,
        // Number of connections when creating a connection pool:
        connectionLimit: 1,
        charset: 'utf8mb4_bin',
        schema: {
            tableName: 'sessions',
            columnNames: {
                session_id: 'session_id',
                expires: 'expires',
                data: 'data'
            }
        }
    };
    
 
    var sessionStore = new MySQLStore(options);
    return sessionStore;
}


module.exports = {
    getSessionStore
}