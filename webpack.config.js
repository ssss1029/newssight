var path = require('path');
var webpack = require('webpack');
const WebpackHTMLPlugin = require('webpack-html-plugin');

module.exports = {
    entry: './client/js/app/main.js',
    output: {
        path : __dirname + '/client/js/dist/',
        filename : 'bundle.js'
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