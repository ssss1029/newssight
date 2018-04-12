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
                <div className="alert alert-danger" id="alert-login" role="alert">
                    <h3 className="alertInnerText" id="loginInnerAlertText"><span className="alertInnerSpan"> Error: </span> <span id="flashTextLogin"> Hello there </span> </h3>
                </div>
                <LoginComponentTitle />
                <LoginComponent />
                <LoginComponentSubmitButton />
            </div>
        );
    }
}

function login() {
    var user = document.getElementById('username').value;
    var pass = document.getElementById('password').value;

    if (user == "") {
        flashError("Please enter a username");
    } else if (pass == "") {
        flashError("Please enter your password");
    } else {
        // All good
        fetch('/api/user/login', {
            credentials : 'same-origin', 
            method : 'POST', 
            headers : {
                'Content-type' : 'application/json'
            }, 
            body : JSON.stringify({
                username : user,
                password : pass,
            })
        }).then(function(response) {

            // Success            
            if (response.redirected == true) {
                window.location = response.url;
                return;
            } else if (response.status == 401) {
                // Unauthorized
                flashError("Your username or password is incorrect.")
            } else {
                console.log(response);
                flashError("Something went wrong on our end.")
            }

        }).catch(function(ex) {
            // Parsing failed
            console.log(ex);
        }) 
    }
}

function flashError(text) {
    if (!text) {
        return;
    }

    document.getElementById("flashTextLogin").innerHTML = text;
    document.getElementById("alert-login").style.display = "block";
}

export default Login;