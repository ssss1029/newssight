
/**
 * The API router
 */

var express = require('express');
var app = express();

app.use('/sources', require('./sources'));
app.use('/makeUser', require('./makeuser'));
app.use('/removeUsers', require('./removeAllUsers'));
app.use('/login', require('./login'));

module.exports = app;