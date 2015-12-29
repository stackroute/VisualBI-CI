var express = require('express');
var router  = express.Router();
var fs      = require('fs');
var mongoose= require('mongoose');
var UserDetails = require('../Models/userDetails');
var Connections = require('../Models/Connections');


router.post('/save',function(req,res){
  UserDetails.findOne({username:req.body.username},function(err,user){
    user.activeConnection = req.body.connection_id;
    user.save();
    res.end();
  });
});


//get Available connections from username, not from all available Connections
router.get("/getAvailableConnections",function(req,res){
  Connections.find({},function(err,data){
      console.log(err);
      console.log(data);
      res.json(data);
  });
});

router.get("/addConnection",function(req,res){
  var myConnection = new Connections({
    connectionName: req.query.connName,
    serverURL: req.query.url,
    userid: req.query.userid,
    password: req.query.password
  });
  myConnection.save(function(err,connection){
    if (err)
      res.send(err);
    else {
      res.send(connection);
    }
  });

});

module.exports = router;
