import React from 'react'
import ReactDOM from 'react-dom'

import styles from './styles/HomeJumbotron.css'
import CSSModules from 'react-css-modules';

/**
 * The jumbotron for the home page
 */

class HomeJumbotron extends React.Component {
    render() {
        var greeting = "News Home"
        
        if (this.props.user != undefined && this.props.user.first_name != undefined) {
            greeting = "Welcome to your News Home, " + this.props.user.first_name;
        }

        return (
            <div styleName='HomeJumbotron'>
                <div styleName="titleDiv">
                    <h1 styleName="title">
                        {greeting}
                    </h1>
                </div>
                <div styleName="messageDiv">
                    <h3 styleName="message">
                        Nam in semper urna, non pharetra dui. In diam metus, pellentesque in enim sit amet, rhoncus iaculis eros. Etiam bibendum vulputate purus in lobortis. Fusce sit amet erat metus. Maecenas imperdiet rutrum diam, eu mollis metus finibus eget. Pellentesque non magna et erat maximus bibendum vitae viverra lectus. Fusce at arcu dolor. Donec sagittis faucibus risus. Pellentesque eget velit ex.
                    </h3>
                </div>
            </div>
        );
    }
}

export default CSSModules(HomeJumbotron, styles);
