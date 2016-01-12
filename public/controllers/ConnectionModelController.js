var hotChocolate = angular.module("hotChocolate");
hotChocolate.controller('ConnectionModelController',
                        function($scope, $http, $uibModal, addNewConnection,
                                      getAvailableConnections, discover){
    $scope.availableConnections = [];
    $scope.addConnection = false;
    $scope.newConn = {};
    $scope.DataSourceNames = [];
    $scope.CatalogNames = [];
    $scope.CubeNames = [];
    $scope.getCatalogNames = function(DataSourceName){
      $scope.CubeNames = [];
      discover.getSource('/'+DataSourceName).then(function(data){
        $scope.CatalogNames = data.data.values;
        console.log($scope.CatalogNames);
      });
    };
    $scope.getCubeNames = function(DataSourceName, CatalogName){
      console.log('/'+DataSourceName+'/'+CatalogName);
      discover.getSource('/'+DataSourceName+'/'+CatalogName).then(function(data){
        $scope.CubeNames = data.data.values;
        console.log($scope.CubeNames);
      });
    };
    $scope.getChildren = function(DataSourceName, CatalogName, CubeName){
      console.log('/'+DataSourceName+'/'+CatalogName+'/'+CubeName);
      discover.getChildren('/'+DataSourceName+'/'+CatalogName+'/'+CubeName).then(function(data){
        console.log(data.data.values);
      });
    };
    $scope.open = function(){
      var response = getAvailableConnections.availableConnections();
      response.then(function(data) {
        $scope.availableConnections = data.data;
        var modalInstance = $uibModal.open({
           animation: $scope.animationsEnabled,
           templateUrl: 'serverCredentials.html',
           controller: 'ModalInstanceCtrl',
           resolve: {
             availableConnections: function(){
               return $scope.availableConnections;
             },
             addConnection: function(){
               return $scope.addConnection;
             },
             newConn: function(){
               return $scope.newConn;
             }
           }
         });
         modalInstance.result.then(function (DataSourceNames) {
           $scope.CatalogNames = [];
           $scope.CubeNames = [];
           $scope.DataSourceNames = DataSourceNames;
         });
       });
     };
     $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
     };
   });



hotChocolate.controller('ModalInstanceCtrl',
    function ($scope, $uibModalInstance, availableConnections, addNewConnection, saveConnection, discover)
    {
       $scope.availableConnections = availableConnections;
      //  $scope.DataSourceNames = DataSourceNames;
       /*************** What to be done for saving **********/
       $scope.save = function (conn) {
          if(conn!=="? undefined:undefined ?")
        {
          saveConnection.saveConnection(conn)
                        .then(function(data){
                          discover.getSource('/').then(function(data){
                            $scope.DataSourceNames = data.data.values;
                            console.log($scope.DataSourceNames);
                            $uibModalInstance.close($scope.DataSourceNames);
                          }, function(error){
                            $scope.DataSourceNames = [];
                            console.log(error);
                            $uibModalInstance.close();
                          });
                         });
       }};
       $scope.cancel = function () {
         $uibModalInstance.dismiss('cancel');
       };
       $scope.reset = function () {
         $scope.newConn = {};
       };
       $scope.addConn = function(){
         addNewConnection.addNewConnection($scope.newConn)
                          .then(function(){
                            discover.getSource('/').then(function(data){
                              $scope.DataSourceNames = data.data.values;
                              console.log($scope.DataSourceNames);
                              $uibModalInstance.close($scope.DataSourceNames);
                            }, function(error){
                              $scope.DataSourceNames = [];
                              console.log(error);
                              $uibModalInstance.close();
                            });
                        });
        //  $uibModalInstance.close();
       };
       $scope.addNewConnection = function(){
         $scope.addConnection = !$scope.addConnection;
       };
     });
