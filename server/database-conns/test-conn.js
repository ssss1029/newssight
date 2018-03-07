process.env["DEBUG"] = "newssight*";

const mysql = require('mysql');
const debug = require('debug')('newssight:database-conns');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'developer',
  password : 'developer',
  multipleStatements : true
});

debug("Beginning query");

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) {
        throw error;
    }

    debug("Testing database connecction: 1 + 1 = " + results.toString());
});