/**
 * The main schema in which each article is stored
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = require('bluebird');

var ArticleSchema = new Schema({
    id : String, // Will be the SHA1 hash of the url
    title : String,
    author : String,
    source : String, // using the News API naming convention for sources
    description : String,
    url : String, 
    urlToImage : String,
    publishedAt : Date,
    savedAt : { type: Date, default: Date.now }, // Date at which this article was stored into the database
    
    watsonEntityResults : [{
        type : String,
        text : String, 
        sentiment : { score : Number },
        emotion : {}, // Need to fill this in.
        relevance : Number,
        disambiguation : {
            subtype : [],
            name : String,
            dbpedia_resource : String
        },
        count : Number
    }],

    watsonKeywordsResults : [{
        text : [String], // The original text is spliced by " " and made into an array here 
        sentiment : { score : Number },
        relevance : Number,
        emotions : {
            sadness : Number,
            joy : Number, 
            fear : Number, 
            disgust : Number, 
            anger : Number
        }
    }],

    watsonSentimentResponse : {
        targets : [{
            text : String, 
            score : Number, // From -1.0 to 1.0 
            label : String // e.g. "neutral"
        }],
        document : { // analysis for the entire document
            score : Number, // From -1.0 to 1.0
            label : String // e.g. "negative" 
        }
    },

    analyzedText : String // The entire contents of the article
});

ArticleSchema.statics.findByID = function(id, cb) {
    return this.find({ _id : id }, cb)
}

ArticleSchema.statics.findBySource = function(source, cb) {
    return this.find({ source : new RegExp(source, "i") }, cb)
}

ArticleSchema.index({
    id : 1
});

ArticleSchema.index({
    publishedAt : 1
});

ArticleSchema.index({
    title : "text",
    description : "text"
});


var Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;