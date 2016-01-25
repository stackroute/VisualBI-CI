var hotChocolate = angular.module('hotChocolate');
hotChocolate.controller('queryController', function($scope, $http, $rootScope, GraphService, executeQueryService, $uibModal, $compile, $cookies, $window) {
  console.log($cookies.get('userName'));
  if(!$cookies.get('userName')){
    $window.location.href = '/';
  }
  else{
    $rootScope.container = angular.element(document).find('#tableDiv');
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
    var parameters = {
          connId : $rootScope.connId,
          dataSource: $rootScope.DataSourceName,
          catalog: $rootScope.CatalogName,
          statement: $scope.buildQuery()
    };
    executeQueryService.removeGrid($rootScope.container);
    executeQueryService.render($rootScope.container, parameters).then(function(data) {
         $scope.graphArray = data;
    });
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
    var nonEmpty = $scope.isQueryNonEmpty ? "non empty" : "";
    $scope.mdxQuery = "select " + nonEmpty + " (" + columnSubQuery + ") on columns, " + nonEmpty + " (" + rowSet + ") on rows" + " from ["+ $rootScope.CubeName +"]" + filterSubQuery ;
    return $scope.mdxQuery;
  };

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
  };

  $scope.groupBy = function ( array , f ) {
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
    });
  };

  $scope.sortList = function(event, ui, listIdx) {
    var itemArr = $scope.items[listIdx].list,
        currItem = itemArr.pop();
    delete currItem.children;
    var isValidationError = false;
    if(listIdx !== 0 && currItem.hierName === "Measures") {
      isValidationError = true;
    }
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
              if(itemArr[j].levelIdx > currItem.levelIdx) {
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
  $scope.newWidgetName = "";
  $scope.widgetSaveMessage = "";
  $scope.mdxQuery = "";
  $scope.showMdxQuery = false;
  $scope.isQueryNonEmpty = true;
  $scope.graphArray = [];
  $scope.newQueryName = "";
  $scope.isMdxInputError = false;
  $scope.mdxInputErrorMessage = "MDX input error.";
  $rootScope.graphArray = [];
  $scope.newWidgetName = "";
  $scope.hideMe = function(list) {
    return list.length > 0;
  }
  $scope.retrieveQuery = function(idx) {
    executeQueryService.removeGrid($rootScope.container);
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
  //Show Bar Graph Column
  $scope.showBarGraphColumn = function() {
    console.log("entered showGraphColumn");
    if(($("."+"miniBarGraph"+"").length) === 0){
        $("#row0").prev().append("<td class="+"miniBarGraph"+"><span class='graphIcon'>"+"Bar Chart"+"</span></td>");

        //$scope.graphArray = graphArray;
        for(var index in $scope.graphArray) {
          console.log($scope.graphArray);
          var dataset = $scope.graphArray;
          console.log(dataset);
          $rootScope.graphArray = $scope.graphArray;
          $("#row"+index).append($compile("<td class="+"miniBarGraph"+"><minibar-graph index-passed="+index+" "+"my-set="+'graphArray'+"></minibar-graph></td>")($scope));
            //GraphService.renderMiniGraph(graphArray[index],'#row'+index+ ' '+'td.'+"miniGraph"+ ' ' +'span.graphIcon',index);

        }
      }
      else {
        $("."+"miniBarGraph"+"").toggle();
      }
  };

  //Show Modal Bar Graph in Modal Window
  $scope.openModalBarGraph = function(indexPassed) {
    var modalInstance = $uibModal.open({
      templateUrl : 'modalBarGraph.html',
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

  //Show Line Graph column
  $scope.showLineGraphColumn = function() {
    console.log("entered showLineGraphColumn");
      if(($("."+"miniLineGraph"+"").length) === 0){
          $("#row0").prev().append("<td class="+"miniLineGraph"+"><span class='graphIcon'>"+"Line Chart"+"</span></td>");

          //$scope.graphArray = graphArray;
          for(var index in $scope.graphArray) {
            console.log($scope.graphArray);
            var dataset = $scope.graphArray;
            console.log(dataset);
            $rootScope.graphArray = $scope.graphArray;
            $("#row"+index).append($compile("<td class="+"miniLineGraph"+"><miniline-graph index-passed="+index+" "+"my-set="+'graphArray'+"></miniline-graph></td>")($scope));
              //GraphService.renderMiniGraph(graphArray[index],'#row'+index+ ' '+'td.'+"miniGraph"+ ' ' +'span.graphIcon',index);

          }
        }
        else {
          $("."+"miniLineGraph"+"").toggle();
        }
  };

  //Show Line Modal Graph
  $scope.openModalLineGraph = function(indexPassed) {
    var modalInstance = $uibModal.open({
      templateUrl : "modalLineGraph.html",
      controller : "ModalGraphController",
      indexPassed : indexPassed,
      resolve : {
        graphData : function(){
          return $rootScope.graphArray;
        },
        index : function() {
          return indexPassed;
        }
      }
    });
  };

  //Show Area Graph Column
  $scope.showAreaGraphColumn = function() {
    console.log("entered showAreaGraphColumn");
      if(($("."+"miniAreaGraph"+"").length) === 0){
          $("#row0").prev().append("<td class="+"miniAreaGraph"+"><span class='graphIcon'>"+"Area Chart"+"</span></td>");

          //$scope.graphArray = graphArray;
          for(var index in $scope.graphArray) {
            console.log($scope.graphArray);
            var dataset = $scope.graphArray;
            console.log(dataset);
            $rootScope.graphArray = $scope.graphArray;
            $("#row"+index).append($compile("<td class="+"miniAreaGraph"+"><miniarea-graph index-passed="+index+" "+"my-set="+'graphArray'+"></miniarea-graph></td>")($scope));
              //GraphService.renderMiniGraph(graphArray[index],'#row'+index+ ' '+'td.'+"miniGraph"+ ' ' +'span.graphIcon',index);

          }
      } else {
          $("."+"miniAreaGraph"+"").toggle();
      }
  };

  //Show Area Modal Graph
  $scope.openModalAreaGraph = function(indexPassed) {
    var modalInstance = $uibModal.open({
      templateUrl : "modalAreaGraph.html",
      controller : "ModalGraphController",
      indexPassed : indexPassed,
      resolve : {
        graphData : function(){
          return $rootScope.graphArray;
        },
        index : function() {
          return indexPassed;
        }
      }
    });
  };

  //show Pie Graph column
  $scope.showPieGraphColumn = function() {
    console.log("entered showPieGraphColumn");
      if(($("."+"miniPieGraph"+"").length) === 0){
          $("#row0").prev().append("<td class="+"miniPieGraph"+"><span class='graphIcon'>"+"Pie Chart"+"</span></td>");

          //$scope.graphArray = graphArray;
          for(var index in $scope.graphArray) {
            console.log($scope.graphArray);
            var dataset = $scope.graphArray;
            console.log(dataset);
            $rootScope.graphArray = $scope.graphArray;
            $("#row"+index).append($compile("<td class="+"miniPieGraph"+"><minipie-graph index-passed="+index+" "+"my-set="+'graphArray'+"></minipie-graph></td>")($scope));
              //GraphService.renderMiniGraph(graphArray[index],'#row'+index+ ' '+'td.'+"miniGraph"+ ' ' +'span.graphIcon',index);

          }
        }
        else {
          $("."+"miniPieGraph"+"").toggle();
        }
  };

  //Show Pie Modal Graph
  $scope.openModalPieGraph = function(indexPassed) {
    var modalInstance = $uibModal.open({
      templateUrl : "modalPieGraph.html",
      controller : "ModalGraphController",
      indexPassed : indexPassed,
      resolve : {
        graphData : function(){
          return $rootScope.graphArray;
        },
        index : function() {
          return indexPassed;
        }
      }
    });
  };

  $scope.export = function(){
      var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'saveWidget.html',
          controller: 'SaveWgtModalCtrl',
          resolve: {
            mdxQuery: function(){
              return $scope.mdxQuery;
            }
          }
       });
       modalInstance.result.then(function(widgetList){
         $scope.widgetList = widgetList;
       });
    };
  }
});
