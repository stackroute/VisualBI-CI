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
    Widget = require('../models/widgetModel'),
    Connections = require('../models/Connections'),
    slug = require('slug');

slug.charmap['_'] = '__';
slug.charmap[' '] = '_';

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
        widgetSlug: slug(parameters.newWidgetName)
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
        widgetSlug  : slug(parameters.existingWidgetName),
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
