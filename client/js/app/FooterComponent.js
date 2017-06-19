import React from 'react';
import ReactDOM from 'react-dom';

/**
 * The Footer component which will be displayed on all pages
 */

class FooterComponent extends React.Component {
    render() {
        return (
            <div className="footerWrapper container-fluid">
                <div className="row">
                    <div className="footerCol col-md-4">

                    </div>
                    <div className="footerCol col-md-4">
                        
                    </div>
                    <div className="footerCol col-md-4">
                        <div className="quickLinksWrapper">
                            <ul className="quickLinks footerUL">
                                <li className="title" >Quick Links</li>
                                <li> Contact Us </li>
                                <li> About Us </li>
                                <li> About the developers </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="copyright">
                    Copyright &copy; 2017 by <a href="http://www.sauravkadavath.com"> Saurav Kadavath </a>
                </div>
            </div>
        );
    }
}

module.exports = FooterComponent;