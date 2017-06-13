/**
 * This is going to be a wrapper for storing articles based on top-ness (lol)
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Stupid shit
mongoose.Promise = require('bluebird');

var TopArticleSchema = new Schema({
    topness : Number
    id : String // Will be the hash of the URL - can then be used for quick lookup in schema-article 
});

ArticleSchema.index({
    topness : 1,
    id : 1
});

var TopArticle = mongoose.model('TopArticle', TopArticleSchema);
module.exports = TopArticle;
