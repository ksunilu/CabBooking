var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, './client')));

var dbHost = 'mongodb://127.0.0.1:27017/CabDB';
mongoose.connect(dbHost);
var db = mongoose.connection;

db.on('open', function () {
    console.log('App is connected to database');
});

db.on('error', function (err) {
    console.log(err);
});

require('./server/routes')();

app.listen(8000, function (req, res) {
    console.log('Server is running on http://localhost:8000');
});
