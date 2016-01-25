var express = require('express'),
    Connections = require('../models/Connections');

var router = express.Router();

// GET queries by UserID
router.get('/byUser/byConn',function (req, res) {
  var connId = req.query.connId;
  if (connId){
    Connection.findById(
      connId,
      function (err, conn) {
        if(!err){
          res.json(conn.savedQueries);
        }else{
          res.json({"status":"error", "error":err});
        }
    });
  }else{
    res.json({"status":"error", "error":"No user id supplied"});
  }
});

//POST queries
router.post('/new', function(req, res) {
  var parameters = JSON.parse(req.body.parameter);
  var query = parameters.parameters;
  query.createdOn = Date.now();
  query.modifiedOn = Date.now();
  Connections.findOneAndUpdate(
    {_id : parameters.connId},
    {
      $push : {'savedQueries': query}
    },function(err,connection){
        if(!err) {
          res.json({status: 'success', info: "Query successfully saved",query: query});
        } else {
          if(err.code === 11000) {
            res.json({status: 'error', info: "Query name already exists"});
          }
          else {
            res.json({status: 'error', info: "Oops! error occcured saving query"});
          }
        }
    });
});

// get query
router.get('/find', function(req, res) {
  Query.findOne({queryName: req.query.queryName}, 'onMeasures onColumns onRows onFilters connectionData', function(err, query) {
    if(!err) {
      res.json(query);
    } else {
      console.log(err);
      res.end();
    }
  });
});

module.exports = router;
