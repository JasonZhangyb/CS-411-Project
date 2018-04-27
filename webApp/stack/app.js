var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');

//flash is used with passport to pop up messages
var flash = require('connect-flash');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var twitter_routes = require('./routes/auth');
var mainRouter = require('./routes/main');

var app = express();

//var MongoClient = require('mongodb').MongoClient;
//
// // Connect to the db
// MongoClient.connect("mongodb://localhost", function (err, client) {
//     if (err) throw err;
//
//     var db = client.db("CS411");
//
//     db.collection("CS411test").findOne({}, function (findErr, result) {
//         if (findErr) throw findErr;
//             console.log(result.Title);
//             client.close();
//     });
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'this is not a secret' }));
app.use(passport.initialize());
app.use(passport.session());

// Make our db accessible to our router
//app.use(function(req,res,next){
  //  req.db = db;
    //next();
//});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', twitter_routes);
app.use('/main', mainRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
