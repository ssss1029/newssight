/**
 * This is going to be a wrapper for storing articles based on top-ness (lol)
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Stupid shit
mongoose.Promise = require('bluebird');

var TopArticlesSchema = new Schema({
    topness_based_on_source : Number, // More "top" articles will be smaller numbers
    id : String, // Will be the hash of the URL - can then be used for quick lookup in schema-article 
    source : String
});

TopArticlesSchema.index({
    topness_based_on_source : 1,
    source : String,
    id : 1
});

var TopArticles = mongoose.model('TopArticles', TopArticlesSchema);
module.exports = TopArticles;
