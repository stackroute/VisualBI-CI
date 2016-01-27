var express = require('express'),
    Widget = require('../models/widgetModel'),
    Connections = require('../models/Connections');

var router = express.Router();

//POST widgets
router.post('/new', function(req, res) {
  var parameters = JSON.parse(req.body.parameter);
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
                       },
        widgetSlug: parameters.widgetSlug
       }, function(err, newWidget) {
              if(!err) {
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
  console.log(parameters);
  var obj = new Widget({
    "modifiedOn":Date.now(),
    "description":parameters.description,
    "connectionData.connectionId":parameters.connectionData.connectionId
  });

    var upsertData = obj.toObject();
    delete upsertData._id;
    Widget.findOneAndUpdate(
      {
        widgetSlug  : parameters.widgetSlug,
        createdBy   : parameters.userName
      },
      upsertData,
      {
        new : true,
        upsert: true
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
        res.send(err);
    }
    else{
        res.json(widgetList);
    }
  });
});

module.exports = router;
