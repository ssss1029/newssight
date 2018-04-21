
const debug    = require('debug')('newssight:articles-conns');
const debugERR = require('debug')('newssight:ERROR:articles-conns');
      debugERR.color = require('debug').colors[5] /* RED */
const connection = require('./connection');
const tables     = global.TABLES;


 /**
  * Updates the sources of the database with the given data
  * @param {List} sources A list of all the article Objects info to update 
  */
function updateArticles(articles) {
      throw Error("Not implemented");
      
      promises = []
      for (index in articles) {
          promises.push(_doUpdateQuery(articles[index]));
      }
  
      return Promise.all(promises)  
}

function _doUpdateQuery(article) {

}

module.exports = {
      updateArticles
}