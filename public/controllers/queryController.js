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

var hotChocolate = angular.module('hotChocolate');
hotChocolate.controller('queryController', function($scope, $http, $rootScope, GraphService, executeQueryService, $uibModal, $compile, $cookies, $window, $timeout) {
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
    executeQueryService.removeGrid($rootScope.container);
    if($scope.items[0].list.length == 0 && $scope.items[1].list.length == 0) {
      $scope.mdxInputErrorMessage = "Atleast one of Measures and Columns need to be filled.";
      $scope.isMdxInputError = true;
      $timeout(function() {
        $scope.isMdxInputError = false;
      }, 3000);
    }
    else if ($scope.items[2].list.length == 0) {
      $scope.mdxInputErrorMessage = "Rows should not be empty.";
      $scope.isMdxInputError = true;
      $timeout(function() {
        $scope.isMdxInputError = false;
      }, 3000);
    }
    else {
      var parameters = {
        connId : $rootScope.connId,
        dataSource: $rootScope.DataSourceName,
        catalog: $rootScope.CatalogName,
        statement: $scope.buildQuery()
      };
      $scope.loadingQuery = true;
      executeQueryService.render($rootScope.container, parameters).then(function(data) {
        $timeout(function() {
          $scope.loadingQuery = false;
        }, 100);
        $scope.graphArray = data;
      });
    } // end else
  }; // end function

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
    if(listIdx !== 0 && currItem.hierName === "Measures" || listIdx == 0 && currItem.hierName !== "Measures") {
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
  $scope.loadingQuery = false;
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
      $scope.queryList = queryList;
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };
  //Show Bar Graph Column
  $scope.showBarGraphColumn = function() {
    if(($("."+"miniBarGraph"+"").length) === 0){
        $("#row0").prev().append("<td class="+"miniBarGraph"+"><span class='graphIcon'>"+"</span></td>");

        for(var index in $scope.graphArray) {
          if(parseInt(index) !== $scope.graphArray.length-1) {
              var dataset = $scope.graphArray;
              $rootScope.graphArray = $scope.graphArray;
              $("#row"+index).append($compile("<td class="+"miniBarGraph"+"><minibar-graph index-passed="+index+" "+"my-set="+'graphArray'+"></minibar-graph></td>")($scope));
        }
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
      if(($("."+"miniLineGraph"+"").length) === 0){
          $("#row0").prev().append("<td class="+"miniLineGraph"+"><span class='graphIcon'>"+"</span></td>");

          for(var index in $scope.graphArray) {
            if(parseInt(index) !== $scope.graphArray.length-1) {
                var dataset = $scope.graphArray;
                $rootScope.graphArray = $scope.graphArray;
                $("#row"+index).append($compile("<td class="+"miniLineGraph"+"><miniline-graph index-passed="+index+" "+"my-set="+'graphArray'+"></miniline-graph></td>")($scope));
          }
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
      if(($("."+"miniAreaGraph"+"").length) === 0){
          $("#row0").prev().append("<td class="+"miniAreaGraph"+"><span class='graphIcon'>"+"</span></td>");

          for(var index in $scope.graphArray) {
            if(parseInt(index) !== $scope.graphArray.length-1) {
                var dataset = $scope.graphArray;
                $rootScope.graphArray = $scope.graphArray;
                $("#row"+index).append($compile("<td class="+"miniAreaGraph"+"><miniarea-graph index-passed="+index+" "+"my-set="+'graphArray'+"></miniarea-graph></td>")($scope));
          }
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
      if(($("."+"miniPieGraph"+"").length) === 0){
          $("#row0").prev().append("<td class="+"miniPieGraph"+"><span class='graphIcon'>"+"</span></td>");

          for(var index in $scope.graphArray) {
            if(parseInt(index) !== $scope.graphArray.length-1){
                var dataset = $scope.graphArray;
                $rootScope.graphArray = $scope.graphArray;
                $("#row"+index).append($compile("<td class="+"miniPieGraph"+"><minipie-graph index-passed="+index+" "+"my-set="+'graphArray'+"></minipie-graph></td>")($scope));
            }
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
