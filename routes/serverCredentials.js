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

var express = require('express');
var router  = express.Router();
var fs      = require('fs');
var mongoose= require('mongoose');
var UserDetails = require('../models/userDetails');
var Connections = require('../models/Connections');

function getConnectionObject(connId){
  Connections.findById(connId,function(errConn,conn){
    if(errConn)
      console.log(err);
    else {
      return conn;
    }
  });
} //end of getConnectionObject

router.post('/save',function(req,res){
  UserDetails.findOne({username:req.body.username},function(err,user){
    user.activeConnection = req.body.connection_id;
    user.save();
    res.end();
  });
});


//get Available connections from username, not from all available Connections
router.get("/getAvailableConnections",function(req,res){
  var usrname = req.query.username;
  UserDetails.findOne({username:usrname})
  .populate('connections')
  .exec(function(err,user){
    if (err)
    {
       res.send(err);
    }
    else {
       res.json(user.connections);
    }
  });
});

// getting Active Connection
router.get("/getActiveConnection",function(req,res){
  var usrname = req.query.username;
  UserDetails.findOne({username:usrname},
      function(err,user){
        if (err) {
          res.send(err);
        }
        else {
          res.json(user.activeConnection);
        }
    });
});


router.get("/addConnection",function(req,res){
  var username = req.query.username;
  var myConnection = new Connections({
    connectionName: req.query.connName,
    serverURL: req.query.url,
    userid: req.query.userid,
    password: req.query.password,
    savedQueries: []
  });
  myConnection.save( function(err, myConnection){
    if (err)
    {
       res.send(err);
     }
    else {
      UserDetails.findOneAndUpdate(
        {username : username},
        {
          $push : {"connections" : myConnection},
          $set  : {"activeConnection" : myConnection._id}
        },
        {
          new : true
        },
        function(err,user){
          if(err)
          {
            res.send(err);
          }
          else {
              res.send(myConnection);
          }
      });
    }
  });
});

module.exports = router;
