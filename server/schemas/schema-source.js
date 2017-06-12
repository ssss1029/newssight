/**
 * Keeps track of all the sources in the database
 * The DB is updated every 30 mins by worker process
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SourceSchema = new Schema({
    name_id : String, // The NewsAPI ID of the source (e.g. abc-news-au)
    name : String, // Source name
    description : String,
    url : String,
    category : String,
    language : String,
    country : String,
    sortBysAvailable : [] // Can contain one of more of : "top", "latest", "popular"
});

SourceSchema.statics.findByName = function(name, cb) {
    return this.find({ name : new RegExp(name, 'i')}, cb);
}

SourceSchema.statics.findByCountry = function (country, cb) {
    return this.find({ country : new RegExp(country, 'i')}, cb);    
}

SourceSchema.statics.findByLanguage = function (language, cb) {
    return this.find({ language : new RegExp(language, 'i')}, cb);    
}

var Source = mongoose.model('Source', SourceSchema);
module.exports = Source; 