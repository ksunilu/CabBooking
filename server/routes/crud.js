
module.exports = function (routePath) {

  routePath = routePath.replace('/', '');
  var modelPath = '../models/' + routePath;
  //dedbug
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

  var rPath = '/' + routePath+ '/data';
  console.log('Route Path = ' + rPath + ' set.');

  var app = require('express')();
  app.use(rPath, router);
};