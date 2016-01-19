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
  $scope.newQueryName = "";

  $scope.retrieveQuery = function(idx) {
    var query = $scope.queryList[idx];
    console.log(query);
      $rootScope.selectedRetrieveQuery = true;
      $scope.items[0].list = query.onColumns;
      $scope.items[1].list = query.onRows;
      $scope.items[2].list = query.onFilters;
      if(query.connectionData.dataSource === $rootScope.DataSourceName ||
          query.connectionData.catalog === $rootScope.CatalogName ||
            query.connectionData.cube === $rootScope.CubeName){
        $rootScope.selectedRetrieveQuery = false;
      }
      $rootScope.$broadcast('retrieveQueryEvent', query.connectionData);
  };
  $scope.$on('resetQueryData', function(event) {
    $scope.items[0].list = [];
    $scope.items[1].list = [];
    $scope.items[2].list = [];
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
});
