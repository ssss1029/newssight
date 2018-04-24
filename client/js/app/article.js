import React from 'react';
import ReactDOM from 'react-dom';
import NavigationComponent from './components/NavigationComponent.js'
import FooterComponent from './components/FooterComponent.js';
import ArticleInformation from './components/ArticleInformation.js';
import SourceArticleInfo from './components/SourceArticleInfo.js';

window.app = window.app || {}

if (typeof app.user != "undefined") {
    // A user is logged in
    app.userLoggedIn = true
} else {
    app.userLoggedIn = false
}

/**
 * Render article page.
 * app.article should be populated with the correct article information
 */

ReactDOM.render(<NavigationComponent loggedIn={app.userLoggedIn} />, document.getElementById('nav'));

ReactDOM.render(
    <div>
        <ArticleInformation article={app.article} loggedIn={app.userLoggedIn} />
        <SourceArticleInfo article={app.article} loggedIn={app.userLoggedIn} />
    </div>
, document.getElementById('main'));

ReactDOM.render(<FooterComponent loggedIn={app.userLoggedIn} />, document.getElementById('footer'));
