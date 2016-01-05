/**************************		Necessary Imports	****************************************/
// var d3 = require('./d3.js');

/************************		Get Required Data for the Plots	****************************/

/******************************  Get maxValue from the Data Set  *****************************************/
function getMaxValue(dataObj) {
	var result = 0;
	for(var key in dataObj) {
		if(dataObj.hasOwnProperty(key)) {
			if(dataObj[key] > result) {
				result = dataObj[key];
			}
		}
	}

	return result;
}

/*************************		Get Container Width,Height, Margins, Padding	****************************/
function getDimensions(isModal) {
	var dimensionsObj = {};
	if(isModal) {
		dimensionsObj.svgWidth = 600;
		dimensionsObj.svgHeight = 330;
		dimensionsObj.margins = {
			top : 30,
			bottom : 30,
			right : 30,
			left : 30
		};
		barSpacing = 5; 
	}

	else {
		dimensionsObj.svgWidth = 250;
		dimensionsObj.svgHeight = 140;
		dimensionsObj.margins = {
			top : 10,
			bottom : 10,
			right : 10,
			left : 10
		}
		barSpacing = 2;
	}

	return dimensionsObj;
}

/*********************************** Render the Chart   ***************************************/
function renderChart(isModal,dataObj,chartContainer) {
	
	if(!isModal) {				//to be displayed in modal window (enlarged Graph)
		var dimensionsObj = getDimensions(false);

		//Define actual drawing area
		var maxWidth = dimensionsObj.svgWidth - dimensionsObj.margins.left - dimensionsObj.margins.right;
		var maxHeight = dimensionsObj.svgHeight - dimensionsObj.margins.top - dimensionsObj.margins.bottom;

		//Conversion Functions
		var convert = {
			x : d3.scale.ordinal(),
			y : d3.scale.linear()
		};

		//Define Axes
		var axis = {
			x : d3.svg.axis().orient('bottom'),
			y : d3.svg.axis().orient('left')
		};

		axis.x.scale(convert.x);
		axis.y.scale(convert.y);

		//Setup Domain and Range
		convert.y.range([maxHeight,0]);
		convert.x.rangeRoundBands([0,maxWidth]);

		convert.x.domain(dataObj.map(function(d){
			return d.key;    //<-------------------Set the corresponding name after getting the acutal dataObj
		}));
		convert.y.domain([0,getMaxValue(dataObj)]);

		//Set up the SVG container
		var svg = d3.select(chartContainer).append('svg') //<------- Change the chartContainer based on the name of the cell
						.attr('width',dimensionsObj.svgWidth)
						.attr('height',dimensionsObj.svgHeight);

		//Group Node to hold all other nodes
		var chart = svg.append('g')
						.attr('transform', function(d,i){return 'translate('+dimensionsObj.margins.left+','+dimensionsObj.margins.top+')';});

		//Drawing the Axes
		chart.append('g')
				.attr('class', 'xAxis')
				.attr('transform', 'translate(0,'+maxHeight+')')
				.call(axis.x);
		chart.append('g')
				.attr('class','yAxis')
				.attr('height',maxHeight)
				.call(axis.y);

		//Drawing the bars
		var bars = chart
					.selectAll('g.bar-group')
					.data(dataObj)
					.enter()
					.append('g')      //Container for each bar
					.attr('transform', function(d,i){return 'translate ('+convert.x(d.key)+',0)';})
					.attr('class', 'bar-group');

		bars.append('rect')
				.attr('y',maxHeight)
				.attr('height',0)
				.attr('width', function(d){return convert.x.rangeBand(d)-1;})
				.attr('class', 'bar')
				.transition()
				.duration(500)
				.attr('y',function(d,i){return convert.y(d.value)})
				.attr('height', function(d,i){return maxHeight-convert.y(d.value);});

	}//end of modal window function

	else {						//to be displayed inside the table(thumbnail version)

	}
}


// module.exports = {
// 	renderChart = renderChart
// }