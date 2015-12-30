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
  console.log("saving query to db");
  Query.create({
    queryName: req.body.queryName,
    createdBy: req.body.userName,
    createdOn: Date.now(),
    modifiedOn: Date.now(),
    onColumns: req.body["colArray[]"],
    onRows: req.body["rowArray[]"],
    onFilters: req.body["filterArray[]"],
    queryMDX: req.body.queryMDX
  }, function(err, query) {
    if(!err) {
      console.log("query saved to db: " + query);
      res.json({status: 'success', info: "query successfully saved"});
    } else {
      console.error(err);
      if(err.code === 11000) {
        res.json({status: 'error', info: "query name already exists"});
      }
      else {
        res.json({status: 'error', info: "oops! error occcured saving query"});
      }
    }
    res.end();
  });
});

// get query
router.get('/find', function(req, res) {
  Query.findOne({queryName: req.query.queryName}, 'onColumns onRows', function(err, query) {
    if(!err) {
      res.json(query);
    } else {
      console.log(err);
      res.end();
    }
  });
});

module.exports = router;
