
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
            backgroundImage: "url(" + this.props.article.urlToImage +")",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }
        return (
            <div styleName='ArticleInformation'>
                <div styleName="AILeft">
                    <div styleName="title"> {/* Title */}
                        {this.props.article.title}
                    </div>
                    <div styleName="author"> {/* Author */}
                        BY: {this.props.article.author}, @ {this.props.article.sourceId}
                    </div>
                    <div styleName="description"> {/* Description */}
                        {this.props.article.description}
                    </div>
                    <a target="_blank" href={this.props.article.url} styleName="gotoarticlebutton" className="waves-effect waves-light btn"><i className="material-icons right">input</i>Go to article</a>
                </div>
                <div styleName="AIRight" style={rightStyle}></div>
            </div>
        );
    }
}

export default CSSModules(ArticleInformation, styles);
