var logger = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, './client')));

var dbMac = 'DESKTOP-D0F91VF';
var dbHost = 'mongodb://' + dbMac + ':27017/CabDB';

mongoose.connect(dbHost);
var db = mongoose.connection;

db.on('open', function () {
    console.log('App is connected to database');
});

db.on('error', function (err) {
    console.log(err);
});

app.use(logger("dev"));

var routes = require('./server/routes');
routes(app);

app.listen(8000, function (req, res) {
    console.log('Server is running on http://localhost:8000');
});
