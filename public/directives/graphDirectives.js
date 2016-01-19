angular.module("hotChocolate").directive("modalGraph", function(GraphService) {
	return {
		restrict : "AE",
		scope : {
			index : "=indexPassed",
			graphArray : "=graphArray"
		},
		link : function(scope,element,attr) {
			var index = scope.index;
			var graphArray = scope.graphArray;
			GraphService.renderModalGraph(graphArray[index],element[0]);
		}		
	}
	
});

angular.module("hotChocolate").directive("miniGraphs", function(GraphService,$compile){
	return {
		restrict : "E",
		//replace : true,
		scope : {
			data: "=mySet",
			index : "=indexPassed",
		},
		link : function(scope,element,attr) {			
			var idx = parseInt(scope.index);
			var dataset = scope.data;
			console.log(dataset);
			console.log(dataset[idx]);
			GraphService.renderMiniGraph(dataset[idx],element[0],idx);
			$compile(element.find('button'))(scope.$parent);
		}

	}
});