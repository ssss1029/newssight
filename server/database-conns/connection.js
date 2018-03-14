const mysql    = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'developer',
    password : 'developer',
    database : 'newssight'
});

connection.on('error', function(err) {
    debugERR("MYSQL: " + err)
});  

module.exports = connection;