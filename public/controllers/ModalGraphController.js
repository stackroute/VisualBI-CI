var hotChocolate = angular.module('hotChocolate');
hotChocolate.controller("ModalGraphController", function($scope,$uibModalInstance,GraphService,graphData,index){
		$scope.graphArray = graphData;
		$scope.index = index;
		$scope.ok = function() {
			$uibModalInstance.close();
		};

		$scope.cancel = function(){
			$uibModalInstance.dismiss('cancel');
		};
	});
