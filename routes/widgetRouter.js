var express = require('express'),
    Widget = require('../models/widgetModel'),
    Connections = require('../models/Connections');

var router = express.Router();

//POST widgets
router.post('/new', function(req, res) {
  var parameters = JSON.parse(req.body.parameter);
  console.log(parameters);

    {
      Widget.create({
        widgetName: parameters.newWidgetName,
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
                  console.log("new widget");
                res.json({status: 'success', info: "Widget successfully saved", widget: newWidget});
              } else {
                res.json({status: 'error', info: "Oops! error occcured saving widget"});
              }
      });
    }
});

router.post("/update",function(req,res){
  //Update existing widget
  var parameters = JSON.parse(req.body.parameter);
    console.log("update");
    Widget.findOneAndUpdate(
      {
        widgetName  : parameters.existingWidgetName,
        createdBy   : parameters.userName
      },
      {
        $set  : {"modifiedOn" : Date.now()},
        $set  : {"queryMDX" : parameters.queryMDX},
        $set  : {"description" : parameters.description},
        $set  : {"connectionData.connectionId" : parameters.connectionData.connectionId},
        $set  : {"connectionData.connectionId": parameters.connectionData.connectionId},
        $set  : {"connectionData.dataSource": parameters.connectionData.dataSource},
        $set  : {"connectionData.catalog": parameters.connectionData.catalog},
        $set  : {"connectionData.cube": parameters.connectionData.cube}
      },
      function(err,widgetOutput){
        if(!err){
          res.json({status: 'success', info: "Widget modified successfully",widget: widgetOutput});
        }
        else{
            res.json({status: 'error', info: "Oops! error occcured in updating widget"});
        }
      })
})

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
    else{
        console.log("success from getSavedWidgets"+widgetList);
        res.json(widgetList);
    }
  });
});

module.exports = router;
