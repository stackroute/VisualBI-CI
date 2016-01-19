var hotChocolate = angular.module("hotChocolate");
hotChocolate.controller('ConnectionModelController',
                        function($scope, $rootScope, $http, $uibModal, addNewConnection,
                                      getAvailableConnections, discover){
    $scope.availableConnections = [];
    $scope.addConnection = false;
    $scope.newConn = {};
    $scope.DataSourceName = "";
    // $rootScope.connIndex = '0';
    $scope.$watch('DataSourceName', function(newValue, oldValue){
      $rootScope.DataSourceName = newValue;
    });
    $scope.CatalogName = "";
    $scope.$watch('CatalogName', function(newValue, oldValue){
      $rootScope.CatalogName = newValue;
    });
    $scope.CubeName = "";
    $scope.$watch('CubeName', function(newValue, oldValue){
      $rootScope.CubeName = newValue;
    });
    $scope.DataSourceNames = [];
    $scope.CatalogNames = [];
    $scope.CubeNames = [];
    $scope.dimensions = [];
    $rootScope.dimensions = [];
    $scope.measures = [];
    $rootScope.measures = [];
    $scope.getActiveConnection = function(userName){
      var activeConnId;
      getAvailableConnections.availableConnections(userName).then(function(availableConnections) {
        $scope.availableConnections = availableConnections.data;
        console.log($scope.availableConnections);
        getAvailableConnections.activeConnection(userName).then(function(activeConnection){
          console.log(activeConnection);
          activeConnId = activeConnection.data;
          console.log(activeConnId);
          for(var connIdx in $scope.availableConnections){
            if (activeConnId === $scope.availableConnections[connIdx]._id){
              $rootScope.connIndex  = connIdx;
            }
          }
          $rootScope.queryList = $scope.availableConnections[$rootScope.connIndex].savedQueries;
          console.log($rootScope.queryList);
          $rootScope.connId = activeConnId;
          discover.getSource('/').then(function(data){
            console.log("inside getSource");
            $scope.DataSourceNames = data.data.values;
            console.log($scope.DataSourceNames);
          }, function(error){
            $scope.DataSourceNames = [];
            console.log(error);
          });
        });
      });
    };
    $scope.getCatalogNames = function(DataSourceName){
      // $rootScope.DataSourceName = DataSourceName;
      $scope.CubeName = "";
      $scope.CubeNames = [];
      discover.getSource('/'+DataSourceName).then(function(data){
        $scope.CatalogNames = data.data.values;
        console.log($scope.CatalogNames);
      });
    };
    $scope.getCubeNames = function(DataSourceName, CatalogName){
      // $rootScope.DataSourceName =
      console.log('/'+DataSourceName+'/'+CatalogName);
      discover.getSource('/'+DataSourceName+'/'+CatalogName).then(function(data){
        $scope.CubeNames = data.data.values;
        console.log($scope.CubeNames);
      });
    };
    $scope.getChildren = function(DataSourceName, CatalogName, CubeName){
      console.log('/'+DataSourceName+'/'+CatalogName+'/'+CubeName);
      discover.getDimensions('/'+DataSourceName+'/'+CatalogName+'/'+CubeName)
                      .then(function(data){
                         console.log(data.data.values);
                         $scope.dimensions = data.data.values;
      });
      discover.getMeasures('/'+DataSourceName+'/'+CatalogName+'/'+CubeName)
                      .then(function(data){
                            console.log(data.data.values);
                            $scope.measures = data.data.values;
                            for(var i=0; i < $scope.measures.length; i++) {
                              $scope.measures[i].isMember = "yes";
                            }
      });
    };
    $scope.getHierarchies = function(idx) {
      var pathName= "/"+ $scope.DataSourceName +
                    "/" + $scope.CatalogName +
                    "/" + $scope.CubeName +
                    "/" + $scope.dimensions[idx].unique_name;
      discover.getDimensions(pathName)
                      .then(function(data){
                         console.log(data.data.values);
                         $scope.dimensions[idx].children = data.data.values;

            });
    };
    $scope.getLevels = function(dimIdx, hierIdx) {
        var pathName= "/"+ $scope.DataSourceName +
                      "/" + $scope.CatalogName +
                      "/" + $scope.CubeName +
                      "/" + $scope.dimensions[dimIdx].unique_name +
                      "/" + $scope.dimensions[dimIdx].children[hierIdx].unique_name;
        discover.getDimensions(pathName)
                        .then(function(data){
                           console.log(data.data.values);
                           $scope.dimensions[dimIdx].children[hierIdx].children = data.data.values;
                        });
    };
    $scope.getMembers = function(dimIdx, hierIdx, levelIdx) {
      var pathName= "/"+ $scope.DataSourceName +
                    "/" + $scope.CatalogName +
                    "/" + $scope.CubeName +
                    "/" + $scope.dimensions[dimIdx].unique_name +
                    "/" + $scope.dimensions[dimIdx].children[hierIdx].unique_name +
                    "/" + $scope.dimensions[dimIdx].children[hierIdx].children[levelIdx].unique_name;
      discover.getDimensions(pathName)
                      .then(function(data){
                         console.log(data.data.values);
                         var members = data.data.values;
                         for(var i=0, len = members.length; i < len; i++) { members[i].isMember = "yes"; }
                         $scope.dimensions[dimIdx].children[hierIdx].children[levelIdx].children = members;
                       });
    };

    $scope.$on('retrieveQueryEvent', function(event, data) {
      console.log(data);
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
   });
