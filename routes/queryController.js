var express = require('express'),
    Query = require('../models/queryModel');

var router = express.Router();

// GET queries by UserID
router.get('/byUser',function (req, res) {
  console.log("Getting user queries");
  if (req.query.userName){
    Query.findByUserName(
      req.query.userName,
      function (err, queries) {
        if(!err){
          console.log(queries);
          res.json(queries);
        }else{
          console.log(err);
          res.json({"status":"error", "error":err});
        }
    })
  }else{
    console.log("No user name supplied");
    res.json({"status":"error", "error":"No user id supplied"});
  }
});

//POST queries
router.post('/new', function(req, res) {
  var parameters = JSON.parse(req.body.myString);
  console.log(parameters);
  console.log("saving query to db");
  Query.create({
    queryName: parameters.queryName,
    createdBy: parameters.userName,
    createdOn: Date.now(),
    modifiedOn: Date.now(),
    onColumns: parameters.colArray,
    onRows: parameters.rowArray,
    onFilters: parameters.filterArray,
    queryMDX: parameters.queryMDX,
    connectionData: {
                     xmlaServer: parameters.connectionData.xmlaServer,
                     dataSource: parameters.connectionData.dataSource,
                     catalog: parameters.connectionData.catalog,
                     cube: parameters.connectionData.cube
                   }
  }, function(err, query) {
    if(!err) {
      console.log("query saved to db: " + query);
      res.json({status: 'success', info: "Query successfully saved"});
    } else {
      console.error(err);
      if(err.code === 11000) {
        res.json({status: 'error', info: "Query name already exists"});
      }
      else {
        console.log(err);
        res.json({status: 'error', info: "Oops! error occcured saving query"});
      }
    }
  });
});

// get query
router.get('/find', function(req, res) {
  Query.findOne({queryName: req.query.queryName}, 'onColumns onRows connectionData', function(err, query) {
    if(!err) {
      res.json(query);
    } else {
      console.log(err);
      res.end();
    }
  });
});

module.exports = router;