var path = require('path');
var webpack = require('webpack');
const WebpackHTMLPlugin = require('webpack-html-plugin');

module.exports = {
    entry: {
        home : ['./client/js/app/home.js', 'whatwg-fetch'],
        login : ['./client/js/app/login.js', 'whatwg-fetch']
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
            }
        ]
    },

    watch : true
}