var path = require('path');
var webpack = require('webpack');
var outputPath = path.join(__dirname, 'public', 'assets');
var filePath = path.join(__dirname, 'server');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var GetFileNamePlugin = require("./middleware/getFileNamePlugin");
var parseEntry = require('./middleware/ParsePlugin').parseEntry;
var enter = parseEntry(path.join(__dirname, "source"), {
    ignore: ['lib']
});

let WebpackChunkHash = require('webpack-chunk-hash');
var HappyPack = require('happypack');

module.exports = {
    name: 'client',
    entry: Object.assign({common: ['react', 'react-dom', 'react-datetime', 'moment']}, enter),
    output: {
        path: outputPath,
        filename: '[name].[chunkhash].js',
    },
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
            loader: "file-loader?name=[name].[ext]"
        }]
    },
    plugins: [
        new WebpackChunkHash(),
        new HappyPack({
            id: 'jsx',
            threads: 4,
            loaders: ['babel-loader']
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:"common",
            filename:"common.[hash].js"
        }),
        new webpack.optimize.UglifyJsPlugin({
            output: {comments: false},
            compress: {warnings: false}
        }),//压缩
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({
            filename:"[name].[contenthash].css",
            allChunks: true
        }),
        new GetFileNamePlugin({
            fileName: 'static.prod.json',
            publicPath: 'assets/',
            filePath: filePath
        })
    ]
};