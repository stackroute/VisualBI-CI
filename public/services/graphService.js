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
			//Create SVG element
			var svg = d3.select(container)
						.append("div")
						.attr("ng-click", "openModalBarGraph("+index+")")
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
						return h - yScale(d.value);
   				})
   				.attr("width", xScale.rangeBand())
   				.attr("height", function(d) {
						return yScale(d.value);
   				})
   				.attr("fill", function(d) {
						return "rgb(0, 0, " + (d.value * 10) + ")";
					});
   		},//End of render Mini Graph

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
						.rangeRoundBands([0,width],0.1,0.3)
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
				.style("text-anchor","end");

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
							.attr("dx","-0.5em")
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
   						.append("div")
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
				.style("text-anchor","end");
				// .text("to be replaced!!!! Ge units from data");

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
   						.append("div")
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
				.style("text-anchor","end");

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
   							.append("div")
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
   				var svg = d3.select(container)
   					.append("svg");
   				var temp = svg.append("g")
   					.attr("id","Piecanvas");

   				temp.append("g").attr("id","PieArt");
   				temp.append("g").attr("id","PieLabels");

   				var canvas = d3.select("#Piecanvas");
   				var art = d3.select("#PieArt");
   				var labels = d3.select("#PieLabels");

   				var jhw_pie = d3.layout.pie()
   								.value(function(d,i){
   									return d.value;
   								});
   				//Chart dimensions
   				var cDim = {
   					height : 500,
   					width : 500,
   					innerRadius : 50,
   					outerRadius : 120,
   					labelRadius : 150
   				};

   				svg.attr({
   					height : cDim.height,
   					width : cDim.width
   				});

   				canvas.attr("transform","translate("+(cDim.width/2)+","+(cDim.height/2)+")");

   				var pied_data = jhw_pie(dataset);

   				var pied_arc = d3.svg.arc()
   									.innerRadius(50)
   									.outerRadius(150);

   				var pied_colors = d3.scale.category20();

   				var enteringArcs = art.selectAll(".wedge").data(pied_data).enter();

   				enteringArcs.append("path")
   							.attr("class","wedge")
   							.attr("d",pied_arc)
   							.style("fill",function(d,i){
   								return pied_colors(i);
   							});

   				var enteringLabels = labels.selectAll(".label").data(pied_data).enter();
   				var labelGroups = enteringLabels.append("g").attr("class","label");
   				labelGroups.append("circle")
   							.attr({
   								x : 0,
   								y : 0,
   								r : 2,
   								fill : "#000",
   								transform : function(d,i){
   									var centroid = pied_arc.centroid(d);
   									return "translate("+pied_arc.centroid(d)+")";
   								},
   								"class": "label-cricle"
   							});

   				var textLines = labelGroups.append("line")
   											.attr({
   												x1 : function(d,i){
   													return pied_arc.centroid(d)[0];
   												},
   												y1 : function(d,i) {
   													return pied_arc.centroid(d)[1];
   												},
   												x2 : function(d,i){
   													var centroid = pied_arc.centroid(d);
   													var midAngle = Math.atan2(centroid[1],centroid[0]);
   													var x = Math.cos(midAngle)*cDim.labelRadius;
   													return x;
   												},
   												y2 : function(d,i) {
   													var centroid = pied_arc.centroid(d);
   													var midAngle = Math.atan2(centroid[1],centroid[0]);
   													var y = Math.sin(midAngle)*cDim.labelRadius;
   													return y;
   												},
   												"class": "label-line"
   											});
   				var textLabels = labelGroups.append("text")
   											.attr({
   												x : function(d,i) {
   													var centroid = pied_arc.centroid(d);
   													var midAngle = Math.atan2(centroid[1],centroid[0]);
   													var x = Math.cos(midAngle)*cDim.labelRadius;
   													var sign = (x>0) ? 1 : -1;
   													var labelX = x+ (5*sign);
   													return labelX;
   												},
   												y : function(d,i) {
   													var centroid = pied_arc.centroid(d);
   													var midAngle = Math.atan2(centroid[1],centroid[0]);
   													var y = Math.sin(midAngle)*cDim.labelRadius;
   													return y;
   												},

   												'text-anchor': function (d, i) {
        											var centroid = pied_arc.centroid(d);
        											var midAngle = Math.atan2(centroid[1], centroid[0]);
        											var x = Math.cos(midAngle) * cDim.labelRadius;
        											return (x > 0) ? "start" : "end";
        										},
        										"class" : "label-text"
   											}).text(function(d){
   												return d.data.key;
   											});

   				var alpha = 0.5;
   				var spacing = 12;

   				function relax() {
   					var again = false;
   					textLabels.each(function(d,i){
   						var a = this;
   						var da = d3.select(a);
   						var y1 = da.attr("y");
   						textLabels.each(function(d,i){
   							var b = this;
   							if(a==b) return;
   							var db = d3.select(b);

   							if(da.attr("text-anchor") != db.attr("text-anchor")) return;

   							var y2 = db.attr("y");
   							var deltaY = y1-y2;

   							if(Math.abs(deltaY) > spacing) return;

   							again = true;
   							var sign = deltaY > 0 ? 1: -1;
   							var adjust = sign * alpha;
   							da.attr("y",+y1+adjust);
   							db.attr("y",+y2-adjust);
   						});
   					});

   					if(again) {
   						var labelElements = textLabels[0];
   						textLines.attr("y2",function(d,i){
   							var labelForLine = d3.select(labelElements[i]);
   							return labelForLine.attr("y");
   						});
   						setTimeout(relax,20);
   					}
   				}
				relax();
   			}
   }//end of return object
});
