/**
 * The main schema in which each article is stored
 * I used this back when I used MongoDB as the DB Engine.
 * Problem with Mongo was deployment was not as easy as 
 * DynamoDB or RDS (MySQL) on AWS Services.
 */


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
        sentiment : { 
            score : Number, 
            label: String 
        },
        emotion : {
            sadness : Number,
            joy : Number, 
            fear : Number, 
            disgust : Number, 
            anger : Number
        },
        relevance : Number,
        disambiguation : {
            subtype : [],
            name : String,
            dbpedia_resource : String
        },
        count : Number
    }],

    watsonConceptResults : [{
        text : String, // Human-readable representation of the concept
        relevance : Number, // in the range [0, 1)
        dbpedia_resource : String // Hyperlink to dbpedia on this concept
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

    watsonSentimentResponse : { // Use for top concepts
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
                          // We can make this a link to a resource saved somewhere else.
});