
module.exports = function (app, routePath) {

  routePath = routePath.replace('/', '');
  var modelPath = '../models/' + routePath;
  //dedbug
  console.log('app=' + app);
  console.log('modelPath=' + modelPath);

  var model = require(modelPath);
  var router = require('express').Router();

  router.use(require('body-parser').urlencoded({ extended: true }));

  router.get('/', function (req, res) {
    console.log("REACHED GET DATA ON SERVER");
    model.find({}, function (err, docs) {
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

  router.post('/', function (req, res) {
    console.log(req.body);
    var newRecord = new model(req.body);
    newRecord.save(function (err, docs) {
      if (err) throw err;
      console.log("REACHED POST(ADD) DATA ON SERVER");
      res.json(docs);
    });
  })

  router.delete('/:id', function (req, res) {
    console.log("REACHED DELETE DATA ON SERVER");
    console.log(req.params.id);
    model.remove({ _id: req.params.id }, function (err, docs) {
      res.json(docs);
    });
  })

  router.put('/:id', function (req, res) {
    console.log("REACHED PUT(UPDATE) DATA ON SERVER");
    console.log(req.body);
    model.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, data) {
      res.json(data);
    });
  })

  var rPath = '/' + routePath + '/data';

  // var express = require('express');
  // var app = express();
  app.use(rPath, router);
  console.log('Server Route Path ="' + rPath + '" set.');
};
