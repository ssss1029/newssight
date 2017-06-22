
/**
 * The API router
 */

var express = require('express');
var app = express();

app.use('/sources', require('./sources'));
app.use('/makeUser', require('./makeuser'));

module.exports = app;