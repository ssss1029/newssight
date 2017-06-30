import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

/**
 * The sign up component 
 */

class SignUpComponent extends React.Component {
    render() {
        return (
            <div className="loginWrapper">
                <h2 className="loginColTitle"> Register Now </h2>
                <h2 className="loginColSubHeading"> (Its FREE!) </h2>
                <div className="alert alert-danger" id="alert-signup" role="alert">
                    <h3 className="alertInnerText" id="signupInnerAlertText"><span className="alertInnerSpan"> Error: </span> <span id="flashText"> Hello there </span> </h3>
                </div>
                <div className="loginWrapper">
                    <h3 className="loginLabel"> Username </h3>
                        <input className="loginInput" type="text" id="usernameRegister" placeholder="johnDoe1983" />
                    <h3 className="loginLabel"> E-Mail </h3>
                        <input className="loginInput" type="email" id="emailRegister" placeholder="johnDoe1983" />
                    <h3 className="loginLabel"> Password </h3>
                        <input className="loginInput" type="password" id="passwordRegister" placeholder="**********" />
                    <h3 className="loginLabel"> Confirm password </h3>
                        <input className="loginInput" type="password" id="confirmpasswordRegister" placeholder="**********" />
                </div>
                <button className="loginButton registerSubmit" onClick={signUp}> Log In </button>
            </div>
        );
    }
}


function signUp() {
    console.log("Trying to Sign up for Newssight.");

    var givenUsername = document.getElementById("usernameRegister").value;
    var givenEmail = document.getElementById("emailRegister").value;
    var givenPassword = document.getElementById("passwordRegister").value;
    var confirmGivenPassword = document.getElementById("confirmpasswordRegister").value;

    if (givenPassword != confirmGivenPassword) {
        alert("username and password dont match")
    } else if (validateEMailAdresses(givenEmail) != true) {
        alert("Invalid Email adress");
    } else if (givenPassword.length < 10) {
        alert("Password is not long enough. passwords must have a minimum length of 10 characters");
    } else {
        // Send data, do more server-side validation
        fetch('/api/makeUser', {
            credentials : 'same-origin', 
            method : 'POST', 
            headers : {
                'Content-type' : 'application/json'
            }, 
            body : JSON.stringify({
                givenUsername : givenUsername,
                givenEmail : givenEmail,
                givenPassword : givenPassword,
                confirmGivenPassword : confirmGivenPassword
            })
        }).then(function(response) {

            // Success            
            if (response.redirected == true) {
                window.location = response.url;
                return;
            }

            return response.json();
        }).then(function(json) {

            processSignupResponse(json);

        }).catch(function(ex) {
            // Parsing failed
            console.log(ex);
        }) 
    }
}

function processSignupResponse(responseData) {
    var error = responseData.whatWentWrong; 

    if (error == "1") {
        flashError("Passwords don't match");
    } else if (error == "2") {
        flashError("Password is invalid. Valid passwords must contain at least 10 characters")
    } else if (error == "3") {
        flashError("This username is already taken")
    } else if (error == "4") {
        flashError("Internal Server Error")
    } else if (error == "5") {
        flashError("This email already has an account. Please contact us if you have forgotten your password.");  
    } else {
        flashError("Unknown Error.")
    }
}

function flashError(text) {
    if (!text) {
        return;
    }

    document.getElementById("flashText").innerHTML = text;
    document.getElementById("alert-signup").style.display = "block";
}

/**
 * Returns true if string is a valid email address 
 * @param {String} string 
 */
function validateEMailAdresses(string) {
    var regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return regex.test(string);
}

export { SignUpComponent as SignUpComponent };