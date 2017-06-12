/**
 * Everything on here will be added onto the global variable
 */

module.exports = {
    NEWS_API_ALLOWED_SOURCES : { 
        /** 
         * undefined means that this isnt passed into the HTTP query
         * PLEASE dont mess with the cateogry or country fields. This Object is only 
         * used one time - during startup. If, at any point, you wanna see the sources with 
         * a particular category, query MONGO.
         **/ 
        category : undefined, 
        language : ["en"],
        country : undefined
    }
}