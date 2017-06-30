
/**
 * The API router
 */

var express = require('express');
var app = express();
var passport = require('passport');

app.use('/sources', require('./sources'));
app.use('/makeUser', require('./makeuser'));
app.use('/removeUsers', require('./removeAllUsers'));
app.use('/login', passport.authenticate('local', {
    successRedirect : '/'
}));

module.exports = app;