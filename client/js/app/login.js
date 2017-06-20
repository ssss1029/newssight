import React from 'react';
import ReactDOM from 'react-dom';
import NavigationComponent from './NavigationComponent.js'
import FooterComponent from './FooterComponent.js';

ReactDOM.render(<NavigationComponent />, document.getElementById('nav'));
ReactDOM.render(<FooterComponent />, document.getElementById('footer'));
