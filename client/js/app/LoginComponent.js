import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

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
                    <input className="loginInput" name="username" type="text" id="username" placeholder="johnDoe1983" />
                <h3 className="loginLabel"> Password </h3>
                    <input className="loginInput" name="password" type="password" id="password" placeholder="**********" />
            </div>
        );
    }
}

class Login extends React.Component {
    render() {
        return ( 
            <div className="loginWrapper">
                <div className="alert alert-danger" id="alert-signup" role="alert">
                    <h3 className="alertInnerText" id="signupInnerAlertText"><span className="alertInnerSpan"> Error: </span> <span id="flashText"> Hello there </span> </h3>
                </div>
                <LoginComponentTitle />
                <LoginComponent />
                <LoginComponentSubmitButton />
            </div>
        );
    }
}

function login() {
    var username = document.getElementById('username');
    var password = document.getElementById('password');

    if (username == "") {
        flashError("Please enter a username");
    } else if (password == "") {
        flashError("Please enter your password");
    } else {
        // All good
        fetch('/api/login', {
            credentials : 'same-origin', 
            method : 'POST', 
            headers : {
                'Content-type' : 'application/json'
            }, 
            body : JSON.stringify({
                username : username,
                password : password,
            })
        }).then(function(response) {

            // Success            
            if (response.redirected == true) {
                window.location = response.url;
                return;
            }

            // Not a successful login
            return response.json();
        }).then(function(json) {
            processLoginResponse(json);
        }).catch(function(ex) {
            // Parsing failed
            console.log(ex);
        }) 
    }
}

function processLoginResponse(response) {

}

function flashError(text) {
    if (!text) {
        return;
    }

    document.getElementById("flashText").innerHTML = text;
    document.getElementById("alert-signup").style.display = "block";
}


export {
    LoginComponent as LoginComponent, 
    LoginComponentTitle as LoginComponentTitle, 
    LoginComponentSubmitButton as LoginComponentSubmitButton,
    Login as Login
}