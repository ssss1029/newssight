
import React from 'react'
import ReactDOM from 'react-dom'
import CSSModules from 'react-css-modules';
import Slider from "react-slick";

import styles from './styles/SourceArticleInfo.css'


/**
 * The bar at the top of the /article endpoint for all articles, that contains 
 * a lot of the relevant information for articles.
 */
class SourceArticleInfo extends React.Component {

    getArticleEntityDetails() {
        var ratings = []

        ratings.push(
            <div key={0} styleName="title"> {/* Title */}
                Article Details
            </div>
        )

        var len = this.props.article.entities.length;
        if (len > 5) len = 5

        for (var i = 0; i < len; i++) {
            ratings.push(
                <div key={i+1} styleName="entityRating">
                    <div styleName="entity">
                        {this.props.article.entities[i]["target"]}
                    </div>
                    <div styleName="bar">
                        {this.props.article.entities[i]["salience"]}
                    </div>
                </div>
            )
        }

        return ratings
    }

    render() {
        var rightStyle = {
            backgroundImage: "url(https://placeimg.com/800/500/tech)"
        }
        return (
            <div styleName='SourceArticleInfo'>
                <div styleName="SAILeft">
                    {this.getArticleEntityDetails()}
                </div>

                <div styleName="SAIRight">
                    <div styleName="title"> {/* Title */}
                        Source Details  
                    </div>
                    <div styleName="entityRating">
                        <div styleName="entity">
                            Entity
                        </div>
                        <div styleName="bar">
                            
                        </div>
                    </div>
                    <div styleName="entityRating">
                        <div styleName="entity">
                            Entity
                        </div>
                        <div styleName="bar">
                            
                        </div>
                    </div>
                    <div styleName="entityRating">
                        <div styleName="entity">
                            Entity
                        </div>
                        <div styleName="bar">
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CSSModules(SourceArticleInfo, styles);
