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
var apiV1Post = require('./routes/api/v1/post');
var apiV1Comment = require('./routes/api/v1/comment');
var apiV1User = require('./routes/api/v1/user');
var apiV1Image = require('./routes/image');

var Model = require('./models');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    if ( (appConfig.avoidAcl[req.method] && appConfig.avoidAcl[req.method].indexOf(req.path) > -1) || (req.path == "/api/v1/test") || req.path.match(/\/image\/*/) ) {
        // not necessary user token
        console.log('not rq user token');
        next();
    } else {
        Model.User.findOne({
            "where": {
                "userid": req.get("user_id")
            }
        }).then(function(user) {
            // console.log("-------", user);
            if (user) {
                next();
            } else {
                var err = new Error('Header : "user_id" is require.');
                err.status = 414;
                next(err);
            }
        });
        // require user token
    }
});

app.use('/', index);
app.use('/users', users);
app.use('/api/v1', apiV1Test);
app.use('/api/v1/book', apiV1Book);
app.use('/api/v1/post', apiV1Post);
app.use('/api/v1/user', apiV1User);
app.use('/api/v1/comment', apiV1Comment);
app.use('/', apiV1Image); // static 파일을 랜더링 해야해서

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
    res.send(err);
});


module.exports = app;
