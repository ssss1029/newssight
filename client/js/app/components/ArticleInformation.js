
import React from 'react'
import ReactDOM from 'react-dom'
import CSSModules from 'react-css-modules';
import Slider from "react-slick";

import styles from './styles/ArticleInformation.css'


/**
 * The bar at the top of the /article endpoint for all articles, that contains 
 * a lot of the relevant information for articles.
 */
class ArticleInformation extends React.Component {

    render() {
        var rightStyle = {
            backgroundImage: "url(https://placeimg.com/800/500/tech)"
        }
        return (
            <div styleName='ArticleInformation'>
                <div styleName="AILeft">
                    <div styleName="title"> {/* Title */}
                        Rick and Morty
                    </div>
                    <div styleName="author"> {/* Author */}
                        BY: Dwight Schrute, @ BBC
                    </div>
                    <div styleName="description"> {/* Description */}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et neque euismod, ullamcorper lacus condimentum, vulputate eros. Aenean porttitor dapibus sollicitudin. In placerat nisl sit amet turpis lacinia bibendum. Suspendisse sed libero a magna malesuada vulputate. Maecenas eu tellus at tellus volutpat efficitur. Cras quis ipsum bibendum, fringilla nisi eget, convallis risus. Nam finibus consectetur nulla et molestie.                        
                    </div>
                    <a styleName="gotoarticlebutton" className="waves-effect waves-light btn"><i className="material-icons right">input</i>Go to article</a>
                </div>
                <div styleName="AIRight" style={rightStyle}></div>
            </div>
        );
    }
}

export default CSSModules(ArticleInformation, styles);
