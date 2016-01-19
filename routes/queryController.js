var express = require('express'),
    Connections = require('../models/Connections');

var router = express.Router();

// GET queries by UserID
router.get('/byUser/byConn',function (req, res) {
  console.log("Getting user queries");
  var connId = req.query.connId;
  if (connId){
    Connection.findById(
      connId,
      function (err, conn) {
        if(!err){
          console.log(conn.savedQueries);
          res.json(conn.savedQueries);
        }else{
          console.log(err);
          res.json({"status":"error", "error":err});
        }
    });
  }else{
    console.log("Error!!! finding connection");
    res.json({"status":"error", "error":"No user id supplied"});
  }
});

//POST queries
router.post('/new', function(req, res) {
  console.log(req.body.parameter);
  var parameters = JSON.parse(req.body.parameter);
  console.log(parameters);
  console.log("saving query to db");
  var query = parameters.parameters;
  query.createdOn = Date.now();
  query.modifiedOn = Date.now();
  console.log(query);
  Connections.findOneAndUpdate(
    {_id : parameters.connId},
    {
      $push : {'savedQueries': query}
    },function(err,connection){
        if(!err) {
          console.log(connection);
          res.json({status: 'success', info: "Query successfully saved",query: query});
        } else {
          // console.error(err);
          if(err.code === 11000) {
            res.json({status: 'error', info: "Query name already exists"});
          }
          else {
            // console.log(err);
            res.json({status: 'error', info: "Oops! error occcured saving query"});
          }
        }
    });



  // Query.create({
  //   queryName: parameters.queryName,
  //   createdBy: parameters.userName,
  //   createdOn: Date.now(),
  //   modifiedOn: Date.now(),
  //   onColumns: parameters.colArray,
  //   onRows: parameters.rowArray,
  //   onFilters: parameters.filterArray,
  //   queryMDX: parameters.queryMDX,
  //   connectionData: {
  //                   //  xmlaServer: parameters.connectionData.xmlaServer,
  //                    dataSource: parameters.connectionData.dataSource,
  //                    catalog: parameters.connectionData.catalog,
  //                    cube: parameters.connectionData.cube
  //                  }
  // }, function(err, query) {
  //   if(!err) {
  //     console.log("query saved to db: " + query);
  //     res.json({status: 'success', info: "Query successfully saved"});
  //   } else {
  //     console.error(err);
  //     if(err.code === 11000) {
  //       res.json({status: 'error', info: "Query name already exists"});
  //     }
  //     else {
  //       console.log(err);
  //       res.json({status: 'error', info: "Oops! error occcured saving query"});
  //     }
  //   }
  // });
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
