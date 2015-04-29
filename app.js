var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var _ = require('lodash');
var session = require('express-session');
var passport = require('passport');

// the app
var app = module.exports = express();
var env = app.get('env');
var key = 'http://open.spotify.com/track/3h65F8R0FKA70GRGdt1ftw';
var oneDay = 86400000;
var maxAge = oneDay * 7;
var server;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('root', __dirname);
app.set('scripts', path.join(__dirname, 'scripts'));

// setup db
app.set('dbconfig', {
  username: 'root',
  password: 'boobs',
  database: 'rora',
  host: '127.0.0.1',
  dialect: 'mysql'
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set session management
app.use(session({
  secret: key,
  //store: new RedisStore(app.get('conf').redis),
  maxAge: maxAge,
  cookie: {
    path: '/',
    // expires: new Date(Date.now() + maxAge),
    maxAge: maxAge,
    httpOnly: false
  },
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// import routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
