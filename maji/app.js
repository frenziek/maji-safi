var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var Admin = require('./models/cereal.js').Admin;
require('./config/passport')(passport);
var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('connect-multiparty')());
app.use(cookieParser());
app.use(session({ secret: 'merry fucking christmas' })); // session secret
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

var routes = require('./routes/index');
var texts = require('./routes/text');
var devices = require('./routes/devices');
app.use('/', routes);
app.use('/text', texts);
app.use('/devices', devices);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });


//module.exports = app;
app.listen(3000,function(){
  console.log("Live at Port 3000");
});
