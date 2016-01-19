var app = angular.module("hotChocolate");

//Graph Service to hold functions related to plotting Graphs
app.factory('GraphService', function($compile,$rootScope){
	return {
	//Get Graph data from ExecuteQuery Data
	getGraphData : function(executeQueryData) {
		var graphArray = [];
		//get Axes Details
		var axes = executeQueryData.Axes,
			axis = axes.Axis,
			axis0 = axis[0],
			axis1 = axis[1];

		//get Key Names for data
		var axis0Names = [];
		for(var index0 in axis0) {
			var axis0Member = axis0[index0].Member;
			var axis0Name = '';
			for(var memIndex0 in axis0Member) {
				axis0Name = axis0Name + axis0Member[memIndex0].Caption + ".";
			}
			axis0Name = axis0Name.substring(0,axis0Name.length-1);
			axis0Names.push(axis0Name);
		}

		var cellData = executeQueryData.CellData,
        cells = cellData.Cell,
        val = [];
    for (var cellIndex in cells) {
      var valObj = {};
      valObj.value = cells[cellIndex].FmtValue;
      val.push(valObj);
    }

		var count = 0,
			dataArray = [],
			graphData = [];

		for(var j = 0, len1 = axis1.length; j<len1;j++) {
			var tempDataObj = {},
				graphInnerArray = [];
			for(var i=0, len=axis0.length;i<len;i++) {
				var graphObj = {};
				graphObj.key = axis0Names[i];
				graphObj.value = parseFloat(val[count].value.replace(/,/g,''));
				graphInnerArray.push(graphObj);
				count++;
			}
			graphArray.push(graphInnerArray);
		}
		return graphArray;
	},

	//Render MiniGraph to be displayed in the table
	renderMiniGraph : function(dataset,container,index) {
		var dataToPass = dataset;
		function getMaxValue(dataset) {
			var result = 0;
			for(var index in dataset) {
				if(dataset[index].value > result) {
					result = dataset[index].value;
				}
			}
			return result;
		}

		var w = (dataset.length*6)+((dataset.length-1)*2);
		console.log("****************"+dataset.length);
		var h = (w*9)/16;
		var xScale = d3.scale.ordinal()
						.domain(d3.range(dataset.length))
						.rangeRoundBands([0,w],0.15);

		var yScale = d3.scale.linear()
						.domain([0,getMaxValue(dataset)])
						.range([0,h]);

		var key = function(d) {
			return d.key;
		}
		//console.log("Custom Text"+index);
		//Create SVG element
		var svg = d3.select(container)
					// .append("div")
					// .attr("ng-controller","queryController")	
					.append("button")
					// .attr('ng-hide', true)
					.attr("ng-click", "openModalGraph("+index+")")
					// .attr("href","#")
					// .attr("ng-click",console.log('From graph Service'))			
					.append("svg")
					.attr("width", w)
					.attr("height", h);

		

		//Create bars
		svg.selectAll("rect")
   		.data(dataset, key)
   		.enter()
   		.append("rect")
   		.attr("x", function(d, i) {
			return xScale(i);
   		})
   		.attr("y", function(d) {
   			console.log(h+" "+yScale(d.value));
			return h - yScale(d.value);
   		})
   		.attr("width", xScale.rangeBand())
   		.attr("height", function(d) {
			return yScale(d.value);
   		})
   		.attr("fill", function(d) {
			return "rgb(0, 0, " + (d.value * 10) + ")";
		});
		//$compile(container.find('a'))($rootScope);
   	},
   	//Service to plot graph in Modal Window
   renderModalGraph : function(dataset,container) {
   		function getMaxValue(dataset) {
			var result = 0;
			for(var index in dataset) {
				if(dataset[index].value > result) {
					result = dataset[index].value;
				}
			}
			return result;
		}

		var w = 500;
		console.log("****************"+dataset.length);
		var h = (w*9)/16;
		var xScale = d3.scale.ordinal()
						.domain(d3.range(dataset.length))
						.rangeRoundBands([0,w],0.2);

		var yScale = d3.scale.linear()
						.domain([0,getMaxValue(dataset)])
						.range([0,h]);

		var key = function(d) {
			return d.key;
		}
		//console.log("Custom Text"+index);
		//Create SVG element
		var svg = d3.select(container)
					.append("svg")
					.attr("width", w)
					.attr("height", h);

		//Create bars
		svg.selectAll("rect")
   		.data(dataset, key)
   		.enter()
   		.append("rect")
   		.attr("x", function(d, i) {
			return xScale(i);
   		})
   		.attr("y", function(d) {
   			console.log(h+" "+yScale(d.value));
			return h - yScale(d.value);
   		})
   		.attr("width", xScale.rangeBand())
   		.attr("height", function(d) {
			return yScale(d.value);
   		})
   		.attr("fill", function(d) {
			return "rgb(0, 0, " + (d.value * 10) + ")";
		})

		//Tooltip
		.on("mouseover", function(d) {
			//Get this bar's x/y values, then augment for the tooltip
			var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
			var yPosition = parseFloat(d3.select(this).attr("y")) + 14;
			
			//Update Tooltip Position & value
			d3.select("#tooltip")
				.style("left", xPosition + "px")
				.style("top", yPosition + "px")
				.select("#value")
				.text(d.value);
			d3.select("#tooltip").classed("hidden", false)
		})
		.on("mouseout", function() {
			//Remove the tooltip
			d3.select("#tooltip").classed("hidden", true);
		})	;

	//Create labels
	svg.selectAll("text")
	   .data(dataset, key)
	   .enter()
	   .append("text")
	   .text(function(d) {
			return d.value;
	   })
	   .attr("text-anchor", "middle")
	   .attr("x", function(d, i) {
			return xScale(i) + xScale.rangeBand() / 2;
	   })
	   .attr("y", function(d) {
	   	console.log(d.value);
			return h - yScale(d.value) + 14;
	   })
	   .attr("font-family", "sans-serif") 
	   .attr("font-size", "11px")
	   .attr("fill", "white");
		// $compile(angular.element(container))($rootScope);
   }
   }



});
