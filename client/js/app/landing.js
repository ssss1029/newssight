import React from 'react';
import ReactDOM from 'react-dom';
import NavigationComponent from './components/NavigationComponent.js'
import FooterComponent from './components/FooterComponent.js';

window.app = window.app || {}

if (typeof app.user != "undefined") {
    // A user is logged in
    app.userLoggedIn = true
} else {
    app.userLoggedIn = false
}

ReactDOM.render(<NavigationComponent loggedIn={app.userLoggedIn} />, document.getElementById('nav'));
ReactDOM.render(<FooterComponent loggedIn={app.userLoggedIn} />, document.getElementById('footer'));
