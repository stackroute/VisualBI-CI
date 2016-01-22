var hotChocolate = angular.module("hotChocolate");

hotChocolate.directive('gridRender', function($http,$timeout,GraphService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      element.on('click', function() {
        // console.log(scope.$root.DataSourceName);
        $( "#dataTableBody tr" ).replaceWith( "" );
        $http.post('/execute', {
            username : "hotChocolate",
            dataSource: scope.$root.DataSourceName,
            catalog: scope.$root.CatalogName,
            statement: buildQuery()
        })
        .success(function(data) {
            scope.executeQueryData = data;
            renderData(data);
            console.log("*********************");
            console.log(scope.executeQueryData);
            scope.graphArray = GraphService.getGraphData(scope.executeQueryData);
            console.log("**************************");
            console.log(scope.graphArray);
        })
        .error(function(data) {
            if(scope.items[0].list.length == 0 && scope.items[1].list.length == 0) {
              scope.mdxInputErrorMessage = "Atleast one of Measures and Columns need to be filled.";
            }
            else if (scope.items[2].list.length == 0) {
              scope.mdxInputErrorMessage = "Rows should not be empty.";
            }
            scope.isMdxInputError = true;
            $timeout(function() {
              scope.isMdxInputError = false;
            }, 3000);
        });
      });

      function buildQuery() {
        var measures = scope.items[0].list,
            measureArr = [];
        for(var i=0; i < measures.length; i++) {
          measureArr.push(measures[i].unique_name);
        }
        var measureSet = "{" + measureArr.join() + "}";

        var columns = scope.items[1].list;
            columnSet = buildSubQuery(columns);
            columnSubQuery = columns.length > 0 ? (measures.length > 0 ? "(" + columnSet + " * " + measureSet + ")" : columnSet) : measureSet;

        var rows = scope.items[2].list;
            rowSet = buildSubQuery(rows);

        var filters = scope.items[3].list,
            filterArr = [];
        for(var j=0; j < filters.length; j++) {
          filterArr.push(filters[j].unique_name);
        }
        var filterSet = "{" + filterArr.join() + "}";
        var filterSubQuery = filters.length > 0 ? " where " + filterSet : "";

        scope.mdxQuery = "select non empty " + columnSubQuery + " on columns, non empty (" + rowSet + ") on rows" + " from ["+ scope.$root.CubeName +"]" + filterSubQuery ;
        return scope.mdxQuery;
      }

      function buildSubQuery(itemArr) {
        var columnResult = groupBy(itemArr, function(item){
                return [item.hierName];
            });
            columnArr = [];
        for(var j=0; j < columnResult.length; j++) {
          var subColumnQuery = "";
          var subColumnArr = [];
          for(var k=0; k < columnResult[j].length; k++) {
            subColumnArr.push(columnResult[j][k].isMember === "yes" ? columnResult[j][k].unique_name : columnResult[j][k].unique_name + ".members");
          }
          if (subColumnArr.length > 1) {
            subColumnQuery = "Hierarchize ({" + subColumnArr.join() + "})";
          } else {
            subColumnQuery = subColumnArr.join();
          }
          columnArr.push(subColumnQuery);
        }
        return "{" + columnArr.join("*") + "}";
      }

      function groupBy( array , f )
      {
        var groups = {};
        array.forEach( function( o )
        {
          var group = JSON.stringify( f(o) );
          groups[group] = groups[group] || [];
          groups[group].push( o );
        });
        return Object.keys(groups).map( function( group )
        {
          return groups[group];
        })
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
      // graphArray.push(graphInnerArray);
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
} // end renderData
    } // end link
  }; // end return
}); // end  directive
