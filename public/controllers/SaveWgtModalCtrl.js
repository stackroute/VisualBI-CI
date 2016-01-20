hotChocolate.controller('SaveWgtModalCtrl',
    function ($scope, $rootScope, $uibModalInstance, $timeout, mdxQuery, widget )
    {
        $scope.mdxQuery = mdxQuery;
       /*************** What to be done for saving **********/
       $scope.save = function () {
         var connId = $rootScope.connId;
           var parameters = {
             widgetName: $scope.newWidgetName,
             userName: "hotChocolate",
             queryMDX: $scope.mdxQuery,
             connectionData: {
               connectionId: connId,
               dataSource: $scope.$root.DataSourceName,
               catalog: $scope.$root.CatalogName,
               cube: $scope.$root.CubeName,
             }
           };
           widget.saveWidget(parameters).success(function(data) {
             console.log(data);
             $scope.showModalAlert = true;
             $timeout(function() {
               $scope.showModalAlert = false;
             }, 2000);
             $scope.widgetSaveMessage = data.info;
           });
       };
       $scope.close = function(){
         $uibModalInstance.close();
       };
       $scope.cancel = function () {
         $uibModalInstance.dismiss('cancel');
       };

        //  $uibModalInstance.close();
     });
