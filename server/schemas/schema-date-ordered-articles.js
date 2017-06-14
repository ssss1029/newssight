/**
 * This is going to be a wrapper for storing articles based on top-ness (lol)
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Stupid shit
mongoose.Promise = require('bluebird');

var DateOrderedArticlesSchema = new Schema({
    topness : Number, // More "top" articles will be smaller numbers
    id : String // Will be the hash of the URL - can then be used for quick lookup in schema-article 
});

DateOrderedArticlesSchema.index({
    topness : 1,
    id : 1
});

var DateOrderedArticles = mongoose.model('DateOrderedArticles', DateOrderedArticlesSchema);
module.exports = TopArticles;
