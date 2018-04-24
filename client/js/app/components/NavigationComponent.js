import React from 'react';
import ReactDOM from 'react-dom';

const loginLink = "/login"
const logoutLink = "/logout"

/**
 * The header nav bar, which will appear on top of all pages
 */
class NavigationComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
        if (props.loggedIn == true) {
            this.state.logInOutLink = logoutLink
            this.state.logInOutMessage = "Log Out"
        } else {
            this.state.logInOutLink = loginLink
            this.state.logInOutMessage = "Log In"
        }
    }

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
                        <a href="/home">
                            <li className="navButtonsLI">Trending</li>
                        </a>
                        <a href={this.state.logInOutLink}>
                            <li className="navButtonsLI">{this.state.logInOutMessage}</li>
                        </a>
                    </ul>
                </div>
            </div>
        );
    }
}

export default NavigationComponent