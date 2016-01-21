var hotChocolate = angular.module('hotChocolate');
hotChocolate.controller('SaveWgtModalCtrl',
    function ($scope, $rootScope, $uibModalInstance, $timeout, mdxQuery, widget )
    {
      var uName = 'hotChocolate';
        $scope.mdxQuery = mdxQuery;
        $scope.isWidgetExists = false;
        $scope.widgetMessage = "You are modifying an existing widget";
        widget.getSavedWidgets(uName).success(function(data){
          $scope.widgetList = data;
          $scope.newWidgetName = data[0].widgetName;
          $scope.description = data[0].description;
        })

       /*************** What to be done for saving **********/
       $scope.save = function () {
         var connId = $rootScope.connId;
         if($scope.newWidgetName === ""){
           $scope.widgetMessage = "Widget name cannot be empty";
           $scope.isWidgetExists = true;
           $timeout(function() {
             $scope.isWidgetExists = false;
           }, 2000);
         }
         else{
           var parameters = {
             widgetName: $scope.newWidgetName,
             userName: "hotChocolate",
             queryMDX: $scope.mdxQuery,
             description: $scope.description,
             connectionData: {
               connectionId: connId,
               dataSource: $scope.$root.DataSourceName,
               catalog: $scope.$root.CatalogName,
               cube: $scope.$root.CubeName,
             }
           };
           widget.saveWidget(parameters).success(function(data) {
             $scope.showModalAlert = true;
             $timeout(function() {
               $scope.showModalAlert = false;
             }, 2000);
             $scope.widgetSaveMessage = data.info;
             if (data.status === "success"){
               $timeout(function() {
                 $uibModalInstance.close($scope.widgetList);
               }, 5000);
             }
           });
         }
       };
       $scope.getDescription = function(){
          var widgetList = $scope.widgetList,
              widgetName = $scope.newWidgetName;
          $scope.isWidgetExists = false;
          $scope.description = "";
          for(widgetIdx in widgetList){
             if (widgetList[widgetIdx].widgetName === widgetName)
              {
                $scope.isWidgetExists = true;
                $scope.description = widgetList[widgetIdx].description;
                break;
              }
              else {
                $scope.isWidgetExists = false;
              }
           }
       }
       $scope.close = function(){
         $uibModalInstance.close();
       };
       $scope.cancel = function () {
         $uibModalInstance.dismiss('cancel');
       };
     });
