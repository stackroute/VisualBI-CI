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

		var margin = {top:20,right:20,bottom:100,left:70},
			width = 500-margin.left-margin.right,
			height = (400)-margin.top-margin.bottom;

		var x = d3.scale.ordinal()
						.rangeRoundBands([0,width],0.1,1)
						.domain(d3.map(dataset,function(d){return d.key;}));
		var y = d3.scale.linear()
						.range([height,0])
						.domain([0,getMaxValue(dataset)]);

		var xAxis = d3.svg.axis()
						.scale(x)
						.orient("bottom");
		var yAxis = d3.svg.axis()
						.scale(y)
						.orient("left");

		var svg = d3.select(container)
					.append('svg')
					.attr("width",width+margin.left+margin.right)
					.attr("height",height+margin.top+margin.bottom)
					.append('g')
					.attr("transform","translate("+margin.left+","+margin.top+")");
		//Add Axes
		svg.append('g')
			.attr("class","x axis")
			.attr("transform","translate(0,"+height+")")
			.call(xAxis)
			.selectAll("text")
			.style("text-anchor","end")
			.attr("dx","-0.5em")
			.attr("dy","0.15em")
			.attr("transform",function(d){
				return "rotate(-90)"
			});
		svg.append('g')
			.attr("class", "y axis")
			.call(yAxis)
			.attr("y",10)
			.append("text")
			.attr("transform","rotate(-90)")
			.attr("y",6)
			.attr("dy","0.71em")
			.style("text-anchor","end")
			.text("to be replaced!!!! Ge units from data");

		svg.selectAll(".bar")
			.data(dataset)
			.enter().append("rect")
			.attr("class","bar")
			.attr("x",function(d,i){return x(i);})
			.attr("width",20)
			.attr("y",function(d){return y(d.value);})
			.attr("height",function(d){return height-y(d.value);});

		d3.select("input").on("change", change);

		var sortTimeout = setTimeout(function() {
    		d3.select("input").property("checked", true).each(change);
  		}, 1000);

  		function change() {
  			clearTimeout(sortTimeout);

  			var x0 = x.domain(dataset.sort(this.checked
  				? function(a,b){return b.value - a.value;}
  				: function(a,b){return d3.ascending(a.key,b.key);})
  				.map(function(d){return d.key;}))
  				.copy();

  			svg.selectAll(".bar")
  				.sort(function (a,b){return x0(a.key)-x0(b.key);});

  			var transition = svg.transition().duration(550),
  				delay = function(d,i) {return i*50;};

  			transition.selectAll(".bar")
  						.delay(delay)
  						.attr("x",function(d){return x0(d.key);});

  			transition.select(".x.axis")
  						.call(xAxis)
  						.selectAll("text")
  						.style("text-anchor","end")
						.attr("dx","-0.8em")
						.attr("dy","0.15em")
  						.attr("transform",function(d){return "rotate(-65)";})
  						.selectAll("g")
  						.delay(delay);
  		}

   }//end of renderModalGraph
   }//end of return object



});
