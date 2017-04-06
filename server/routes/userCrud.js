
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


  router.put('/', function (req, res) {

    console.log('Data at /login : ' + JSON.stringify(req.body));

    model.findOne({ email: req.body.email },
      function (err, usrData) {
        console.log(err);
        console.log(usrData);
        
        if (err) {
          res.json(err);
          console.log('Error at /login : ' + err);
        }
        else if (!usrData) {
          res.json({
            success: false,
            message: 'Sorry!! email id not registered'
          });
          console.log('Sorry!! email id not registered');
        }
        else if (!usrData.validPassword(req.body.password)) {
          res.json({
            success: false,
            message: 'Sorry!! wrong password'
          });
          console.log('Sorry!! Wrong Password');
        }
        else if (usrData) {
          var token = jwt.sign(usrData, 'thisismysecret', { expiresIn: 1400 });
          res.json({
            success: true,
            token: token,
            isLoggedIn: true,
            userDetail: usrData
          });
          console.log(token);
          console.log('Login Successful. Token Created.');
        }
      });
  });



  /* ****************************OTHER CRUD OPERATIONS ON USERS**************************** */
  router.delete('/:id', function (req, res) {
    console.log("REACHED DELETE DATA ON SERVER");
    console.log(req.params.id);
    model.remove({ _id: req.params.id }, function (err, docs) {
      res.json(docs);
    });
  });

  router.get('/:id', function (req, res) {
    console.log("REACHED GET ID ON SERVER");
    console.log('id=' + req.params.id);
    model.find({ _id: req.params.id }, function (err, docs) {
      res.json(docs);
    });
  });

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
