var hotChocolate = angular.module('hotChocolate');
hotChocolate.controller('queryController', function($scope, $http, $rootScope, $uibModal) {
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
  $scope.newQueryName = "";

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
