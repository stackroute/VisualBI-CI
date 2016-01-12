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
      console.log(JSON.stringify(conn));
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
    { console.log("error from getAvailableConnections"+ err);
       res.send(err);}
    else {
        // var availableConnections = user.connections;
        // for (var connectionIndex in availableConnections){
        //   Connection.findById(availableConnections[connectionIndex]);
        // }
        console.log("success from getAvailableConnections"+user.connections);
       res.json(user.connections);
    }
  });
});

router.get("/addConnection",function(req,res){
  var username = req.query.username;
  var myConnection = new Connections({
    connectionName: req.query.connName,
    serverURL: req.query.url,
    userid: req.query.userid,
    password: req.query.password
  });
  console.log(myConnection);
  myConnection.save( function(err){
    if (err)
    {  res.send(err);}
    else {
      console.log(username);
      UserDetails.findOneAndUpdate(
        {username : username},
        {
          // $push : {"connections" : {
          //   connectionName: req.query.connName,
          //   serverURL: req.query.url,
          //   userid: req.query.userid,
          //   password: req.query.password
          // }}
          $push : {"connections" : myConnection},
          $set  : {"activeConnection" : myConnection._id}
        },
        function(err,user){
        if(err)
          {
            console.log("Error Message from /addConnections "+err);
            res.send(err);
          }
          else {
            console.log("Done");
              res.send(user);
          }

      });

    }


  });

});

module.exports = router;
