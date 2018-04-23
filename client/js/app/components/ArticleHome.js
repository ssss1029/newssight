import React from 'react'
import ReactDOM from 'react-dom'
import CSSModules from 'react-css-modules';
import Slider from "react-slick";

import ArticleSlide from './ArticleSlide.js';
import styles from './styles/ArticleHome.css'

console.log(styles)


/**
 * The list of all articles for the home page
 */

class ArticleHome extends React.Component {
    render() {
        var settings = {
            dots: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        return (
            <div styleName='ArticleHome'>
                <div styleName="articleColLeft">
                    <div styleName="entityLabel">
                        Entity 1
                    </div>
                    <Slider {...settings}>
                        <ArticleSlide 
                            backgroundImageURL="https://placeimg.com/820/640/tech"
                            title="Hello There!"
                            description="This is the description. This is the description. This is the description"
                            URL="https://placeimg.com/820/640/tech"
                        />
                        <ArticleSlide 
                            backgroundImageURL="https://placeimg.com/820/640/tech"
                            title="Hello There!"
                            description="This is the description"
                            URL="https://placeimg.com/820/640/tech"
                        />
                    </Slider>
                    <div styleName="entityLabel">
                        Entity 1
                    </div>
                    <Slider {...settings}>
                        <ArticleSlide 
                            backgroundImageURL="https://placeimg.com/820/640/tech"
                            title="Hello There!"
                            description="This is the description"
                            URL="https://placeimg.com/820/640/tech"
                        />
                        <ArticleSlide 
                            backgroundImageURL="https://placeimg.com/820/640/tech"
                            title="Hello There!"
                            description="This is the description"
                            URL="https://placeimg.com/820/640/tech"
                        />
                    </Slider>
                </div>
                <div styleName="articleColRight">
                    <div styleName="entityLabel">
                        Entity 1
                    </div>
                    <Slider {...settings}>
                        <ArticleSlide 
                            backgroundImageURL="https://placeimg.com/820/640/tech"
                            title="Hello There!"
                            description="This is the description"
                            URL="https://placeimg.com/820/640/tech"
                        />
                        <ArticleSlide 
                            backgroundImageURL="https://placeimg.com/820/640/tech"
                            title="Hello There!"
                            description="This is the description"
                            URL="https://placeimg.com/820/640/tech"
                        />
                    </Slider>
                    <div styleName="entityLabel">
                        Entity 1
                    </div>
                    <Slider {...settings}>
                        <ArticleSlide 
                            backgroundImageURL="https://placeimg.com/820/640/tech"
                            title="Hello There!"
                            description="This is the description"
                            URL="https://placeimg.com/820/640/tech"
                        />
                        <ArticleSlide 
                            backgroundImageURL="https://placeimg.com/820/640/tech"
                            title="Hello There!"
                            description="This is the description"
                            URL="https://placeimg.com/820/640/tech"
                        />
                    </Slider>
                </div>
            </div>
        );
    }
}

function getEntityTitle(entity) {
    return (
        <div styleName="entityLabel">
            Entity 1
        </div>
    )
}

function getSlider(articles) {
    return (
        <Slider {...settings}>
            <ArticleSlide 
                backgroundImageURL="https://placeimg.com/820/640/tech"
                title="Hello There!"
                description="This is the description"
                URL="https://placeimg.com/820/640/tech"
            />
            <ArticleSlide 
                backgroundImageURL="https://placeimg.com/820/640/tech"
                title="Hello There!"
                description="This is the description"
                URL="https://placeimg.com/820/640/tech"
            />
        </Slider>
    )
}

export default CSSModules(ArticleHome, styles);
