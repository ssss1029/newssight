
/**
 * The API router
 */

var express = require('express');
var app = express();

app.use('/sources', require('./sources'));

module.exports = app;