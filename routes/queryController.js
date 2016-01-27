/*
   * Copyright 2016 NIIT Ltd, Wipro Ltd.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *    http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * Contributors:
   *
   * 1. Abhilash Kumbhum
   * 2. Anurag Kankanala
   * 3. Bharath Jaina
   * 4. Digvijay Singam
   * 5. Sravani Sanagavarapu
   * 6. Vipul Kumar
*/

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
