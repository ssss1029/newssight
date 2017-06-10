/**
 * The main schema in which each article is stored
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title : String,
    author : String,
    source : String, // using the News API naming convention for sources
    description : String,
    url : String, 
    urlToImage : String,
    publishedAt : Date,
    savedAt : { type: Date, default: Date.now } // Date at which this article was stored into the database

});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;