const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
    node: {
        fs: "empty"
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
        }),
        /*new webpack.optimize.UglifyJsPlugin({
            //compress: { unused: true, dead_code: true, warnings: false } // eslint-disable-line camelcase
        }),*/
        new ExtractTextPlugin('index-[contenthash].css'),
        //new webpack.optimize.CommonsChunkPlugin({name: 'vendor'})
    ],
    output: {
        path: path.join(process.cwd(), conf.paths.dist),
        filename: '[name]-[hash].js'
    },
    entry: {
        app: `./${conf.path.src('index')}`
    }
};

