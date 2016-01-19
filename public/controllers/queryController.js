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
