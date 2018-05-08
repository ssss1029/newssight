
const queryDatabase = require('./utils').queryDatabase;

const debug    = require('debug')('newssight:articles-conns');
const debugERR = require('debug')('newssight:ERROR:articles-conns');
      debugERR.color = require('debug').colors[5] /* RED */
const connection = require('./connection');
const tables     = global.TABLES;


const validEntityColumns = [
      'articleId', 'type', 'target', 'salience'
]

const validArticleColumns = [
      'id', 'title', 'author', 'sourceId', 'description', 'url', 'urlToImage', 'publisedAt', 'savedAt'
]

/**
 * Get all of the entities that match the given options
 * @param {Object} options 
 * @returns {Promise}
 */
function getEntities(options) {
      if (options == null || options == undefined) options = {}

      var whereClause = ""
      for (var option in options) {
            if (validEntityColumns.indexOf(option) > -1 ) {
                  let escapedOption = option
                  let escaptedValue = connection.escape(options[option])
                  whereClause = whereClause + "{0} = {1} AND ".format(escapedOption, escaptedValue);
            }
      }
      
      if (whereClause.length == 0) {
            whereClause = "1"
      } else {
            whereClause = whereClause.slice(0, whereClause.length - 5) // Remove the last " AND "
      }

      var query = "SELECT * FROM {0} WHERE {1} ORDER BY target ASC".format(tables.ENTITIES, whereClause)
      return queryDatabase(query, connection);
}

/**
 * Get all of the articles that match the given options
 * @param {Object} options 
 * @returns {Promise}
 */
function getArticles(options) {
      if (options == null || options == undefined) options = {}

      var whereClause = ""
      for (var option in options) {
            if (validArticleColumns.indexOf(option) > -1) {
                  let escapedOption = option
                  let escaptedValue = connection.escape(options[option])  
                  whereClause = whereClause + "{0} = {1} AND ".format(escapedOption, escaptedValue);                
            }
      }

      if (whereClause.length == 0) {
            whereClause = "1"
      } else {
            whereClause = whereClause.slice(0, whereClause.length - 5) // Remove the last " AND "
      }
      
      var query = "SELECT * FROM {0} WHERE {1}".format(tables.ARTICLES, whereClause)
      return queryDatabase(query, connection);
}

module.exports = {
      getEntities,
      getArticles
}