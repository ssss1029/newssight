import React from 'react';
import ReactDOM from 'react-dom';
import NavigationComponent from './components/NavigationComponent.js'
import FooterComponent from './components/FooterComponent.js';

ReactDOM.render(<NavigationComponent />, document.getElementById('nav'));
ReactDOM.render(<FooterComponent />, document.getElementById('footer'));
