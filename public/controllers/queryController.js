var hotChocolate = angular.module('hotChocolate');
hotChocolate.controller('queryController', function($scope, $http, $rootScope, GraphService, executeQueryService, gridRenderService, $uibModal, $compile, $cookies, $window) {
  console.log($cookies.get('userName'));
  if(!$cookies.get('userName')){
    $window.location.href = '/';
  }
  else{
    $scope.items = [{
                    label: 'Measures',
                    list: []
                  },
                  {
                    label: 'Columns',
                    list: []
                  }, {
                    label: 'Rows',
                    list: []
                  }, {
                    label: 'Filters',
                    list: []
                  }];
  $scope.deleteItem = function(childIndex, parentIndex) {
    $scope.items[parentIndex].list.splice(childIndex, 1);
  };

  $scope.logout = function(){
    $cookies.put('userName', undefined);
    $window.location.href = '/logout';
  };

  $scope.getExecuteQueryData = function() {
    $( "#dataTableBody tr" ).replaceWith( "" );
    executeQueryService.executeQuery($scope.buildQuery()).then(function(data) {
      console.log(data.data);
      $scope.executeQueryData = data.data;
      gridRenderService.renderData(data.data);
      $scope.graphArray = GraphService.getGraphData(data.data);
    })
  };

  $scope.buildQuery = function () {
    var measures = $scope.items[0].list,
        measureArr = [];
    for(var i=0; i < measures.length; i++) {
      measureArr.push(measures[i].unique_name);
    }
    var measureSet = "{" + measureArr.join() + "}";

    var columns = $scope.items[1].list;
        columnSet = $scope.buildSubQuery(columns);
        columnSubQuery = columns.length > 0 ? (measures.length > 0 ? "(" + columnSet + " * " + measureSet + ")" : columnSet) : measureSet;

    var rows = $scope.items[2].list;
        rowSet = $scope.buildSubQuery(rows);

    var filters = $scope.items[3].list,
        filterArr = [];
    for(var j=0; j < filters.length; j++) {
      filterArr.push(filters[j].unique_name);
    }
    var filterSet = "{" + filterArr.join() + "}";
    var filterSubQuery = filters.length > 0 ? " where " + filterSet : "";

    $scope.mdxQuery = "select non empty " + columnSubQuery + " on columns, non empty (" + rowSet + ") on rows" + " from ["+ $rootScope.CubeName +"]" + filterSubQuery ;
    return $scope.mdxQuery;
  }

  $scope.buildSubQuery = function (itemArr) {
    var columnResult = $scope.groupBy(itemArr, function(item){
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

  $scope.groupBy = function ( array , f )
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

  $scope.sortList = function(event, ui, listIdx) {
    var itemArr = $scope.items[listIdx].list,
        currItem = itemArr[itemArr.length-1];
    delete currItem.children;
    itemArr.splice(itemArr.length-1, 1);
    var isValidationError = false;
    for(var h=1; h < 4; h++) {
      if(h !== listIdx) {
        for(var g=0; g < $scope.items[h].list.length; g++) {
          if($scope.items[h].list[g].hierName === currItem.hierName) {
            isValidationError = true;
            break;
          }
        }
      }
    }
    if(!isValidationError && itemArr.indexOf(currItem) == -1) {
      itemArr.push(currItem);
      for(var i=0; i < itemArr.length-1; i++) {
        if(itemArr[i].hierName == currItem.hierName) {
          if(itemArr[i].levelIdx > currItem.levelIdx) {
            itemArr.splice(i, 0, currItem);
          }
          else {
            for(var j=i; itemArr[j].hierName == currItem.hierName; j++) {
              if(itemArr[j].levelIdx >= currItem.levelIdx) {
                break;
              }
            }
            itemArr.splice(j, 0, currItem);
          }
          itemArr.splice(itemArr.length-1, 1);
          break;
        }
      }
    }
  };
    $scope.queryList = [];

    $rootScope.$watch('queryList', function(newValue, oldValue){
      $scope.queryList = newValue;
    });

    $scope.querySaveMessage = "";
    $scope.showModalAlert = false;
    $scope.hideMe = function(list) {
      return list.length > 0;
    };

    $scope.mdxQuery = "";
    $scope.executeQueryData = {};
  $scope.graphArray = [];
    $scope.newQueryName = "";
  $scope.isMdxInputError = false;
  $scope.mdxInputErrorMessage = "MDX input error.";
  $rootScope.graphArray = [];

    $scope.retrieveQuery = function(idx) {
      var query = $scope.queryList[idx];
      console.log(query);
        $rootScope.selectedRetrieveQuery = true;
      $scope.items[0].list = query.onMeasures;
      $scope.items[1].list = query.onColumns;
      $scope.items[2].list = query.onRows;
      $scope.items[3].list = query.onFilters;
      if(query.connectionData.dataSource === $rootScope.DataSourceName &&
          query.connectionData.catalog === $rootScope.CatalogName &&
              query.connectionData.cube === $rootScope.CubeName){
          $rootScope.selectedRetrieveQuery = false;
        }
        $rootScope.$broadcast('retrieveQueryEvent', query.connectionData);
    };
    $scope.$on('resetQueryData', function(event) {
      $scope.items[0].list = [];
      $scope.items[1].list = [];
      $scope.items[2].list = [];
      $scope.items[3].list = [];
      // $( "#dataTableBody tr" ).replaceWith( "" );
    });
    $scope.open = function(){
        var modalInstance = $uibModal.open({
           animation: $scope.animationsEnabled,
           templateUrl: 'saveQuery.html',
           controller: 'SaveQryModalCtrl',
           resolve: {
             items: function(){
               return $scope.items;
             },
             queryList: function(){
               return $scope.queryList;
             },
             mdxQuery: function(){
               return $scope.mdxQuery;
             }
           }
         });
      modalInstance.result.then(function(queryList){
        console.log(queryList);
        $scope.queryList = queryList;
      });
       };
   $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
   };
 }
  //Show Graph Column function
  $scope.showGraphColumn = function() {
    console.log("entered showGraphColumn");
    if(($("."+"miniGraph"+"").length) === 0){
        $("#row0").prev().append("<td class="+"miniGraph"+"><span class='graphIcon'>"+"miniGraph"+"</span></td>");

        //$scope.graphArray = graphArray;
        for(var index in $scope.graphArray) {
          console.log($scope.graphArray);
          var dataset = $scope.graphArray;
          console.log(dataset);
          $rootScope.graphArray = $scope.graphArray;
          $("#row"+index).append($compile("<td class="+"miniGraph"+"><mini-graphs index-passed="+index+" "+"my-set="+'graphArray'+"></mini-graphs></td>")($scope));
            //GraphService.renderMiniGraph(graphArray[index],'#row'+index+ ' '+'td.'+"miniGraph"+ ' ' +'span.graphIcon',index);

        }
      }
      else {
        $("."+"miniGraph"+"").toggle();
      }
  };

  //Show Modal Graph in Modal Window
  $scope.openModalGraph = function(indexPassed) {
    var modalInstance = $uibModal.open({
      templateUrl : 'modalGraph.html',
      controller : 'ModalGraphController',
      indexPassed : indexPassed,
      //data : $scope.graphArray,
      resolve : {
        graphData : function() {
          return $rootScope.graphArray;
        },

        index : function() {
          return indexPassed;
        }
      }
    });
  };

});
