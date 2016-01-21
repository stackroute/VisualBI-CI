angular.module("hotChocolate").controller("ModalGraphController", function($scope,$uibModalInstance,GraphService,graphData,index){
	$scope.graphArray = graphData;
	$scope.index = index;
	console.log(graphData);
	$scope.ok = function() {
		$uibModalInstance.close();
	};

	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	};
});