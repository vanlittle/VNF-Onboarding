const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
    module: {
        loaders: [
            {
                test: /.json$/,
                loaders: [
                    'json-loader'
                ]
            },
            {
                test: /\.(css|scss)$/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [
                    'ng-annotate-loader'
                ]
            },
            {
                test: /.html$/,
                loaders: [
                    'html-loader'
                ]
            },
            {
                test: /\.png$/,
                loader: "url-loader"
            },
            {
                test: /\.svg$/,
                loader: "svg-url-loader",
            }
        ]
    },
    postcss: function() {
        return [autoprefixer];
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        FailPlugin,
        new HtmlWebpackPlugin({
            template: conf.path.src('index.html')
        })
    ],
    devtool: 'source-map',
    output: {
        path: path.join(process.cwd(), conf.paths.tmp),
        filename: 'index.js'
    },
    entry: `./${conf.path.src('index')}`
};
