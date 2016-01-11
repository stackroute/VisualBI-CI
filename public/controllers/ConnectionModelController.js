angular.module("hotChocolate",['ui.bootstrap'])
       .controller('ConnectionModelController',function($scope, $uibModal){
        //  $scope.displayField ='Connection Name'; //['Connection Name','Server URL'];
         $scope.availableConnections = [
           {connectionName:'Vipul',url:'http://172.23.238.252:8080/pentaho/Xmla',userId:'admin',password:'password'},
           {connectionName:'Bharath',url:'http://252:8080/pentaho/Xmla',userId:'adn',password:'paord'}];
        $scope.addConnection = false;
        $scope.newConn = {};
         $scope.open = function(){
           var modalInstance = $uibModal.open({
             animation: $scope.animationsEnabled,
             templateUrl: 'serverCredentials.html',
             controller: 'ModalInstanceCtrl',
             resolve: {
               displayField: function(){
                 return $scope.displayField;
               },
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
         };
         $scope.toggleAnimation = function () {
          $scope.animationsEnabled = !$scope.animationsEnabled;
         };
       });

  //      modalInstance.result.then(function (selectedItem) {
  //     $scope.selected = selectedItem;
  //   }, function () {
  //     $log.info('Modal dismissed at: ' + new Date());
  //   });
  // };

   angular.module('hotChocolate').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, availableConnections) {

         $scope.availableConnections = availableConnections;
        //  $scope.selected = {
        //    availableConnection: $scope.availableConnections[0]
        //  };
/*************** What to be done for saving **********/
         $scope.save = function () {
          //  $uibModalInstance.close($scope.selected.item);
          // save and show server details
         };

         $scope.cancel = function () {
           $uibModalInstance.dismiss('cancel');
         };

         $scope.reset = function () {
           $scope.newConn = {};
         };

         $scope.addConn = function(){
           // validate the form and route
         };

         $scope.addNewConnection = function(){
           $scope.addConnection = !$scope.addConnection;
         };

       });
