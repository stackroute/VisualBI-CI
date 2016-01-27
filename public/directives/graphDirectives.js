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

//Directive for modal Bar Graph
angular.module("hotChocolate").directive("modalbarGraph", function(GraphService) {
	return {
		restrict : "AE",
		scope : {
			index : "=indexPassed",
			graphArray : "=graphArray"
		},
		link : function(scope,element,attr) {
			var index = scope.index;
			var graphArray = scope.graphArray;
			GraphService.renderModalBarGraph(graphArray[index],element[0]);
		}
	}

});

//Directive for mini Bar Graph
angular.module("hotChocolate").directive("minibarGraph", function(GraphService,$compile){
	return {
		restrict : "E",
		scope : {
			data: "=mySet",
			index : "=indexPassed"
		},
		link : function(scope,element,attr) {
			var idx = parseInt(scope.index);
			var dataset = scope.data;
			GraphService.renderMiniBarGraph(dataset[idx],element[0],idx);
			$compile(element.find('div'))(scope.$parent);
		}
	}
});

//Directive for mini Line chart
angular.module("hotChocolate").directive("minilineGraph", function(GraphService,$compile){
	return {
		restrict : "E",
		scope : {
			data: "=mySet",
			index : "=indexPassed"
		},
		link : function(scope,element,attr) {
			var idx = parseInt(scope.index);
			var dataset = scope.data;
			GraphService.renderMiniLineGraph(dataset[idx],element[0],idx);
			$compile(element.find('div'))(scope.$parent);
		}
	}
});

//Directive for Modal Line Graph
angular.module("hotChocolate").directive("modallineGraph", function(GraphService,$compile){
	return {
		restrict : "AE",
		scope : {
			index : "=indexPassed",
			graphArray : "=graphArray"
		},
		link : function(scope,element,attr) {
			var index = scope.index;
			var graphArray = scope.graphArray;
			GraphService.renderModalLineGraph(graphArray[index],element[0]);
		}
	}
});

//Directive for Mini Area Graph
angular.module("hotChocolate").directive("miniareaGraph", function(GraphService,$compile){
	return {
		restrict : "E",
		scope : {
			data : "=mySet",
			index : "=indexPassed"
		},
		link : function(scope,element,attr) {
			var idx = parseInt(scope.index);
			var dataset = scope.data;
			GraphService.renderMiniAreaGraph(dataset[idx],element[0],idx);
			$compile(element.find('div'))(scope.$parent);
		}
	}
});

//Directive for Modal Area Graph
angular.module("hotChocolate").directive("modalareaGraph",function(GraphService,$compile){
	return {
		restrict : "AE",
		scope : {
			index : "=indexPassed",
			graphArray : "=graphArray"
		},
		link : function(scope,element,attr) {
			var index = scope.index;
			var graphArray = scope.graphArray;
			GraphService.renderModalAreaGraph(graphArray[index],element[0]);
		}
	}
});

//Directive for mini Pie Graph
angular.module("hotChocolate").directive("minipieGraph", function(GraphService,$compile){
	return {
		restrict : "E",
		scope : {
			data : "=mySet",
			index : "=indexPassed"
		},
		link : function(scope,element,attr) {
			var idx = parseInt(scope.index);
			var dataset = scope.data;
			GraphService.renderMiniPieGraph(dataset[idx],element[0],idx);
			$compile(element.find('div'))(scope.$parent);
		}
	}
});

//Directive for Modal Pie Graph
angular.module("hotChocolate").directive("modalpieGraph",function(GraphService,$compile){
	return {
		restrict : "AE",
		scope : {
			index : "=indexPassed",
			graphArray : "=graphArray"
		},
		link : function(scope,element,attr) {
			var index = scope.index;
			var graphArray = scope.graphArray;
			GraphService.renderModalPieGraph(graphArray[index],element[0]);
		}
	}
});
