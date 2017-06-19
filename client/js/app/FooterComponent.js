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
                    <div className="footerCol col-md-6">

                    </div>
                    <div className="footerCol col-md-3">
                        <div className="quickLinksWrapper">
                            <ul className="quickLinks footerUL">
                                <li className="title" >Quick Links</li>
                                <li> Home </li>
                                <li> Search </li>
                                <li> Current Stories </li>
                                <li> Trending Stories </li>
                                <li> About Us </li>
                            </ul>
                        </div>
                    </div>
                    <div className="footerCol col-md-3">
                        <div className="quickLinksWrapper">
                            <ul className="quickLinks footerUL">
                                <li className="title" >Company</li>
                                <li> Contact Us </li>
                                <li> About Us </li>
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