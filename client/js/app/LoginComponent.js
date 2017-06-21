import React from 'react';
import ReactDOM from 'react-dom';

/**
 * The login component 
 */

class LoginComponentTitle extends React.Component {
    render() {
        return (
            <h2 className="loginColTitle"> I Have an account </h2>
        );
    }
}

class LoginComponentSubmitButton extends React.Component {
    render() {
        return (
            <button className="loginButton loginSubmit" onClick={login}> Log In </button>
        );
    }
}

class LoginComponent extends React.Component {
    render() {
        return (
            <div className="loginWrapper">
                <h3 className="loginLabel"> Username </h3>
                    <input className="loginInput" type="text" id="username" placeholder="johnDoe1983" />
                <h3 className="loginLabel"> Password </h3>
                    <input className="loginInput" type="password" id="password" placeholder="**********" />
            </div>
        );
    }
}

class Login extends React.Component {
    render() {
        return ( 
            <div className="loginWrapper">
                <LoginComponentTitle />
                <LoginComponent />
                <LoginComponentSubmitButton />
            </div>
        );
    }
}

function login() {
    console.log("Trying to log in now.")
}

export {
    LoginComponent as LoginComponent, 
    LoginComponentTitle as LoginComponentTitle, 
    LoginComponentSubmitButton as LoginComponentSubmitButton,
    Login as Login
}