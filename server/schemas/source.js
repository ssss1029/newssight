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

var Source = mongoose.model('Source', SourceSchema);
module.exports = Source; 