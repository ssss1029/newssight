import React from 'react';
import ReactDOM from 'react-dom';
import NavigationComponent from './components/NavigationComponent.js'
import FooterComponent from './components/FooterComponent.js';
import Login from './components/LoginComponent.js'; 
import SignUpComponent from './components/SignUpComponent.js';

ReactDOM.render(<NavigationComponent />, document.getElementById('nav'));
ReactDOM.render(<Login />, document.getElementById('leftLoginColumn'));
ReactDOM.render(<SignUpComponent />, document.getElementById("rightLoginColumn"));
