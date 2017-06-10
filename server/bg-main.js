/**
 * Handles processes that will run in the background (using kue)
 */

var kue = require('kue');
var queue = kue.createQueue();
var Article = require('schemas/article');


