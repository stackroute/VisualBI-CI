/*
   * Copyright 2016 NIIT Ltd, Wipro Ltd.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *    http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * Contributors:
   *
   * 1. Abhilash Kumbhum
   * 2. Anurag Kankanala
   * 3. Bharath Jaina
   * 4. Digvijay Singam
   * 5. Sravani Sanagavarapu
   * 6. Vipul Kumar
*/

hotChocolate.controller('ServerCredentialModalCtrl',
    function ($scope, $rootScope, $uibModalInstance, availableConnections, addNewConnection, saveConnection, discover)
    {
       $scope.availableConnections = availableConnections;
       $scope.connIndex = $rootScope.connIndex;
       $rootScope.$watch('connIndex', function(newValue, oldValue){
         $scope.connIndex = newValue;
       });
       /*************** On Save **********/
       $scope.save = function (conn) {
          saveConnection.saveConnection($rootScope.userName, conn)
            .then(function(data){
              $rootScope.queryList = conn.savedQueries;
              // $rootScope.widgetList = conn.savedWidgets;
              $rootScope.connId = conn._id;
              $rootScope.connIndex = $scope.connIndex;
              discover.getSource('/',$rootScope.connId).then(function(data){
                $scope.DataSourceNames = data.data.values;
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
                $rootScope.queryList = [];
                $scope.availableConnections.push(conn);
                $rootScope.connIndex = ($scope.availableConnections.length-1)+'';
                $rootScope.connId = conn._id;
                discover.getSource('/',$rootScope.connId).then(function(data){
                  $scope.DataSourceNames = data.data.values;
                  $uibModalInstance.close($scope.DataSourceNames);
                }, function(error){
                  $scope.DataSourceNames = [];
                  $uibModalInstance.close();
                });
            });
       };
       $scope.addNewConnection = function(){
         $scope.addConnection = !$scope.addConnection;
       };
     });
