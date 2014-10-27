var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var nexus = require('./routes/nexus');
var partials = require('express-partials');
var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./models/Settings');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());//这里

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.session({ secret: "keyboard cat" }));


app.use(session({
    secret:settings.cookieSecret,
    store:new MongoStore({
        db:settings.db
    }),
    saveUninitialized: true,
    resave: true
}))

app.use(function(req, res,next) {
    //console.log(res.locals); //undined
    /*res.locals.success = req.session? req.session.success : null;
    res.locals.user = req.session? req.session.user : null;
    res.locals.error = req.session? req.session.error : null;
    next(); */

    var error = req.session.error
        , success = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.user = req.session ? req.session.user:'';
    res.locals.error = '';
    res.locals.success = '';

    if (error) res.locals.error = error;
    if (success) res.locals.success = success;
    next();
});



app.use('/', routes);
app.use('/hello', routes);
//app.use('/users', users);
app.use('/user/:username', routes);
app.use('/:username', users);

app.use('/:username', nexus);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


/*
app.use(function(req, res, next){

    var error=req.flash('error');

    var success=req.flash('success');
    res.locals.user = req.session.user;
    console.log("user");
    res.locals.error = error.length?error:null;

    res.locals.success = success.length?success:null;
    next();
}); */
/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
