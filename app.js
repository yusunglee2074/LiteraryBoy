var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var appConfig = require('./config/app.json');

var index = require('./routes/index');
var users = require('./routes/users');
var apiV1Test = require('./routes/api_v1');
var apiV1Book = require('./routes/api/v1/book');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    if (appConfig.avoidAcl[req.method] && appConfig.avoidAcl[req.method].indexOf(req.path) > -1) {
        // require user token
        console.log('require user token');
    } else {
        // not necessary user token
        console.log('not rq user token');
    }
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/api/v1', apiV1Test);
app.use('/api/v1/book', apiV1Book);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
