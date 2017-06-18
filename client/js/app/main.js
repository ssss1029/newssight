import React from 'react';
import ReactDOM from 'react-dom';

console.log("In main.js");

const helloWorld = <h1> React is working </h1>;
ReactDOM.render(helloWorld, document.getElementById('app'));