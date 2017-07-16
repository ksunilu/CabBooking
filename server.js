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

var loggedUsers = [];

io.sockets.on('connection', function (socket) {
    socket.on('land', function (data) {

        var iddata = {
            id: socket.id,
            data: data
        };
        loggedUsers.push(iddata);

        //console.log('logged in Users@land');
        //console.log(loggedUsers);

        io.emit('draw map', loggedUsers);
    });

    socket.on('location', function (data) {
        console.log('changed location@socket');
        console.log(data);
        console.log(socket.id);

        for (var j = 0; j < loggedUsers.length; j++) {
            if (loggedUsers[j].id === socket.id) {
                // loggedUsers.splice(j, 1);
                loggedUsers[j].data = data;
                break;
            }
        }

        io.emit('draw map', loggedUsers);
    });
    // socket.on('logon', function (data) {
    //     console.log('logon');
    //     console.log(data);
    //     var iddata = {
    //         id: socket.id,
    //         data: data
    //     };
    //     loggedUsers.push(iddata);
    //     io.emit('current users', loggedUsers);
    // });

    socket.on('logoff', function (data) {
        console.log('logoff', data);
        console.log(socket.id);
        for (var j = 0; j < loggedUsers.length; j++) {
            if (loggedUsers[j].id === socket.id) {
                loggedUsers.splice(j, 1);
                break;
            }
        }
        io.emit('current users', loggedUsers);
    });

    socket.on('disconnect', function () {
        console.log('a user diconnected');
        console.log(socket.id);
        for (var j = 0; j < loggedUsers.length; j++) {
            if (loggedUsers[j].id === socket.id) {
                loggedUsers.splice(j, 1);
                break;
            }
        }
        io.emit('draw map', loggedUsers);
    });
});

server.listen(8000, function (req, res) {
    console.log('Server is running on http://localhost:8000');
});

