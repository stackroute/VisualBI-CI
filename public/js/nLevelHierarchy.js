/******** AJAX Request for getting json data from response ***********/

function jsondata(){
  $( "#dataTableBody tr" ).replaceWith( "" );
  // $("button#button").css('display','none');
  // jQuery for post request
  $.post(
      "/execute",
      { url: "http://172.23.238.252:8080/pentaho/Xmla?userid=admin&password=password",
        dataSource: "Pentaho",
        catalog: "SampleData",
        // statement: "select NON EMPTY ([Department].[All Departments]) on columns, NON EMPTY {[Measures].[Actual]} on ROWS from [Quadrant Analysis]"
        // statement: "select NON EMPTY UNION([Department].members,{}) on columns, NON EMPTY {[Measures].[Actual], [Measures].[Budget]} on ROWS from [Quadrant Analysis]"
        statement: "select NON EMPTY {[Measures].[Actual],[Measures].[Budget]} ON COLUMNS, "+
                    "NON EMPTY Crossjoin(Union({[Region].[All Regions]},{[Region].[All Regions].Children}),"+
                        " Crossjoin(Hierarchize(Union({[Department].[All Departments]}, "+
                          "[Department].[All Departments].Children)),Union({[Positions].[All Positions]},"+
                              " {[Positions].[All Positions].Children}))) ON ROWS from [Quadrant Analysis]"
      }
    ).done(function( data ) {
        renderData(data);
      });
}


/********** Function for rendering data into grid *****************/
function renderData(data){
  var data,addElement, ans, fs, members, tdChild;
//  $.getJSON("../Data2_3.json", function(data){
    var axes = data.Axes,
        axis = axes.Axis,
        axis0 = axis[0],
        axis1 = axis[1];

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

/****************************** Axis0 Hierarchical Structure **********************************/

        axis0Child = axis0.reduce((function(acc, member) {
        return addElement(member["Member"], acc, 1);
        }), {});
        console.log(axis0Child);
        tdAxis0Child = function(element) {
          var a, ele, name;
          var frag0 = "<tr>";
          for(var axis1MemberIndex=0, axis1MemberLen = axis1[0].Member.length; axis1MemberIndex < axis1MemberLen; axis1MemberIndex++){
            frag0 += '<th></th>';
          }
          a = (function() {
              var results;
              results = [];
              var ele1 = [];
              var prevEle1 = [];
              ele1.push(element);
              while(ele1.length != 0){
                console.log(ele1);
                // console.log(ele1.length);
                results.push(frag0);
              for(var index in ele1){
                element = ele1[index];
                prevEle1[index] = ele1[index];
              for (name in element) {
                ele = element[name];
                results.push(("<td colspan='" + ele.count + "' class='level" + ele.level + "'>" + name + "</td>"));
              }
            }
            results.push("</tr>");
            ele1 = [];
            for(index in prevEle1){
                element = prevEle1[index];
            for (name in element) {
              ele = element[name];
              if(Object.keys(ele.children).length != 0){
              // console.log(ele.children);
              ele1.push(ele.children);
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
  var template0 = $.trim($("#axis0_insersion").html());
  var frag0 = template0.replace(/{{axis0}}/ig,tdAxis0Child(axis0Child));
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

count  = 0;
var dataArray = [];
for (var j = 0, len1 = axis1.length; j < len1; j++) {
  td='';
  var axis1Member = axis1[j].Member;
  var axis1Name = '';
  for(var memIndex1 in axis1Member){
    axis1Name = axis1Name+axis1Member[memIndex1].Caption+".";
  }
  var tempDataObj = {};
  for (var i = 0, len = axis0.length; i < len; i++) {
    td += "<td>"+val[count].value+"</td>";
    count++;
  }
  tempDataObj.td = td;
  dataArray.push(tempDataObj);
}
// console.log(dataArray.length);

/****************************** Axis1 Hierarchical Structure **********************************/

axis1Child = axis1.reduce((function(acc, member) {
  return addElement(member["Member"], acc, 1);
}), {});
console.log(axis1Child);
var elementIndex = 0;
tdAxis1Child = function(element) {
  // console.log(Object.keys(element).length);
  var a, ele, name;
  if (Object.keys(element).length == 0) {
    return "</tr>";
  } else {
    a = (function() {
      var results;
      results = [];
      for (name in element) {
        // console.log(name);
        ele = element[name];
        if(Object.keys(ele.children).length == 0){
          // console.log(elementIndex);
          // console.log("if");
          results.push(("<tr><td rowspan='" + ele.count + "' class='level" + ele.level + "'>" + name + "</td>")+dataArray[elementIndex].td);
          elementIndex += 1;
        }
        else{
          // console.log("else");
        results.push(("<tr><td rowspan='" + ele.count + "' class='level" + ele.level + "'>" + name + "</td>") + tdAxis1Child(ele.children));
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
var frag1 = template1.replace(/{{axis1}}/ig,"<tr>"+tdAxis1Child(axis1Child));
$('#dataTableBody').append(frag1);
  // });
};
