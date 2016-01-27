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

var hotChocolate = angular.module("hotChocolate");
hotChocolate.controller('ConnectionModelController',
                        function($scope, $rootScope, $http, $cookies, $window, $uibModal, addNewConnection,
                                      getAvailableConnections, executeQueryService, discover, user_id){
    if(!$cookies.get('userName')){
      $window.location.href = '/';
    }
    else{
      $rootScope.userName = $cookies.get('userName');
      user_id.getUserId($rootScope.userName).success(function(data){
        $rootScope.user_id = data;
      });
      $scope.availableConnections = [];
      $scope.addConnection = false;
      $scope.newConn = {};
      $scope.DataSourceName = "";
      $scope.$watch('DataSourceName', function(newValue, oldValue){
        $rootScope.DataSourceName = newValue;
      });
      $scope.CatalogName = "";
      $scope.$watch('CatalogName', function(newValue, oldValue){
        $rootScope.CatalogName = newValue;
      });
      $scope.CubeName = "";
      $scope.$watch('CubeName', function(newValue, oldValue){
        executeQueryService.removeGrid($rootScope.container);
        $rootScope.CubeName = newValue;
        if($rootScope.selectedRetrieveQuery === false){
            $rootScope.$broadcast('resetQueryData');
        }
        else{
            $rootScope.selectedRetrieveQuery = false;
        }
        $scope.dimensions = [];
        $scope.measures = [];
      });
      $scope.DataSourceNames = [];
      $scope.CatalogNames = [];
      $scope.CubeNames = [];
      $scope.dimensions = [];
      $rootScope.dimensions = [];
      $scope.measures = [];
      $rootScope.measures = [];
      $rootScope.queryList = [];
      $scope.getActiveConnection = function(){
        var activeConnId;
        var userName = $rootScope.userName;
        getAvailableConnections.availableConnections(userName).then(function(availableConnections) {
          $scope.availableConnections = availableConnections.data;
          if($scope.availableConnections.length !== 0){
            getAvailableConnections.activeConnection(userName).then(function(activeConnection){
              activeConnId = activeConnection.data;
              for(var connIdx in $scope.availableConnections){
                if (activeConnId === $scope.availableConnections[connIdx]._id){
                  $rootScope.connIndex  = connIdx;
                }
              }
              $rootScope.queryList = $scope.availableConnections[$rootScope.connIndex].savedQueries;
              $rootScope.connId = activeConnId;
              discover.getSource('/',$rootScope.connId).then(function(data){
                $scope.DataSourceNames = data.data.values;
              }, function(error){
                $scope.DataSourceNames = [];
              });
            });
          }
        });
      };
      $scope.getCatalogNames = function(DataSourceName){
        $scope.CatalogName = "";
        $scope.CatalogNames = [];
        $scope.CubeName = "";
        $scope.CubeNames = [];
        if(DataSourceName !== ""){
          discover.getSource('/'+DataSourceName, $rootScope.connId).then(function(data){
            $scope.CatalogNames = data.data.values;
          });
        }
      };
      $scope.getCubeNames = function(DataSourceName, CatalogName){
        $scope.CubeName = "";
        $scope.CubeNames = [];
        if(DataSourceName !== "" && CatalogName !== ""){
          discover.getSource('/'+DataSourceName+'/'+CatalogName, $rootScope.connId).then(function(data){
            $scope.CubeNames = data.data.values;
          });
        }
      };
      $scope.getChildren = function(DataSourceName, CatalogName, CubeName){
        if(DataSourceName !== "" && CatalogName !== "" && CubeName !== ""){
          discover.getDimensions('/'+DataSourceName+'/'+CatalogName+'/'+CubeName, $rootScope.connId)
                          .then(function(data){
                             $scope.dimensions = data.data.values;
          });
          discover.getMeasures('/'+DataSourceName+'/'+CatalogName+'/'+CubeName, $rootScope.connId)
                          .then(function(data){
                                $scope.measures = data.data.values;
                                for(var i=0; i < $scope.measures.length; i++) {
                                  $scope.measures[i].isMember = "yes";
                                  $scope.measures[i].hierName = "Measures";
                                  $scope.measures[i].levelIdx = 0;
                                }
          });
        }
      };
      $scope.getHierarchies = function(idx) {
        var pathName= "/"+ $scope.DataSourceName +
                      "/" + $scope.CatalogName +
                      "/" + $scope.CubeName +
                      "/" + $scope.dimensions[idx].unique_name;
        discover.getDimensions(pathName,$rootScope.connId)
                        .then(function(data){
                           $scope.dimensions[idx].children = data.data.values;

              });
      };
      $scope.getLevels = function(dimIdx, hierIdx) {
          var pathName= "/"+ $scope.DataSourceName +
                        "/" + $scope.CatalogName +
                        "/" + $scope.CubeName +
                        "/" + $scope.dimensions[dimIdx].unique_name +
                        "/" + $scope.dimensions[dimIdx].children[hierIdx].unique_name;
          discover.getDimensions(pathName,$rootScope.connId)
                          .then(function(data){
                           var levels = data.data.values;
                           for(var i=0, len=levels.length; i < len; i++) {
                             levels[i].hierName = $scope.dimensions[dimIdx].children[hierIdx].unique_name;
                             levels[i].levelIdx = i;
                             levels[i].isMember = "no";
                           }
                           $scope.dimensions[dimIdx].children[hierIdx].children = levels;
                          });
      };
      $scope.getMembers = function(dimIdx, hierIdx, levelIdx) {
        var pathName= "/"+ $scope.DataSourceName +
                      "/" + $scope.CatalogName +
                      "/" + $scope.CubeName +
                      "/" + $scope.dimensions[dimIdx].unique_name +
                      "/" + $scope.dimensions[dimIdx].children[hierIdx].unique_name +
                      "/" + $scope.dimensions[dimIdx].children[hierIdx].children[levelIdx].unique_name;
        discover.getDimensions(pathName,$rootScope.connId)
                        .then(function(data){
                           var members = data.data.values;
                         for(var i=0, len = members.length; i < len; i++) {
                           members[i].isMember = "yes";
                           members[i].hierName = $scope.dimensions[dimIdx].children[hierIdx].unique_name;
                           members[i].levelIdx = 10000 + i;
                         }
                           $scope.dimensions[dimIdx].children[hierIdx].children[levelIdx].children = members;
                         });
      };

      $scope.$on('retrieveQueryEvent', function(event, data) {
        if( $scope.DataSourceName !== data.dataSource)
        {
          $scope.DataSourceName =  data.dataSource;
          $scope.getCatalogNames(data.dataSource);
        }
        if($scope.CatalogName !== data.catalog)
        {
          $scope.CatalogName =  data.catalog;
          $scope.getCubeNames(data.dataSource, data.catalog);
        }
        if($scope.CubeName !== data.cube)
        {
          $scope.CubeName =  data.cube;
        }

        $scope.getChildren(data.dataSource, data.catalog, data.cube);
      });

      $scope.open = function(){
          var modalInstance = $uibModal.open({
             animation: $scope.animationsEnabled,
             windowClass: "modal fade in",
             templateUrl: 'serverCredentials.html',
             controller: 'ServerCredentialModalCtrl',
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
             $scope.DataSourceName = "";
             $scope.CatalogName = "";
             $scope.CubeName = "";
             $scope.CatalogNames = [];
             $scope.CubeNames = [];
             $scope.dimensions = [];
             $scope.measures = [];
             $scope.DataSourceNames = DataSourceNames;
           });
       };
       $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
       };
   }
   });
