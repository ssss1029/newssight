import React from 'react'
import ReactDOM from 'react-dom'

import styles from './styles/ArticleSlide.css'
import CSSModules from 'react-css-modules';

/**
 * Expects the following props:
 *  - backgroundImageURL
 *  - title
 *  - description
 *  - URL
 */
class ArticleSlide extends React.Component {    

    handleClick() {
        window.open(this.props.URL, '_blank');
    }

    render() {
        var style = {
            backgroundImage: "url(" + this.props.backgroundImageURL + ")"
        }

        return (
            <div styleName="slideContainer" onClick={this.handleClick.bind(this)}>
                <div style={style} styleName="background">
                    <div styleName="title">
                        <h3>{this.props.title}</h3>
                    </div>
                    <div styleName="description">
                        <h2>{this.props.description}</h2>
                    </div>
                </div>
            </div>
        )
    }
}

export default CSSModules(ArticleSlide, styles);
