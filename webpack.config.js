var path = require('path');
var webpack = require('webpack');
const WebpackHTMLPlugin = require('webpack-html-plugin');

module.exports = {
    entry: {
        login : ['./client/js/app/login.js', 'whatwg-fetch'],
        home : ['./client/js/app/home.js', 'whatwg-fetch'],
        landing : ['./client/js/app/landing.js', 'whatwg-fetch'],
        article : ['./client/js/app/article.js', 'whatwg-fetch']
    },
    
    output: {
        path : __dirname + '/client/js/dist/',
        filename : '[name].bundle.js'
    },

    module : {
        loaders : [
            {
                test : /.jsx?$/,
                loader : 'babel-loader',
                exclude : /node_modules/,
                query : {
                    presets : ['es2015', 'react']
                }
            }, {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
                ]
            }
        ],      
    },

    watch : true
}