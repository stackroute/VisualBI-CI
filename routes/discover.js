// Modules
var express   = require('express'),
    http 		  = require("http"),
    url 		  = require("url"),
    mongoose  = require('mongoose');

// Files
var xmla 		  = require("../lib/Xmla.js"),
  UserDetails = require('../models/userDetails'),
  Connections = require("../models/Connections");

var router 	= express.Router(),
        X   = xmla.Xmla;

var discoverRequestTypes =[
 			null,
 			{name: X.DISCOVER_DATASOURCES, key:"DataSourceName", value:"DataSourceName", property:X.PROP_DATASOURCEINFO, level:"Data Source"},
 			{name: X.DBSCHEMA_CATALOGS, key: "CATALOG_NAME", value:"CATALOG_NAME", property: X.PROP_CATALOG, level:"Catalog"},
 			{name: X.MDSCHEMA_CUBES, key: "CUBE_NAME", value:"CUBE_NAME", property: X.PROP_CUBE, level:"Cube"},
 			{name: X.MDSCHEMA_DIMENSIONS, key: "DIMENSION_UNIQUE_NAME", value:"DIMENSION_NAME", level:"DIMENSION"},
 			{name: X.MDSCHEMA_HIERARCHIES, key: "HIERARCHY_UNIQUE_NAME", value:"HIERARCHY_NAME", level:"HIERARCHY`"},
 			{name: X.MDSCHEMA_LEVELS, key: "LEVEL_UNIQUE_NAME", value:"LEVEL_NAME", level:"LEVEL"},
 			{name: X.MDSCHEMA_MEMBERS, key: "MEMBER_UNIQUE_NAME", value:"MEMBER_NAME", level:"MEMBER"}
 ];

// Functions
function callRequest(connId,fragments,res){
    Connections.findById(connId,function(err,conn){
      var xmlaRequest = generateXmlaRequest(conn.getServer(), fragments, res);
      var x = new xmla.Xmla;
      x.request(xmlaRequest);
    });
}


function getXmlaConfigParameters(fragments){
  var numFragments  = fragments[1]===""?1:fragments.length,
      properties    = {},
      restrictions  = {},
			requestType		=	discoverRequestTypes[numFragments].name;

  switch(numFragments) {
    case 7:
      restrictions[discoverRequestTypes[6].key] = fragments[6];
    case 6:
      restrictions[discoverRequestTypes[5].key] = fragments[5];
    case 5:
      restrictions[discoverRequestTypes[4].key] = fragments[4];
    case 4:
      restrictions[discoverRequestTypes[3].key] = properties[discoverRequestTypes[3].property] = fragments[3];
    case 3 :
      restrictions[discoverRequestTypes[2].key] = properties[discoverRequestTypes[2].property] = fragments[2];
    case 2 :
      properties[discoverRequestTypes[1].property] = fragments[1];
  }

  return [restrictions,properties,requestType];

}

function generateXmlaRequest(serverURL, fragments, response){
  var configParameters=getXmlaConfigParameters(fragments);

  var xmlaRequest = {
      async   : true,
      url     : decodeURIComponent(serverURL),
      method  : X.METHOD_DISCOVER,
      success : function(xmla,xmlaRequest,xmlaResponse) {
        var temp = xmlaResponse.fetchAllAsObject();
        var result={},
            numFragments=fragments[1]===""?1:fragments.length,
            values=[];
        result.key=discoverRequestTypes[numFragments].level;

          for(var obj in temp) {
            values[values.length]={
              caption_name:temp[obj][discoverRequestTypes[numFragments].value],
              unique_name:temp[obj][discoverRequestTypes[numFragments].key]
            };
          }

        result.values=values;
        response.send(result);
      },
      error   : function(err){
        response.write("Error finding the Required Data");
      },
      callback: function() {
        response.end();
      }
    };
    xmlaRequest.restrictions  = configParameters[0];
    xmlaRequest.properties    = configParameters[1];
    xmlaRequest.requestType   = configParameters[2];
    xmlaRequest.method        = X.METHOD_DISCOVER;

    return xmlaRequest;
}

//----------------------------------------Server Details-----------------------------------------------

router.get('/getServerDetails', function(req, res) {
  var parameters = req.query,
      pathName   = parameters.pathName,
      fragments  = pathName.split("/"),
      connId     = parameters.connId;

  callRequest(connId,fragments,res);

});

//----------------------------------------Dimensions-----------------------------------------------
 router.get('/getDimensions',function(req,res) {
   var parameters = req.query,
       pathName   = parameters.pathName,
       fragments  = pathName.split("/"),
       connId     = parameters.connId;

   callRequest(connId,fragments,res);

});

//------------------------------Get Measures------------------------------------------------
router.get('/getMeasures',function(req,res) {
  var parameters = req.query,
      pathName   = parameters.pathName,
      connId     = parameters.connId;

	pathName = pathName + "/[Measures]/[Measures]/[Measures].[MeasuresLevel]";
  var fragments = pathName.split("/");

  callRequest(connId,fragments,res);
});

module.exports = router;
