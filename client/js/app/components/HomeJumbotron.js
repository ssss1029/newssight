import React from 'react'
import ReactDOM from 'react-dom'

import styles from './styles/HomeJumbotron.css'
import CSSModules from 'react-css-modules';

/**
 * The jumbotron for the home page
 */

class HomeJumbotron extends React.Component {
    render() {
        return (
            <div styleName='HomeJumbotron'>
                Hello there
            </div>
        );
    }
}

export default CSSModules(HomeJumbotron, styles);
