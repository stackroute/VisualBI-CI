var app = angular.module("hotChocolate");

//Graph Service to hold functions related to plotting Graphs
app.factory('GraphService', function($compile,$rootScope){
	return {


		//Render MiniBarGraph to be displayed in the table
		renderMiniBarGraph : function(dataset,container,index) {
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
						.attr("ng-click", "openModalBarGraph("+index+")")
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
   		},//Enf od render Mini Graph

   		//Service to plot graph in Modal Window
   		renderModalBarGraph : function(dataset,container) {
   			function getMaxValue(dataset) {
				var result = 0;
				for(var index in dataset) {
					if(dataset[index].value > result) {
						result = dataset[index].value;
					}

				return result;
				}
			}

			var margin = {top:20,right:20,bottom:100,left:70},
				width = 550-margin.left-margin.right,
				height = (450)-margin.top-margin.bottom;

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

			var tip = d3.tip()
  						.attr('class', 'd3-tip')
  						.offset([-10, 0])
  						.html(function(d) {
    						return "<strong>Frequency:</strong> <span style='color:red'>" + d.value + "</span>";
  						})

			var svg = d3.select(container)
						.append('svg')
						.attr("width",width+margin.left+margin.right)
						.attr("height",height+margin.top+margin.bottom)
						.append('g')
						.attr("transform","translate("+margin.left+","+margin.top+")");

			svg.call(tip);
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
    			d3.select("input").property("checked", false).each(change);
  			}, 30);

  			function change() {
  				clearTimeout(sortTimeout);

  				var x0 = x.domain(dataset.sort(this.checked
  					? function(a,b){return b.value - a.value;}
  					: function(a,b){return d3.ascending(a.key,b.key);})
  					.map(function(d){return d.key;}))
  					.copy();

  				svg.selectAll(".bar")
  					.sort(function (a,b){return x0(a.key)-x0(b.key);});

  				var transition = svg.transition().duration(30),
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
   		},//end of renderModalGraph

   		//render miniLine Graph
   		renderMiniLineGraph : function(dataset,container,index) {
   			function getMaxValue(dataset) {
				var result = 0;
				for(var index in dataset) {
					if(dataset[index].value > result) {
						result = dataset[index].value;
					}
				}
				return result;
			};
   			var width = (dataset.length*6)+((dataset.length-1)*2);
   			var height = (width*9)/16;

   			var xScale = d3.scale.ordinal().rangePoints([0,width]).domain(dataset.map(function(d){return d.key;}));
   			var yScale = d3.scale.linear().range([height,0]).domain([0,getMaxValue(dataset)]);

   			var svg = d3.select(container)
   						.append("button")
   						.attr("ng-click","openModalLineGraph("+index+")")
   						.append("svg")
   						.attr("width",width)
   						.attr("height",height);
   			var line = d3.svg.line()
   							.interpolate("monotone")
   							.x(function(d){return xScale(d.key);})
   							.y(function(d){return yScale(d.value);});

   			svg.append("path")
   				.datum(dataset)
   				.attr("class","xline")
   				.attr("d",line);

   		},//end of renderMiniLineGraph

   		renderModalLineGraph : function(dataset,container) {
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
				width = 550-margin.left-margin.right,
				height = (500)-margin.top-margin.bottom;

			var xScale = d3.scale.ordinal().rangePoints([0,width]).domain(dataset.map(function(d){return d.key;}));
   			var yScale = d3.scale.linear().range([height,0]).domain([0,getMaxValue(dataset)]);

   			var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient("bottom");
			var yAxis = d3.svg.axis()
						.scale(yScale)
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
				.attr("dx","0.15em")
				.attr("dy","0.15em")
				.attr("transform",function(d){
					return "rotate(-60)"
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

			var line = d3.svg.line()
							.interpolate("monotone")
   							.x(function(d){return xScale(d.key);})
   							.y(function(d){return yScale(d.value);});

   			svg.append("path")
   				.datum(dataset)
   				.attr("class","xline")
   				.attr("d",line);
   		},//end of render ModalLineGraph

   		renderMiniAreaGraph : function(dataset,container,index) {
   			function getMaxValue(dataset) {
				var result = 0;
				for(var index in dataset) {
					if(dataset[index].value > result) {
						result = dataset[index].value;
					}
				}
				return result;
			};
   			var width = (dataset.length*6)+((dataset.length-1)*2);
   			var height = (width*9)/16;

   			var xScale = d3.scale.ordinal().rangePoints([0,width]).domain(dataset.map(function(d){return d.key;}));
   			var yScale = d3.scale.linear().range([height,0]).domain([0,getMaxValue(dataset)]);

   			var svg = d3.select(container)
   						.append("button")
   						.attr("ng-click","openModalAreaGraph("+index+")")
   						.append("svg")
   						.attr("width",width)
   						.attr("height",height);
   			var area = d3.svg.area()
   							.x(function(d){return xScale(d.key);})
   							.y0(height)
   							.y1(function(d){return yScale(d.value);});

   			svg.append("path")
   				.datum(dataset)
   				.attr("class","xarea")
   				.attr("d",area);
   		},//end of render MiniAreaGraph

   		renderModalAreaGraph : function(dataset,container) {
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
				width = 550-margin.left-margin.right,
				height = (500)-margin.top-margin.bottom;

			var xScale = d3.scale.ordinal().rangePoints([0,width]).domain(dataset.map(function(d){return d.key;}));
   			var yScale = d3.scale.linear().range([height,0]).domain([0,getMaxValue(dataset)]);

   			var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient("bottom");
			var yAxis = d3.svg.axis()
						.scale(yScale)
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
				.attr("dx","0.15em")
				.attr("dy","0.15em")
				.attr("transform",function(d){
					return "rotate(-60)"
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

			var area = d3.svg.area()
   							.x(function(d){return xScale(d.key);})
   							.y0(height)
   							.y1(function(d){return yScale(d.value);});

   			svg.append("path")
   				.datum(dataset)
   				.attr("class","xarea")
   				.attr("d",area);
   			}, //end of render modal area graph

   			renderMiniPieGraph : function(dataset,container,index) {
   				var width = (dataset.length*6)+((dataset.length-1)*2);
   				var height = (width*9)/16;
   				var radius = Math.min(width, height) / 2;
   				var donutWidth = 10;

   				var color = d3.scale.category20b();

   				var svg = d3.select(container)
   							.append("button")
   							.attr("ng-click","openModalPieGraph("+index+")")
  							.append('svg')
  							.attr('width', width)
						  	.attr('height', height)
						  	.append('g')
						  	.attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

				var arc = d3.svg.arc()
								.innerRadius(radius - donutWidth)
  								.outerRadius(radius);
  				var pie = d3.layout.pie()
  									.value(function(d) { return d.value; })
  									.sort(null);
  				var path = svg.selectAll('path')
  								.data(pie(dataset))
  								.enter()
  								.append('path')
  								.attr('d', arc)
  								.attr('fill', function(d, i) { 
    								return color(d.value);
  								});

   			},//end of render mini pie graph

   			renderModalPieGraph : function(dataset,container) {
   				var margin = {top:20,right:20,bottom:100,left:70},
				width = 550-margin.left-margin.right,
				height = (500)-margin.top-margin.bottom;

				var legendRectSize = 18;
				var legendSpacing = 4;

				var radius = Math.min(width, height) / 2;
   				var donutWidth = 50;

   				var color = d3.scale.category20b();

   				var svg = d3.select(container)
  							.append('svg')
  							.attr('width', width)
						  	.attr('height', height)
						  	.append('g')
						  	.attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

				var arc = d3.svg.arc()
								.innerRadius(radius - donutWidth)
  								.outerRadius(radius);
  				var pie = d3.layout.pie()
  									.value(function(d) { return d.value; })
  									.sort(null);

  				var tooltip = d3.select(container)                               
          						.append('div')                                                
          						.attr('class', 'tooltip');                                    
                      
        		tooltip.append('div')                                           
          				.attr('class', 'label');                                      
             
        		tooltip.append('div')                                           
          				.attr('class', 'count');                                      

        		tooltip.append('div')                                          
          				.attr('class', 'percent');

  				var path = svg.selectAll('path')
  								.data(pie(dataset))
  								.enter()
  								.append('path')
  								.attr('d', arc)
  								.attr('fill', function(d, i) { 
    								return color(d.value);
  								})
  								.each(function(d){this._current = d;});

  				path.on('mouseover', function(d) {                            
            		var total = d3.sum(dataset.map(function(d) {                
              			return d.value;                                           
            		}));                                                        
            		var percent = Math.round(1000 * d.value / total) / 10; 
            		tooltip.select('.label').html(d.key);                
            		tooltip.select('.count').html(d.value);                
            		tooltip.select('.percent').html(percent + '%');             
            		tooltip.style('display', 'block');                          
         		});                                                           
          
          		path.on('mouseout', function() {                              
            		tooltip.style('display', 'none');                        
          		});

  				var legend = svg.selectAll('.legend')
								  	.data(color.domain())
								  	.enter()
								  	.append('g')
								  	.attr('class', 'legend')
								 	.attr('transform', function(d, i) {
										var height = legendRectSize + legendSpacing;
									    var offset =  height * color.domain().length / 2;
									    var horz = -2 * legendRectSize;
									    var vert = i * height - offset;
									    return 'translate(' + horz + ',' + vert + ')';
  									});

  				legend.append('rect')
  						.attr('width', legendRectSize)
  						.attr('height', legendRectSize)
  						.style('fill', color)
  						.style('stroke', color)

  				legend.append('text')
  						.attr('x', legendRectSize + legendSpacing)
  						.attr('y', legendRectSize - legendSpacing)
  						.text(function(d) { return d.key; });
   			}
   }//end of return object
});
