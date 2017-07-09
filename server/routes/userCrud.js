"use strict";

module.exports = function (app) {

  function cleanDriver(usr) {
    if (usr.role !== 'driver') {
      delete usr.drvLicNo;
      delete usr.drvLicExpDt;
      delete usr.drvExperiance;
      delete usr.cabNo;
      delete usr.cabOwner;
      delete usr.cabMake;
      delete usr.cabTariffID;
    }
  }
  //improvise markinactive with update
  function markInactive() {
    console.log('in  markInactive ');
    model.$where('( ISODate() - this.updatedAt ) > 10 * 60000 && this.status == "login" ')
      .exec(function (err, users) {
        if (err) console.log('error at markInactive()' + err);
        if (users === 'undefined') {
          console.log('no logged on user at markInactive()'); return;
        }
        else {
          users.forEach(function (usr) {
            console.log('updating => ' + usr);
            if ((new Date() - usr.updatedAt) > 20 * 60000)
              model.findOneAndUpdate({ _id: usr._id }, { status: 'disconnected' }, function (err, data) {
                console.log('updated => ' + data);
              });
            else
              model.findOneAndUpdate({ _id: usr._id }, { status: 'inactive' }, function (err, data) {
                console.log('updated => ' + data);
              });
          });
        }
      });
  }

  var routePath = 'users';
  routePath = routePath.replace('/', '');
  var modelPath = '../models/' + routePath;
  //dedbug
  console.log('modelPath=' + modelPath);

  var model = require(modelPath);
  var router = require('express').Router();
  router.use(require('body-parser').urlencoded({ extended: true }));
  var jwt = require('jsonwebtoken');

  router.post('/', function (req, res) {
    var newRecord = new model(req.body);
    cleanDriver(newRecord);

    newRecord.password = newRecord.generateHash(req.body.password);

    console.log('Data AFTER HASH in post =  ' + newRecord);
    newRecord.save(function (err, docs) {
      if (err) res.json(err);
      else res.json({ success: true, dataSaved: docs });
      console.log("REACHED POST(ADD USER) DATA ON SERVER");
    });
  });



  router.put('/login', function (req, res) {
    // markInactive();
    console.log('Data at /login : ' + JSON.stringify(req.body));
    model.findOne({ email: req.body.email }, function (err, usrData) {
      if (err) {
        res.json(err);
        console.log('Error at /login : ' + err);
      }
      else if (!usrData) {
        res.json({ success: false, message: 'Sorry!! email id not registered' });
        console.log('Sorry!! email id not registered');
      }
      else if (!usrData.validPassword(req.body.password)) {
        res.json({ success: false, message: 'Sorry!! wrong password' });
        console.log('Sorry!! Wrong Password');
      }
      else if (usrData) { //if all is well then
        model.findOneAndUpdate({ email: req.body.email }, { 'status': 'login' }, function (err, data) {
          if (err) console.log(err);
          // console.log(data);
          var token = jwt.sign(data, 'thisismysecret', { expiresIn: 1400 });
          res.json({ success: true, token: token, isLoggedIn: true, user: data });
          // console.log(token);
          console.log('Login Successful. Token Created.');
        });
      }
    }); //END OF FIND ONE 
  });// END PUT "/login"


  router.put('/logoff', function (req, res) {
    // markInactive();
    console.log('Data at /logoff : ' + JSON.stringify(req.body));
    model.findOne({ email: req.body.email }, function (err, usrData) {
      if (err) {
        res.json(err);
        console.log('Error at /logoff : ' + err);
      }
      else if (!usrData) {
        res.json({ success: false, message: 'Sorry!! Logoff user not found.' });
        console.log('Sorry!! Logoff user not found.');
      }
      else if (usrData) { //if all is well then
        req.body.status = 'logoff';
        req.body.Location = { lat: 0.0, lng: 0.0 };

        model.findOneAndUpdate({ _id: usrData._id }, req.body, function (err, data) {
          res.json({ success: true, isLoggedIn: false, user: data });
          console.log('Logoff Successful.');
        });
      }
    }); //END OF FIND ONE 
  });// END PUT





  /* ****************************OTHER CRUD OPERATIONS ON USERS**************************** */
  router.delete('/:email', function (req, res) {
    console.log("REACHED DELETE DATA ON SERVER");
    console.log('deleting ' + req.params.email);
    model.remove({ email: req.params.email }, function (err, docs) {
      res.json({ success: true, userDeleted: true, user: docs });
    });
  });
  /*
    router.get('/:id', function (req, res) {
      console.log("REACHED GET ID ON SERVER");
      console.log('id=' + req.params.id);
      model.find({ _id: req.params.id }, function (err, docs) {
        res.json(docs);
      });
    });
  */
  router.put('/:id', function (req, res) {
    console.log("REACHED PUT(UPDATE) DATA ON SERVER");
    console.log(req.body);
    model.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, data) {
      res.json(data);
    });
  });

  var rPath = '/' + routePath + '/data';

  // var express = require('express');
  // var app = express();
  app.use(rPath, router);
  console.log('Server Route Path ="' + rPath + '" set.');
};
