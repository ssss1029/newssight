
/**
 * The API router
 */

var express = require('express');
var app = express();
var passport = require('passport');

app.use('/login', passport.authenticate('local', {
    successRedirect : '/'
}));

app.use('/sources', require('./sources'));
app.use('/makeUser', require('./makeuser'));
app.use('/removeUsers', require('./removeAllUsers'));

module.exports = app;