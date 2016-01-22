var hotChocolate = angular.module('hotChocolate');
hotChocolate.controller('queryController', function($scope, $http, $rootScope,GraphService,$uibModal,$compile) {
  $scope.items = [{
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
  $scope.queryList = [];
  // $scope.$watch()
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

  $http.get('/query/byUser', {
    params: {
      userName: 'hotChocolate'
    }
  }).success(function(data) {
      if(data.length > 0) {
        if (data.status && data.status === 'error') {
          console.log(data.error);
        } else {
          $scope.queryList = data;
        }
      }
  });

  $scope.retrieveQuery = function(idx) {
    $http.get('/query/find', {
      params: {
        queryName: $scope.queryList[idx].queryName
      }
    }).success(function(data) {
      $scope.items[0].list = data.onColumns;
      $scope.items[1].list = data.onRows;
      $rootScope.$broadcast('retrieveQueryEvent', data.connectionData);
    });
  };
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
        }
        else {
          $("."+"miniAreaGraph"+"").toggle();
        }
  }

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
  }

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

});


hotChocolate.controller('SaveQryModalCtrl',
    function ($scope, $uibModalInstance, $timeout, items, queryList, mdxQuery, saveQuery )
    {
        $scope.items = items;
        $scope.queryList = queryList;
        console.log($scope.queryList);
        $scope.mdxQuery = mdxQuery;
       /*************** What to be done for saving **********/
       $scope.save = function () {
           console.log($scope.items);
           var colArray = $scope.items[0].list.length>0 ? $scope.items[0].list : [];
               rowArray = $scope.items[1].list.length>0 ? $scope.items[1].list : [];
               filterArray = $scope.items[2].list.length>0 ? $scope.items[2].list : [];
           var parameters = {
             queryName: $scope.newQueryName,
             userName: "hotChocolate",
             colArray: colArray,
             rowArray: rowArray,
             filterArray: filterArray,
             queryMDX: $scope.mdxQuery,
             connectionData: {
               // xmlaServer: "http://172.23.238.252:8080/pentaho/Xmla?userid=admin&password=password",
               dataSource: $scope.$root.DataSourceName,
               catalog: $scope.$root.CatalogName,
               cube: $scope.$root.CubeName,
             }
           };
           saveQuery.saveQuery(parameters).success(function(data) {

             console.log(data);
             $scope.showModalAlert = true;
             $timeout(function() {
               $scope.showModalAlert = false;
             }, 2000);
             $scope.querySaveMessage = data.info;
             if(data.status=="success")
             {
               $scope.queryList.push({queryName : $scope.newQueryName});
             }
             console.log($scope.queryList);
             if (data.status === "success"){
               $timeout(function() {
                 $uibModalInstance.close($scope.queryList);
               }, 5000);
             }
           });
       };
       $scope.close = function(){
         $uibModalInstance.close($scope.queryList);
       };
       $scope.cancel = function () {
         $uibModalInstance.dismiss('cancel');
       };

        //  $uibModalInstance.close();
     });
