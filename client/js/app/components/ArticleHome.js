import React from 'react'
import ReactDOM from 'react-dom'
import CSSModules from 'react-css-modules';
import Slider from "react-slick";

import ArticleSlide from './ArticleSlide.js';
import styles from './styles/ArticleHome.css'


/**
 * The list of all articles for the home page
 */

class ArticleHome extends React.Component {

    /**
     * Returns an heading for a slider
     * @param {String} entity 
     */
    getEntityTitle(entityName) {
        return (
            <div key={entityName + "_titleKey"} styleName="entityLabel">
                {entityName}
            </div>
        )
    }

    /**
     * Returns a slider that uses the given articles.
     * @param {List} articles 
     */
    getSlider(entity) {
        var slider = [] // List containing: title and <Slider /> object
        slider.push(this.getEntityTitle(entity.entity));

        var articles = []

        for (var a = 0; a < entity.articles.articles.length; a++) {
            articles.push(
                <ArticleSlide 
                    key={entity.entity + "_articleSlide_" + a.toString()}
                    backgroundImageURL={entity.articles.articles[a].urlToImage}
                    title={entity.articles.articles[a].sourceId.toUpperCase() + ": " + entity.articles.articles[a].title}
                    description={entity.articles.articles[a].description}
                    URL={entity.articles.articles[a].url}
                />
            )
        }

        console.log(articles.length + " for " + entity.entity)

        var settings = {
            dots: true,
            infinite: true, 
            speed: 300,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        slider.push(
            <Slider key={entity.entity + "_slider"} {...settings}>
                {articles}
            </Slider>
        )

        return slider
    }

    getLeftSliders() {
        var leftSliders = []
        for (var e = 0; e < this.props.entities.length; e++) {
            if (e % 2 == 0){
                leftSliders.push(this.getSlider(this.props.entities[e][1]))
            }
        }

        return leftSliders
    }

    getRightSliders() {
        var rightSliders = []
        for (var e = 0; e < this.props.entities.length; e++) {
            if (e % 2 != 0){
                rightSliders.push(this.getSlider(this.props.entities[e][1]))
            }
        }

        return rightSliders
    }

    render() {
        return (
            <div styleName='ArticleHome'>
                <div styleName="articleColLeft">
                    {this.getLeftSliders()}
                </div>
                <div styleName="articleColRight">
                    {this.getRightSliders()}
                </div>
            </div>
        );
    }
}

export default CSSModules(ArticleHome, styles);
