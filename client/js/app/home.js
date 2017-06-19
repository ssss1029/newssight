import React from 'react';
import ReactDOM from 'react-dom';
import NavigationComponent from './NavigationComponent.js'
import FooterComponent from './FooterComponent.js';

console.log("In main.js. Looks like React is working");

ReactDOM.render(<NavigationComponent />, document.getElementById('nav'));
ReactDOM.render(<FooterComponent />, document.getElementById('footer'));
