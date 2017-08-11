var path = require('path');
var webpack = require('webpack');
var outputPath = path.join(__dirname, 'public', 'assets');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var parseEntry = require('./middleware/ParsePlugin').parseEntry;
var enter = parseEntry(path.join(__dirname, "source"), {
    ignore: ['lib']
});

module.exports = {
    name: 'client',
    entry: Object.assign({common: ['react', 'react-dom', 'react-datetime', 'moment']}, enter),
    output: {
        path: outputPath,
        filename: '[name].[hash].js',
        publicPath: '/assets'
    },
    devtool: 'source-map',
    resolve: {
        alias: {
            'react': path.join(__dirname, 'node_modules', 'react'),
            'react-dom': path.join(__dirname, 'node_modules', 'react-dom')
        }
    },
    module: {
        rules: [{
            test: /\.(js)?$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }, {
            test: /\.(less|css)?$/,
            loader: ExtractTextPlugin.extract({
                fallbackLoader: "style-loader",
                loader:'css-loader!less-loader'
            })
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: "url-loader?limit=3000&name=images/[name].[ext]"
        }, {
            test: /\.(svg|ttf|eot|svg|woff(\(?2\)?)?)(\?[a-zA-Z_0-9.=&]*)?(#[a-zA-Z_0-9.=&]*)?$/,
            loader: "file-loader?name=fonts/[name].[ext]"
        }]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name:"common",
            filename:"common.[hash].js"
        }),
        new ExtractTextPlugin({
            filename:"[name].[hash].css",
            allChunks: true
        }),
    ]
};