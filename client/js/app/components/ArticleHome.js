import React from 'react'
import ReactDOM from 'react-dom'

import styles from './styles/ArticleHome.css'
import CSSModules from 'react-css-modules';
import Slider from "react-slick";

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

        var mystyles = {
            backgroundImage: "url(" + "https://placeimg.com/640/480/tech" + ")"
        }

        return (
            <div styleName='ArticleHome'>
                <div style={mystyles} styleName="articleColLeft">
                    <Slider {...settings}>
                        <div styleName="slideContainer">
                            <div style={mystyles} styleName="background">
                                <h3 styleName="slideContent">1</h3>
                            </div>
                        </div>
                        <div style={mystyles} styleName="slideContainer">
                            <div style={mystyles} styleName="background">
                                    <h3 styleName="slideContent">2</h3>
                                </div>
                        </div>
                        <div style={mystyles} styleName="slideContainer">
                            <div style={mystyles} styleName="background">
                                    <h3 styleName="slideContent">3</h3>
                                </div>
                        </div>
                    </Slider>
                </div>
                <div styleName="articleColRight">
                    <Slider {...settings}>
                        <div styleName="slideContainer">
                            <h3 styleName="slideContent">1</h3>
                        </div>
                        <div styleName="slideContainer">
                            <h3 styleName="slideContent">2</h3>
                        </div>
                        <div styleName="slideContainer">
                            <h3 styleName="slideContent">3</h3>
                        </div>
                        <div styleName="slideContainer">
                            <h3 styleName="slideContent">4</h3>
                        </div>
                        <div styleName="slideContainer">
                            <h3 styleName="slideContent">5</h3>
                        </div>
                        <div styleName="slideContainer">
                            <h3 styleName="slideContent">6</h3>
                        </div>
                    </Slider>
                </div>
            </div>
        );
    }
}

export default CSSModules(ArticleHome, styles);
