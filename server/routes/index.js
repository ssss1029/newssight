const router = require('express').Router()
const { loginRedirects } = require('./util')
const { getArticles } = require("../database-conns/db-article-conns")

router.get('/', function(req, res, next) {  
    res.render('landing');
});

router.get('/home', function(req, res, next) {  
    res.render('home');
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/article', function(req, res, next) {
    if (req.query.articleId == undefined || req.query.articleId == null) {
        res.redirect('/home')
    }

    getArticles({id : req.query.articleId}).then(function(results) {
        // Make sure we have one article
        if(results == undefined || results == null || results.length == 0) {
            res.redirect('/home')
            return;
        }

        res.expose(results[0], 'app.article', 'article')
        res.render('article')
    })
})

module.exports = router;
