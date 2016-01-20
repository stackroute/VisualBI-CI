var express = require('express'),
    Widget = require('../models/widgetModel');

var router = express.Router();

// GET queries by UserID
router.get('/byUser',function (req, res) {
  console.log("Getting user widgets");
  if (req.widget.userName){
    Widget.findByUserName(
      req.widget.userName,
      function (err, widgets) {
        if(!err){
          console.log(widgets);
          res.json(widgets);
        }else{
          console.log(err);
          res.json({"status":"error", "error":err});
        }
    });
  }else{
    console.log("No user name supplied");
    res.json({"status":"error", "error":"No user id supplied"});
  }
});

//POST queries
router.post('/new', function(req, res) {
  console.log(req.body.parameter);
  var parameters = JSON.parse(req.body.parameter);
  console.log(parameters);
  console.log("saving widget to db");
  Widget.create({
    widgetName: parameters.widgetName,
    createdBy: parameters.userName,
    createdOn: Date.now(),
    modifiedOn: Date.now(),
    queryMDX: parameters.queryMDX,
    //queryName: parameters.queryName,
    connectionData: {
                     connectionId: parameters.connectionData.connectionId,
                     dataSource: parameters.connectionData.dataSource,
                     catalog: parameters.connectionData.catalog,
                     cube: parameters.connectionData.cube
                   }
  }, function(err, widget) {
    if(!err) {
      res.json({status: 'success', info: "Widget successfully saved"});
    } else {
      if(err.message === "already present") {
        res.json({status: 'error', info: "Widget name already exists"});
      }
      else {
        res.json({status: 'error', info: "Oops! error occcured saving widget"});
      }
    }
  });
});

module.exports = router;
