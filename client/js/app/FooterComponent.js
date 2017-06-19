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
                    <div className="col-md-4">
                        
                    </div>
                    <div className="col-md-4">
                        
                    </div>
                    <div className="col-md-4">
                        
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