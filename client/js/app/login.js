import React from 'react';
import ReactDOM from 'react-dom';
import NavigationComponent from './NavigationComponent.js'
import FooterComponent from './FooterComponent.js';
import { Login } from './LoginComponent.js'; 
import { SignUpComponent } from './SignUpComponent.js';

ReactDOM.render(<NavigationComponent />, document.getElementById('nav'));
ReactDOM.render(<Login />, document.getElementById('leftLoginColumn'));
ReactDOM.render(<SignUpComponent />, document.getElementById("rightLoginColumn"));