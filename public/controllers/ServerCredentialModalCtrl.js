hotChocolate.controller('ServerCredentialModalCtrl',
    function ($scope, $rootScope, $uibModalInstance, availableConnections, addNewConnection, saveConnection, discover)
    {
       $scope.availableConnections = availableConnections;
       $scope.connIndex = $rootScope.connIndex;
      //  console.log($scope.connIndex);
       $scope.$watch('connIndex', function(newValue, oldValue){
         $rootScope.connIndex = newValue;
       });
       /*************** What to be done for saving **********/
       $scope.save = function (conn) {
          saveConnection.saveConnection(conn)
                        .then(function(data){
                          $rootScope.connId = conn._id;
                          discover.getSource('/').then(function(data){
                            $scope.DataSourceNames = data.data.values;
                            // $scope.$parent.changeConnName($scope.connName);
                            // console.log($scope.DataSourceNames);
                            $rootScope.connIndex = $scope.connIndex;
                            $uibModalInstance.close($scope.DataSourceNames);
                          }, function(error){
                            $scope.DataSourceNames = [];
                            console.log(error);
                            $uibModalInstance.close();
                          });
                         });
       };
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
                              // console.log($scope.DataSourceNames);
                              $rootScope.connIndex = $scope.availableConnections.length+'';
                              console.log("ok"+$scope.availableConnections.length);
                              $uibModalInstance.close($scope.DataSourceNames);
                            }, function(error){
                              $scope.DataSourceNames = [];
                              console.log("err"+$scope.availableConnections.length);
                              $rootScope.connIndex = $scope.availableConnections.length+'';
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
