hotChocolate.controller('SaveQryModalCtrl',
    function ($scope, $rootScope, $uibModalInstance, $timeout, items, queryList, mdxQuery, query )
    {
        $scope.items = items;
        $scope.queryList = queryList;
        $scope.mdxQuery = mdxQuery;
       /*************** What to be done for saving **********/
       $scope.save = function () {
           var measureArray = $scope.items[0].list.length>0 ? $scope.items[0].list : [];
               colArray = $scope.items[1].list.length>0 ? $scope.items[1].list : [];
               rowArray = $scope.items[2].list.length>0 ? $scope.items[2].list : [];
               filterArray = $scope.items[3].list.length>0 ? $scope.items[3].list : [];
           var parameters = {
             queryName: $scope.newQueryName,
             userName: $rootScope.userName,
             onMeasures: measureArray,
             onColumns: colArray,
             onRows: rowArray,
             onFilters: filterArray,
             queryMDX: $scope.mdxQuery,
             connectionData: {
               dataSource: $scope.$root.DataSourceName,
               catalog: $scope.$root.CatalogName,
               cube: $scope.$root.CubeName,
             }
           };
           var connId = $rootScope.connId;
           query.saveQuery(parameters, connId).success(function(data) {
             $scope.showModalAlert = true;
             $timeout(function() {
               $scope.showModalAlert = false;
             }, 2000);
             $scope.querySaveMessage = data.info;
             if(data.status=="success")
             {
               $scope.queryList.push(data.query);
             }
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
     });
