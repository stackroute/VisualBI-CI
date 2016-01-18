var hotChocolate = angular.module('hotChocolate');
hotChocolate.controller('queryController', function($scope, $http, $rootScope,GraphService,$uibModal,$compile) {
  $scope.items = [{
                    label: 'Columns',
                    list: []
                  }, {
                    label: 'Rows',
                    list: []
                  }, {
                    label: 'Filters',
                    list: []
                  }];

  $scope.deleteItem = function(childIndex, parentIndex) {
    $scope.items[parentIndex].list.splice(childIndex, 1);
  };
  $scope.queryList = [];
  $scope.querySaveMessage = "";
  $scope.showModalAlert = false;
  $scope.hideMe = function(list) {
    return list.length > 0;
  };

  $scope.mdxQuery = "";
  $scope.executeQueryData = {};
  $scope.graphArray = [];
  $scope.newQueryName = "";
  $rootScope.graphArray = [];

  $http.get('/query/byUser', {
    params: {
      userName: 'hotChocolate'
    }
  }).success(function(data) {
      if(data.length > 0) {
        if (data.status && data.status === 'error') {
          console.log(data.error);
        } else {
          $scope.queryList = data;
        }
      }
  });

  //Show Graph Column function
  $scope.showGraphColumn = function() {
    console.log("entered showGraphColumn");
    if(($("."+"miniGraph"+"").length) === 0){
        $("#row0").prev().append("<td class="+"miniGraph"+"><span class='graphIcon'>"+"miniGraph"+"</span></td>");
        
        //$scope.graphArray = graphArray;
        for(var index in $scope.graphArray) {
          console.log($scope.graphArray);
          var dataset = $scope.graphArray;
          console.log(dataset);
          $rootScope.graphArray = $scope.graphArray;
          $("#row"+index).append($compile("<td class="+"miniGraph"+"><mini-graphs index-passed="+index+" "+"my-set="+'graphArray'+"></mini-graphs></td>")($scope));
            //GraphService.renderMiniGraph(graphArray[index],'#row'+index+ ' '+'td.'+"miniGraph"+ ' ' +'span.graphIcon',index);

        }
      }
      else {
        $("."+"miniGraph"+"").toggle();
      }
  };

  //Show Modal Graph in Modal Window
  $scope.openModalGraph = function(indexPassed) {
    var modalInstance = $uibModal.open({
      templateUrl : 'modalGraph.html',
      controller : 'ModalGraphController',
      indexPassed : indexPassed,
      //data : $scope.graphArray,
      resolve : {
        graphData : function() {
          return $rootScope.graphArray;
        },

        index : function() {
          return indexPassed;
        }
      }
    });
  };

});
