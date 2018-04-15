import React from 'react';
import ReactDOM from 'react-dom';
import NavigationComponent from './components/NavigationComponent.js'
import FooterComponent from './components/FooterComponent.js';
import Login from './components/LoginComponent.js'; 
import SignUpComponent from './components/SignUpComponent.js';

window.app = window.app || {}

if (typeof app.user != "undefined") {
    // A user is logged in
    app.userLoggedIn = true
} else {
    app.userLoggedIn = false
}

ReactDOM.render(<NavigationComponent loggedIn={app.userLoggedIn} />, document.getElementById('nav'));
ReactDOM.render(<Login loggedIn={app.userLoggedIn} />, document.getElementById('leftLoginColumn'));
ReactDOM.render(<SignUpComponent loggedIn={app.userLoggedIn} />, document.getElementById("rightLoginColumn"));
