/**
 * Runs the database setup SQL scripts that are in this project.
 * If this module is called as main, the script is still executed.
 */

if (process.env.DEBUG == undefined) {
    process.env.DEBUG = "newssight*";
}

const mysql    = require('mysql');
const fs       = require('fs');
const path     = require('path');
const parse    = require('csv-parse');

const queryDatabase = require('./utils').queryDatabase;
const debug    = require('debug')('newssight:database-conns');
const debugERR = require('debug')('newssight:ERROR:database-conns');
      debugERR.color = require('debug').colors[5] /* RED */

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'developer',
  password : 'developer',
  multipleStatements : true
});

const articlesFilepath = 'data/articles.csv' // Filepath
const entityData = 'data/entityanalysis/'    // Directory path
const articleCSVcols = [ // The columns for the articles data CSV initialization file
    "sourceId",
    "articleId",
    "author",
    "title",
    "description",
    "url",
    "urlToImage",
    "publishedAt"
]

const tables     = global.TABLES;
const articleTableColumns = [ // The columns for the articles table in the database
    "sourceId",
    "id",
    "author",
    "title",
    "description",
    "url",
    "urlToImage",
    "publishedAt",
    "savedAt"
]


/**
 * Sets up the database
 * @param {Object} options : {scripts : ["<path1>", "<path2>"]}
 */
function setupDb(options) {
    debug("Clearing and resetting up DB");
    const scripts = options.scripts;
    if (scripts == undefined) {
        debugERR("Error setting up Database. Invalid options.");
        return;
    }

    var promises = []
    for (index in scripts) {
        let SQL = fs.readFileSync(scripts[index]);
        promises.push(queryDatabase(SQL.toString(), connection));
    }

    return Promise.all(promises).then(function() {
        debug("Initializing articles")
        return initArticles();
    }).then(function() {
        debug("Initializing entity data")
        return initEntities();
    }).catch(function(error) {
        debugERR(error)
    })
}


/**
 * Initializes all the articles in the database using articlesFilepath
 */
function initArticles() {
    const input  = fs.createReadStream(articlesFilepath)
    // The columns that exist in the CSV file

    const parser = parse({
        delimiter: " ",
        quote: "|",
        escape: "",
        columns: articleCSVcols
    });

    return new Promise(function(fulfill, reject) {
        input.pipe(parser).on('readable', function() {
            var record = parser.read();
            if (record == undefined || record == undefined){
                return; // Don't continue if no actual new data
            } else if (record[articleTableColumns[0]] == articleTableColumns[0]) {
                return; // Skip the first line
            }

            var columns = ""
            for (var i = 0; i < articleTableColumns.length; i++) {
                columns = columns + articleTableColumns[i] + ", "
            }
            columns = columns.slice(0, columns.length - 2) // Remove trailing space and comma
            
            var values = ""
            for (var i = 0; i < articleCSVcols.length; i++) {
                if (articleCSVcols[i] == "publishedAt") {
                    // Do some reformatting for the publishedAt column
                    let publishedAt = record[articleCSVcols[i]]
                    values = values + connection.escape(convertToMySQLTime(publishedAt)) + ", "
                } else {
                    // No reformatting needed for this column
                    values = values + connection.escape(record[articleCSVcols[i]]) + ", "
                }
            }
            
            // The last column in articleTableColumns is the savedAt column. Do this on our own.
            values = values + connection.escape(getMySQLTime());

            var query = "INSERT INTO {0} ({1}) VALUES ({2}) ON DUPLICATE KEY UPDATE title=title;".format(tables.ARTICLES, columns, values);
            queryDatabase(query, connection).catch(function(error) {
                debugERR(error)
            })
        }).on('error', function(error) {
            debugERR(error)
            reject()
        }).on('finish', function() {
            debug("Done reading articles from {0}".format(articlesFilepath))
            fulfill()
        });
    })
    
}

/**
 * Initializes all the entities in the database using entityData (folder path)
 */
function initEntities() {
    const q1 = "SELECT id FROM {0}".format(tables.ARTICLES)
    queryDatabase(q1, connection).then(function(results) {
        var entities = []
        var parsers = []

        for (var i = 0; i < results.length; i++) {
            var articleId = results[i]["id"]
            var entityFile = fs.createReadStream(entityData + "{0}.csv".format(articleId))
            entities.push(parseEntityCSV(entityFile, articleId))
        }

        Promise.all(entities).then(function(data) {
            for (var a = 0; a < data.length; a++) {
                var articleId = data[a]["articleId"]
                var entities  = data[a]["entities"]
                for (var e = 0; e < entities.length; e++) {
                    addEntityToTable(tables.ENTITIES, entities[e], articleId)
                }
            }
        }).catch(function(err) {
            debugERR(err)
        })

    }).catch(function(error) {
        debugERR(error);
    })
}

/**
 * 
 * @param {String} entityFile 
 * @param {Integer} articleId 
 */
function parseEntityCSV(entityFile, articleId) {
    return new Promise(function(resolve, reject) {
        var parser = parse({
            delimiter: " ",
            quote: "|",
            escape: "",
            columns: [
                "target", "type", "salience", "wikipedia-link", "mid"
            ]
        });
        
        var records = []

        entityFile.pipe(parser).on('readable', function() {
            while(record = parser.read()) {
                if (records.length < 10) {
                    records.push(record)
                }
            }
        }).on('error', function(err) {
            debugERR(err)
            resolve(err)
        }).on('finish', function() {
            resolve({articleId : articleId, entities : records})
        })
    });
}

/**
 * Adds the given entity to tablename under PK articleId
 * @param {String} tablename 
 * @param {Object} entity : {type: <String>, target: <String>, salience: <String>}
 * @param {Integer} articleId 
 */
function addEntityToTable(tablename, entity, articleId) {
    const entityTableCols = [
        "articleId", "type", "target", "salience"
    ]

    const values = [
        articleId, entity["type"], entity["target"], entity["salience"]
    ]

    for (var v = 0; v < values.length; v++) {
        values[v] = connection.escape(values[v])
    }

    var query = "INSERT INTO {0} ({1}) VALUES ({2}) ON DUPLICATE KEY UPDATE type=type;".format(tablename, entityTableCols, values);
    queryDatabase(query, connection).catch(function(error) {
        debugERR(error)
    })
}

/**
 * Converts str to MySQL time. Assumes str is in the NewsAPI UTC+0000 format.
 * @param {String} str 
 */
function convertToMySQLTime(str) {
    return str.replace('T', ' ').replace('Z', '').slice(0, 19);
}

/**
 * Returns the current MySQL-formatted time
 */
function getMySQLTime() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

if (!module.parent) {
    // This is the main module
    setupDb({
        scripts : [
            path.join(global._base, 'scripts/mysql/CLEAR_AND_CREATE_DATABASE.sql'),
            path.join(global._base, 'scripts/mysql/INSERT_DUMMY_DATA.sql')
        ]
    });
}

module.exports = {
    setupDb, 
    initArticles
};