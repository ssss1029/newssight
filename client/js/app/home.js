import React from 'react';
import ReactDOM from 'react-dom';
import NavigationComponent from './components/NavigationComponent.js'
import FooterComponent from './components/FooterComponent.js';
import HomeJumbotron from './components/HomeJumbotron.js';
import ArticleHome from './components/ArticleHome.js'
window.app = window.app || {}

if (typeof app.user != "undefined") {
    // A user is logged in
    app.userLoggedIn = true
} else {
    app.userLoggedIn = false
}

const homeArticlesURL = "http://127.0.0.1:3000/api/articles/homepage"

ReactDOM.render(<NavigationComponent loggedIn={app.userLoggedIn} />, document.getElementById('nav'));
ReactDOM.render(<HomeJumbotron user={app.user} loggedIn={app.userLoggedIn} />, document.getElementById('jumbotron'));
ReactDOM.render(<FooterComponent loggedIn={app.userLoggedIn} />, document.getElementById('footer'));

fetch(homeArticlesURL, {method : "GET"}).then(function (response) {
    return response.json()
}).then(function(response) {
    var entities = response.slice(0, 11) // We only want the first 10 entities
    ReactDOM.render(<ArticleHome entities={entities} loggedIn={app.userLoggedIn} />, document.getElementById("main"));
});
