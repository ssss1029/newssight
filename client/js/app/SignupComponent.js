import React from 'react';
import ReactDOM from 'react-dom';

/**
 * The sign up component 
 */

class SignUpComponent extends React.Component {
    render() {
        return (
            <div className="loginWrapper">
                <h2 className="loginColTitle"> Register Now </h2>
                <h2 className="loginColSubHeading"> (Its FREE!) </h2>
                <div className="loginWrapper">
                    <h3 className="loginLabel"> EMail </h3>
                        <input className="loginInput" type="text" id="usernameRegister" placeholder="johnDoe1983" />
                    <h3 className="loginLabel"> Username </h3>
                        <input className="loginInput" type="email" id="emailRegister" placeholder="johnDoe1983" />
                    <h3 className="loginLabel"> Password </h3>
                        <input className="loginInput" type="password" id="passwordRegister" placeholder="**********" />
                    <h3 className="loginLabel"> Confirm password </h3>
                        <input className="loginInput" type="password" id="ConfirmpasswordRegister" placeholder="**********" />
                </div>
                <button className="loginButton registerSubmit" onClick={signUp}> Log In </button>
            </div>
        );
    }
}

function signUp() {
    console.log("Trying to Sign up for Newssight.");
}

export { SignUpComponent as SignUpComponent };