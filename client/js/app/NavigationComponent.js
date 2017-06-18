import React from 'react';
import ReactDOM from 'react-dom';


/**
 * The header nav bar, which will appear on top of all pages
 */
class NavigationComponent extends React.Component {
    render() {
        return (
            <div className="navWrapper">
                <div className="logoWrapper">
                    <a href="/"> <h1 className="logo"> NewsSight </h1> </a>
                </div>
                <div className="navButtonsWrapper">
                    <ul className="navButtonsUL">
                        <li className="navButtonsLI searchPic"></li>
                        <li className="navButtonsLI">Search</li>
                        <li className="navButtonsLI">Current Stories</li>
                        <li className="navButtonsLI">Top Stories</li>
                        <li className="navButtonsLI">Log In</li>
                    </ul>
                </div>
            </div>
        );
    }
}

module.exports = NavigationComponent;