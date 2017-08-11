require('node-jsx').install(); //enable use jsx in express
require('./middleware/ignorePlugin').install(); //ignore css
var compression = require('compression');//开启gzip压缩

var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');

var app = express();
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// set env
var env = process.env.NODE_ENV || '';
app.set('env', env);
app.locals.env = env;

var exposedProperties = ['window', 'navigator', 'document'];
global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});

global.$ = {
    ajaxSetup: function () {
    },
    ajax: function () {
    }
};
global.jQuery = {
    fn: {
        extend: function () {
            return this
        }
    }
};

global.navigator = {
    userAgent: 'node.js'
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());


if (app.get('env') === 'dev') {

  var webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpackDevConfig = require('./webpack.config.dev.js'),
    compiler = webpack(webpackDevConfig);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackDevConfig.output.publicPath,
    serverSideRender: true,
    noInfo: true,
    hot: true,
    proxy: {},
    stats: {
      colors: true
    }
  }));

  app.use(webpackHotMiddleware(compiler));
  
  app.get('/lib/:file', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lib', req.params.file))
  });

} else {
    app.use(express.static(path.join(__dirname, 'public'), {
        'etag': false,
        'maxAge': 157680000,
        'setHeaders': (res)=> {
            res.set({'Expires': new Date('2020-12-12')})
        }
    })); //production use static
}

app.use('/', (req, res, next) => {
    if (/^\/$/.test(req.originalUrl)) {
        res.redirect('/index')
    }
    next()
}, routes);


module.exports = app;