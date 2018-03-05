/**
 * Contains all connections to DynamoDB for authentication purposes.
 * Also contains all connections to the users table in DynamoDB
 */

var AWS = require('aws-sdk');

/**
 * Returns the DynamoDB Storage object that is used for storing session data
 * by express-session. Uses the dynamodb-store package.
 */
function getSessionStore() {
    
}

/**
 * Returns a serialized representation of the given user object.
 * @param {Object} user 
 */
function serializeUser(user) {

}

/**
 * Returns the deserialized (Object) representation of the user
 * with the given id.
 * @param {String} user 
 */
function deserializeUser(id) {

}

/**
 * Calls callback on a user with the given options
 * @param {Object} options (e.g. {username : JohnSmith})
 * @param {Function} callback 
 */
function getUser(options, next) {
    user = null;
    err  = null;

    return next(err, user);
}

module.exports = {
    getSessionStore,
    serializeUser,
    deserializeUser
}