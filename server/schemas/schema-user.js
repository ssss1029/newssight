/**
 * The main schema in which each user is stored
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Stupid shit
mongoose.Promise = require('bluebird');

var UserSchema = new Schema({
    id : String, // Will be a hash of the username
    username : String,
    password : String, // Will be a hash
    firstName : String,
    lastName : String,
    email : String  // Optional 

});

var User = mongoose.model('User', UserSchema);
module.exports = User;