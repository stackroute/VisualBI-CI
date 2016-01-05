/*******************   Necessary Imports    *****************************/
// var render = require('./renderBarChart.js');

/******** AJAX Request for getting json data from response ***********/
var graphArray = [];
function jsondata(){
  $( "#dataTableBody tr" ).replaceWith( "" );
  $.post(
      "/execute",
      { url: "http://172.23.238.252:8080/pentaho/Xmla?userid=admin&password=password",
        dataSource: "Pentaho",
        catalog: "SampleData",
        // statement: "select NON EMPTY ([Department].[All Departments]) on columns, NON EMPTY {[Measures].[Actual]} on ROWS from [Quadrant Analysis]"
        // statement: "select NON EMPTY UNION([Department].members,{}) on columns, NON EMPTY {[Measures].[Actual], [Measures].[Budget]} on ROWS from [Quadrant Analysis]"
        // statement: "select NON EMPTY {[Measures].[Actual],[Measures].[Budget]} ON COLUMNS, "+
        //             "NON EMPTY Crossjoin(Union({[Region].[All Regions]},{[Region].[All Regions].Children}),"+
        //                 " Crossjoin(Hierarchize(Union({[Department].[All Departments]}, "+
        //                   "[Department].[All Departments].Children)),Union({[Positions].[All Positions]},"+
        //                       "{[Positions].[All Positions].Children}))) ON ROWS from [Quadrant Analysis]"
<<<<<<< HEAD
<<<<<<< HEAD
         // statement: "select NON EMPTY Crossjoin({[Measures].[Actual]}, Union({[Region].[All Regions]}, [Region].[All Regions].Children)) ON COLUMNS, NON EMPTY Crossjoin(Hierarchize(Union({[Department].[All Departments]}, [Department].[All Departments].Children)), {[Positions].[All Positions]}) ON ROWS from [Quadrant Analysis]"
=======
        // statement: "select NON EMPTY Crossjoin({[Measures].[Actual]}, Union({[Region].[All Regions]}, [Region].[All Regions].Children)) ON COLUMNS, NON EMPTY Crossjoin(Hierarchize(Union({[Department].[All Departments]}, [Department].[All Departments].Children)), {[Positions].[All Positions]}) ON ROWS from [Quadrant Analysis]"
>>>>>>> e00ba15f3e79633349bde14e61610c70023771f4
=======
        // statement: "select NON EMPTY Crossjoin({[Measures].[Actual]}, Union({[Region].[All Regions]}, [Region].[All Regions].Children)) ON COLUMNS, NON EMPTY Crossjoin(Hierarchize(Union({[Department].[All Departments]}, [Department].[All Departments].Children)), {[Positions].[All Positions]}) ON ROWS from [Quadrant Analysis]"
>>>>>>> e00ba15f3e79633349bde14e61610c70023771f4
      statement: "select NON EMPTY Crossjoin({[Measures].[Actual], [Measures].[Budget]}, Union({[Region].[All Regions]}, [Region].[All Regions].Children)) ON COLUMNS, NON EMPTY Crossjoin({[Positions].[All Positions]}, Hierarchize(Union({[Department].[All Departments]}, [Department].[All Departments].Children))) ON ROWS from [Quadrant Analysis]"
    }
    ).done(function( data ) {
        renderData(data);
      });
}

/************************** Function for rendering data into grid ******************************/
function renderData(data){
  var addElement, ans, fs, members, tdChild;
  var axes = data.Axes,
      axis = axes.Axis,
      axis0 = axis[0],
      axis1 = axis[1];

      /************* Function for graphKey *****************/

      var axis0Names = [];
      for (var index0 in axis0){
         var axis0Member = axis0[index0].Member;
         var axis0Name = '';
         for(var memIndex0 in axis0Member){
           axis0Name = axis0Name+axis0Member[memIndex0].Caption+".";
         }
         axis0Name = axis0Name.substring(0,axis0Name.length-1);
         axis0Names.push(axis0Name);
       }
      //  console.log(axis0Names);
/************************ Generating tree structure *************************************/
      addElement = function(members, tree, level) {
        var child;
        if (members[0] != null) {
          child = members[0];
          if (!tree[child.Caption]) {
            tree[child.Caption] = {
              count: 0,
              children: {}
            };
          }
          tree[child.Caption].count += 1;
          tree[child.Caption].level = child.index;
          addElement(members.slice(1), tree[child.Caption].children, child.index + 1);
        }
        return tree;
        };
/************************************** Graph Arrays *****************************************/
// var graphArray = [];
var graphKey = [];
/****************************** Axis0 Hierarchical Structure **********************************/

        axis0Child = axis0.reduce((function(acc, member) {
        return addElement(member.Member, acc, 1);
        }), {});

        /************* Function for rendering axis0 *****************/
        tdAxis0Child = function(element) {
          var a, ele, name,
              frag0 = "<tr>";
          for(var axis1MemberIndex=0, axis1MemberLen = axis1[0].Member.length; axis1MemberIndex < axis1MemberLen; axis1MemberIndex++){
            frag0 += '<th></th>';
          }
          a = (function() {
                var results, elementArray, prevElementArray;
                    results = [];
                    elementArray = [];
                    prevElementArray = [];
                    elementArray.push(element);
                while(elementArray.length !== 0){
                  results.push(frag0);
                  for(var index in elementArray){
                    element = elementArray[index];
                    prevElementArray[index] = elementArray[index];
                    for (name in element) {
                      ele = element[name];
                      results.push(("<td colspan='" + ele.count + "' class='level" + ele.level + "'>" + name + "</td>"));
                    }
                  }
                  results.push("</tr>");
                  elementArray = [];
                  for(index in prevElementArray){
                    element = prevElementArray[index];
                    for (name in element) {
                      ele = element[name];
                      if(Object.keys(ele.children).length !== 0){
                        elementArray.push(ele.children);
                      }
                    }
                  }
                }
              return results;
            })();
          return (a.reduce((function(acc, line) {
            return acc + line;
          }), ""));
        };
      var template0 = $.trim($("#axis0_insersion").html()),
          frag0 = template0.replace(/{{axis0}}/ig,tdAxis0Child(axis0Child));
      $('#dataTableBody').append(frag0);

/****************************** Data **********************************/
    var cellData = data.CellData,
        cells = cellData.Cell,
        val = [];
    for (var cellIndex in cells) {
      var valObj = {};
      valObj.value = cells[cellIndex].FmtValue;
      val.push(valObj);
    }
    var count  = 0,
        dataArray = [],
        graphData = [];
    for (var j = 0, len1 = axis1.length; j < len1; j++) {
      td='';
      var tempDataObj = {};
      var graphInnerArray = [];
      for (var i = 0, len = axis0.length; i < len; i++) {
        var graphObj = {};
        graphObj.key = axis0Names[i];
        graphObj.value = parseFloat(val[count].value.replace(/,/g,''));
        graphInnerArray.push(graphObj);
        td += "<td>"+val[count].value+"</td>";
        count++;
      }
      tempDataObj.td = td;
      dataArray.push(tempDataObj);
      graphArray.push(graphInnerArray);
    }
    // console.log(graphArray);
    // graphArray is for D3.js part.

/****************************** Axis1 Hierarchical Structure **********************************/

    axis1Child = axis1.reduce((function(acc, member) {
      return addElement(member.Member, acc, 1);
    }), {});
    var elementIndex = 0;

    /************* Function for rendering axis1 *****************/
    var rowId = 0;
    tdAxis1Child = function(element) {
      var a, ele, name;
      if (Object.keys(element).length === 0) {
        return "</tr>";
      }
      else {
        a = (function() {
          var results = [];
        for (name in element) {
          ele = element[name];
          if(Object.keys(ele.children).length === 0){
            results.push(("<tr id='row"+rowId+"' class='dataRow'><td rowspan='" + ele.count + "' class='level" + ele.level + "'>" + name + "</td>")+dataArray[elementIndex].td);
            elementIndex += 1;
            rowId += 1;
          }
          else{
            results.push(("<tr id='row"+rowId+"' class='dataRow'><td rowspan='" + ele.count + "' class='level" + ele.level + "'>" + name + "</td>") + tdAxis1Child(ele.children));
          }
        }
        return results;
      })();
      return (a.reduce((function(acc, line) {
        return acc + line;
      }), "")).slice(4);
    }
  };
  var template1 = $.trim($("#axis1_insersion").html());
  var frag1 = template1.replace(/{{axis1}}/ig,"<tr id='row0' class='dataRow'>"+tdAxis1Child(axis1Child));
  $('#dataTableBody').append(frag1);
}

  $(".graph").on("click",function(){
    // $(".graphColumn").toggle();
    if(($("."+this.id+"").length) === 0){
    $("#row0").prev().append("<td class="+this.id+"><span class='graphIcon'>"+this.id+"</span></td>");
    $(".dataRow").append("<td class="+this.id+"><span class='graphIcon'></span></td>");

    for(var index in graphArray) {
      renderChart(graphArray[index],'#row'+index+ ' '+'td.'+this.id + ' ' +'span.graphIcon');
    }
  }
  else{
    $("."+this.id+"").toggle();
  }
  });