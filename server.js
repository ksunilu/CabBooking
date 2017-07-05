var logger = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname + '/node_modules')));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '/client')));

// var dbMac = 'DESKTOP-D0F91VF';
var dbMac = '127.0.0.1';
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
app.get('/public/js/*', function (req, res) {
    var path = req.params[0];
    // Don't let them peek at .. folder
    if (path.indexOf('..') === -1) {
        return res.sendFile(__dirname + '/client/public/js/' + path);
    } else {
        res.status = 404;
        return res.send('Not Found');
    }
});

app.get('/public/css/*', function (req, res) {
    var path = req.params[0];
    // Don't let them peek at .. folder
    if (path.indexOf('..') === -1) {
        return res.sendFile(__dirname + '/client/public/css/' + path);
    } else {
        res.status = 404;
        return res.send('Not Found');
    }
});


var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});


server.listen(8000, function (req, res) {
    console.log('Server is running on http://localhost:8000');
});

