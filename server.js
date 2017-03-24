var logger = require('morgan');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');

var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;


// user schema/model
var User = require('./server/models/user.js');

//Database
// var mongo = require('mongodb');
var mongoose = require('mongoose');
var dbHost = 'mongodb://127.0.0.1:27017/CabDB';
mongoose.connect(dbHost);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to DB");
});


// BodyParser Middleware
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'client')));

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//server start
require('./server/routes')(app);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/client', 'index.html'));
});

// Only load this middleware in dev mode (important).
if (app.get('env') === 'development') {
    var webpackMiddleware = require("webpack-dev-middleware");
    var webpack = require('webpack');
    var config = require('./webpack.config');
    app.use(webpackMiddleware(webpack(config), {
        publicPath: "/build",
        headers: { "X-Custom-Webpack-Header": "yes" },
        stats: {
            colors: true
        }
    }));
}


app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.end(JSON.stringify({
        message: err.message,
        error: {}
    }));
});

var server = app.listen(8000, function () {
    console.log('listening on http://localhost:8000');
});




// var express = require('express');
// var mongoose = require('mongoose');
// var bodyParser = require('body-parser');
// var path = require('path');

// var app = express();


// var UserRoute = require('./server/routes/userRoute.js');
// app.use(bodyParser.json());
// app.use('/', express.static(path.join(__dirname, './client')));
// mongoose.connect('mongodb://localhost:27017/jwtauth');
// var db = mongoose.connection;

// db.on('open', function() {
//     console.log('App is connected to database');
// });

// db.on('error', function(err) {
//     console.log(err);
// });

// app.use('/api', UserRoute);

// app.listen(4000, function(req, res) {
//     console.log('Server is running on port 4000...');
// });
