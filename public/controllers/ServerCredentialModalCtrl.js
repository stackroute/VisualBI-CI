hotChocolate.controller('ServerCredentialModalCtrl',
    function ($scope, $rootScope, $uibModalInstance, availableConnections, addNewConnection, saveConnection, discover)
    {
       $scope.availableConnections = availableConnections;
       $scope.connIndex = $rootScope.connIndex;
      //  console.log($scope.connIndex);
       $rootScope.$watch('connIndex', function(newValue, oldValue){
         $scope.connIndex = newValue;
         console.log("connIndex "+$scope.connIndex);
       });
       /*************** What to be done for saving **********/
       $scope.save = function (conn) {
          saveConnection.saveConnection($rootScope.userName, conn)
                        .then(function(data){
                          $rootScope.queryList = conn.savedQueries;
                          $rootScope.connId = conn._id;
                          $rootScope.connIndex = $scope.connIndex;
                          discover.getSource('/',$rootScope.connId).then(function(data){
                            $scope.DataSourceNames = data.data.values;
                            // $scope.$parent.changeConnName($scope.connName);
                            // console.log($scope.DataSourceNames);
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
         addNewConnection.addNewConnection($rootScope.userName,$scope.newConn)
                          .then(function(data){
                            var conn = data.data;
                            console.log(conn);
                            $scope.availableConnections.push(conn);
                            $rootScope.connIndex = ($scope.availableConnections.length-1)+'';
                            $rootScope.connId = conn._id;
                            discover.getSource('/',$rootScope.connId).then(function(data){
                              $scope.DataSourceNames = data.data.values;
                              // console.log($scope.DataSourceNames);
                              console.log("ok"+$scope.availableConnections.length);
                              $uibModalInstance.close($scope.DataSourceNames);
                            }, function(error){
                              $scope.DataSourceNames = [];
                              console.log("err"+$scope.availableConnections.length);
                              // $rootScope.connIndex = $scope.availableConnections.length+'';
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
