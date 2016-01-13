var hotChocolate = angular.module("hotChocolate");
hotChocolate.controller('ConnectionModelController',
                        function($scope, $rootScope, $http, $uibModal, addNewConnection,
                                      getAvailableConnections, discover){
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
      $rootScope.CubeName = newValue;
    });
    $scope.DataSourceNames = [];
    $scope.CatalogNames = [];
    $scope.CubeNames = [];
    $scope.dimensions = [];
    $scope.measures = [];
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
    $scope.getHierarchies = function(parent_unique_name) {
      var pathName= "/"+ $scope.DataSourceName +
                    "/" + $scope.CatalogName +
                    "/" + $scope.CubeName +
                    "/" + parent_unique_name;
      discover.getDimensions(pathName)
                      .then(function(data){
                         console.log(data.data.values);
                        var len = $scope.dimensions.length;
                        for(var i=0; i < len; i++) {
                          if($scope.dimensions[i].unique_name === parent_unique_name) {
                            $scope.dimensions[i].children = data.data.values;
                          }
                        }
            });
          };
    $scope.getLevels = function(dim_unique_name, hier_unique_name) {
        var pathName= "/"+ $scope.DataSourceName +
                      "/" + $scope.CatalogName +
                      "/" + $scope.CubeName +
                      "/" + dim_unique_name +
                      "/" + hier_unique_name;
        discover.getDimensions(pathName)
                        .then(function(data){
                           console.log(data.data.values);
                           var dim_len = $scope.dimensions.length;
                           for(var i=0; i < dim_len; i++) {
                               if($scope.dimensions[i].unique_name === dim_unique_name) {
                                 var hiers = $scope.dimensions[i].children;
                                 var hier_len = hiers.length;
                                 for(var j=0; j < hier_len; j++) {
                                   if(hiers[j].unique_name === hier_unique_name) {
                                     hiers[j].children = data.data.values;
                                   }
                                 }
                               }
                             }
                           });
                         };
    $scope.getMembers = function(dim_unique_name, hier_unique_name, level_unique_name) {
      var pathName= "/"+ $scope.DataSourceName +
                    "/" + $scope.CatalogName +
                    "/" + $scope.CubeName +
                    "/" + dim_unique_name +
                    "/" + hier_unique_name+
                    "/" + level_unique_name;
      discover.getDimensions(pathName)
                      .then(function(data){
                         console.log(data.data.values);
                         var dim_len = $scope.dimensions.length;
                         for(var i=0; i < dim_len; i++) {
                            if($scope.dimensions[i].unique_name === dim_unique_name) {
                              var hiers = $scope.dimensions[i].children;
                              var hier_len = hiers.length;
                              for(var j=0; j < hier_len; j++) {
                                if(hiers[j].unique_name === hier_unique_name) {
                                  var levels = hiers[j].children;
                                  var level_len = levels.length;
                                  for(var k=0; k < level_len; k++) {
                                    if(levels[k].unique_name === level_unique_name) {
                                      levels[k].children = data.data.values;
                                      for(var l=0; l < levels[k].children.length; l++) {
                                        levels[k].children[l].isMember = "yes";
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
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
           $scope.DataSourceName = "";
           $scope.CatalogName = "";
           $scope.CubeName = "";
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
