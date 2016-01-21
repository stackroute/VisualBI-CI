var express = require('express'),
    Widget = require('../models/widgetModel'),
    Connections = require('../models/Connections');

var router = express.Router();

//POST widgets
router.post('/new', function(req, res) {
  var parameters = JSON.parse(req.body.parameter);
  console.log("saving widget to db");
  Widget.findOne(
    {
      widgetName  : parameters.widgetName,
      createdBy   : parameters.userName
    },function(err,widgetOutput){
      if(!err){
        //No widgets exists
        if(!widgetOutput){
          Widget.create({
            widgetName: parameters.widgetName,
            createdBy: parameters.userName,
            createdOn: Date.now(),
            modifiedOn: Date.now(),
            queryMDX: parameters.queryMDX,
            description: parameters.description,
            connectionData: {
                             connectionId: parameters.connectionData.connectionId,
                             dataSource: parameters.connectionData.dataSource,
                             catalog: parameters.connectionData.catalog,
                             cube: parameters.connectionData.cube
                           }
           }, function(err, newWidget) {
                  if(!err) {
                    res.json({status: 'success', info: "Widget successfully saved",widget: newWidget});
                  } else {
                    res.json({status: 'error', info: "Oops! error occcured saving widget"});
                  }
          });
        }
        //Update existing widget
        else{
          widgetOutput.modifiedOn = Date.now();
          widgetOutput.queryMDX = parameters.queryMDX;
          widgetOutput.description = parameters.description;
          widgetOutput.connectionData={
            connectionId: parameters.connectionData.connectionId,
            dataSource: parameters.connectionData.dataSource,
            catalog: parameters.connectionData.catalog,
            cube: parameters.connectionData.cube
          }
          widgetOutput.save(function(err_modified,updatedWidget){
            if(!err_modified){
              res.json({status: 'success', info: "Widget modified successfully",widget: updatedWidget});
            }
            else{
              res.json({status: 'error', info: "Oops! error occcured in updating widget"});
            }
          })
        }//end to else
      }
    })
});

//get Available connections from username, not from all available Connections
router.get("/getSavedWidgets",function(req,res){
  var usrname = req.query.username;
  Widget.find({createdBy : usrname}).sort({modifiedOn: 'descending'})
  .exec(function(err,widgetList){
    if (err)
    {
        console.log("error from getSavedWidgets"+ err);
        res.send(err);
    }
    else {
        console.log("success from getSavedWidgets"+widgetList);
        res.json(widgetList);
    }
  });
});

module.exports = router;
