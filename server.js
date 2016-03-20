var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoJS = require('mongoJS');

var app = express();
var db = mongoJS('birds', ['sightings']);
var port = 3000;

app.use(bodyParser.json());
app.use(cors());

//Test
app.get('/api/test', function(req, res) {
  res.send("The server is working");
});

//Routes
app.post('/api/sightings', function(req, res, next) {
  db.sightings.save(req.body, function(err, result) {
    if(err) return res.status(500).json(err);
    else return res.json(result);
  });
});

app.get('/api/sightings', function(req, res, next) {
  var query = {};
  if(req.query.bird) query.bird = {name: req.query.bird};
  if(req.query.region) query.region = req.query.region;
  if(req.query.id) query._id = mongoJS.ObjectId(req.query.id);

  db.sightings.find(query, function(err, result) {
    if(err) return res.status(500).json(err);
    else return res.json(result);
  });
});

app.put('/api/sightings/:id', function(req, res, next) {
  if(!req.query.id) return res.status(418).send('request query \'id\' required');
  db.sightings.findAndModify({
    query: {_id: mongoJS.ObjectId(req.query.id)},
    update: {$set: req.body}
  },
    function(err, result) {
      console.log(err, result);
      if(err) return res.status(500).json(err);
      else return res.json(result);
    });
});

app.delete('/api/sightings/:id', function(req, res, next) {
  db.sightings.remove({_id: mongoJS.ObjectId(req.query.id)}, function(err, result) {
    console.log(err, result);
    if(err) return res.status(500).json(err);
    else return res.json(result);
  });
});

//Connection
app.listen(port, function() {
  console.log("Listening on port " + port);
});
