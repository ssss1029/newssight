/**
 * The main schema in which each user is stored
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Stupid shit
mongoose.Promise = require('bluebird');

var UserSchema = new Schema({
    id : String,        // REQ, will be defined to be sha1(username)
    username : String,  // REQ
    password : String,  // REQ, Will be a hash doen through bcrypt
    firstName : String, // optional
    lastName : String,  // optional
    email : String      // REQ
});

var User = mongoose.model('User', UserSchema);
module.exports = User;