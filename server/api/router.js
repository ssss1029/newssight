
/**
 * The API router. No client routes should be here
 */

var express = require('express');
var app = express();
var passport = require('passport');

app.use('/sources', require('./sources'));
app.use('/user', require('./user'))
app.use('/articles', require('./articles'))
module.exports = app;