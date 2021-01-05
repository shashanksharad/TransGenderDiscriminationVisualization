
/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.
  var width = 600;
  var height = 520;
  var margin = { top: 150, left: 40, bottom: 40, right: 10 };

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;

  // Sizing for the grid visualization
  var squareSize = 6;
  var squarePad = 2;
  var numPerRow = width / (squareSize + squarePad);

  // main svg used for visualization
  var svg = null;

  // d3 selection that will be used
  // for displaying visualizations
  var g = null;

  // We will set the domain when the
  // data is processed.
  // @v4 using new scale names
  var xBarScale = d3.scaleLinear()
    .range([0, width]);

  // The bar chart display is horizontal
  // so we can use an ordinal scale
  // to get width and y locations.
  // @v4 using new scale type
  var yBarScale = d3.scaleBand()
    .paddingInner(0.08)
    .domain([0, 1, 2, 3, 4, 5])
    .range([0, height - 50], 0.1, 0.1, 0.1, 0.1, 0.1);

  // Color is determined just by the index of the bars
  var barColors = { 0: '#008080', 1: '#399785', 2: '#5AAF8C' , 3:'red', 4:'black', 5:'yellow'};


  var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

    

var x1 = d3.scaleBand();

var y = d3.scaleLinear()
    .range([height, 0]);


// var xAxisgrpbar = d3.axisBottom(x0)




// var yAxisgrpbar = d3.axisLeft(y);

  // The histogram display shows the
  // first 30 minutes of data
  // so the range goes from 0 to 30
  // @v4 using new scale name
  var xHistScale = d3.scaleLinear()
    .domain([0, 30])
    .range([0, width - 20]);

  // @v4 using new scale name
  var yHistScale = d3.scaleLinear()
    .range([height, 0]);

  // The color translation uses this
  // scale to convert the progress
  // through the section into a
  // color value.
  // @v4 using new scale name
  var coughColorScale = d3.scaleLinear()
    .domain([0, 1.0])
    .range(['#008080', 'red']);

  // You could probably get fancy and
  // use just one axis, modifying the
  // scale, but I will use two separate
  // ones to keep things easy.
  // @v4 using new axis name
  var xAxisBar = d3.axisBottom()
    .scale(xBarScale);

  // @v4 using new axis name
  // var xAxisHist = d3.axisBottom()
  //   .scale(xHistScale)
  //   .tickFormat(function (d) { return d + ' min'; });

  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];
  // If a section has an update function
  // then it is called while scrolling
  // through the section with the current
  // progress through the section.
  var updateFunctions = [];

  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function (selection) {
    selection.each(function (rawData) {
      // create svg and give it a width and height
      svg = d3.select(this).selectAll('svg').data([wordData]);
      var svgE = svg.enter().append('svg');
      // @v4 use merge to combine enter and existing selection
      svg = svg.merge(svgE);

      svg.attr('width', width + margin.left + margin.right);
      svg.attr('height', height + margin.top + margin.bottom);

      svg.append('g');


      // this group element will be used to contain all
      // other elements.
      g = svg.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // perform some preprocessing on raw data
      var wordData = getWords(rawData);
      console.log(wordData)
      // filter to just include filler words
      var fillerWords = getFillerWords(wordData);

      // get the counts of filler words for the
      // bar chart display
      var fillerCounts = groupByWord(fillerWords);
      console.log(fillerCounts)
      // set the bar scale's domain
      var countMax = d3.max(fillerCounts, function (d) { return d.value;});
      xBarScale.domain([0, 100]);

      // get aggregated histogram data

      var histData = getHistogram(fillerWords);
      // set histogram's domain
      var histMax = d3.max(histData, function (d) { return d.length; });
      yHistScale.domain([0, histMax]);

      setupVis(wordData, fillerCounts, histData);

      setupSections();
    });
  };


  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   *
   * @param wordData - data object for each word.
   * @param fillerCounts - nested data that includes
   *  element for each filler word type.
   * @param histData - binned histogram data
   */
  var setupVis = function (wordData, fillerCounts, histData) {
    // axis
    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxisBar);
    g.select('.x.axis').style('opacity', 0);

    // count openvis title
    g.append('text')
      .attr('class', 'sub-title openvis-title')
      .attr('x', width / 2)
      .attr('y', height / 3)
      

    g.append('text')
      .attr('class', 'sub-title openvis-title')
      .attr('x', width / 2)
      .attr('y', (height / 3) + (height / 5))
      

    g.selectAll('.openvis-title')
      .attr('opacity', 0);

var color_ = d3.scaleThreshold()
    .domain([0, 20, 40, 45, 50, 55, 60, 65, 70, 80])
    .range(["rgba(247,251,255, 0)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);
      




var projection = d3.geoMercator()
                   .scale(100)
                   .translate( [width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

// svg.call(tip);

queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "https://raw.githubusercontent.com/shashanksharad/TransgenderDiscrimination/main/country_wise_support_clpd.csv")
    .await(ready);

function ready(error, data, population) {
  var populationById = {};

  population.forEach(function(d) { populationById[d.code] = +d.support; });
  console.log(populationById)
  data.features.forEach(function(d) { d.support = populationById[d.id] });
  console.log(data)


var countries = g.selectAll(".countries").data(data.features)

var countries_e = countries.enter()
.append('path')
.attr("class", "countries");
    
  countries = countries.merge(countries_e)
    .attr("d", path)
    .style("fill", function(d) { if (populationById[d.id]) {return color_(populationById[d.id])} else {return "rgb(240,240,240)"}; })
    .style('stroke', 'white')
    .style('stroke-width', 1.5)
    .style("opacity", 0)


}


      g.append('text')
      .attr('class', 'title count-title2 highlight')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text('70%')
      .style("font-size", "100px");

    g.append('text')
      .attr('class', 'sub-title count-title2')
      .attr('x', width / 2)
      .attr('y', (height / 3) + (height / 5))
      .text('respondents support gender affirming surgery for transgenders')
      .style("font-size", "22px");

    g.selectAll('.count-title2')
      .attr('opacity', 0);

 
      
    
//     // console.log(dataset)


                

var nodes = [];



function bubbleChart() {
  // Constants for sizing


  // tooltip for mouseover functionality


  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  // var nodes = [];

  // Charge function that is called for each node.
  // As part of the ManyBody force.
  // This is what creates the repulsion between nodes.
  //
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  //
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  //
  // Charge is negative because we want nodes to repel.
  // @v4 Before the charge was a stand-alone attribute
  //  of the force layout. Now we can use it as a separate force!



  // Nice looking colors - no reason to buck the trend
  // @v4 scales now have a flattened naming scheme
  var fillColor = d3.scaleOrdinal()
    .domain(['School', 'Healthcare', 'Employment', 'Housing', 'Public Accommodation', 'ID Documentation', 'Family Acceptance', 'Civic Participation'])
    .range(d3.schemeCategory10);

  


  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */
  function createNodes(rawData) {
    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number.
    var maxAmount = d3.max(rawData, function (d) { return +d.Percentage; });
  
    // Sizes bubbles based on area.
    // @v4: new flattened scale names.
    var radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([2, 85])
      .domain([0, maxAmount]);
  
    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    var myNodes = rawData.map(function (d) {
      return {
        id: d.ID,
        radius: radiusScale(+d.Percentage*0.37),
        value: +d.Percentage,
        name: d.Issue,
        org: d.Category,
        group: d.Category,
        year: d.Percentage,
        x: Math.random() * (width),
        y: Math.random() * (height)
      };
    });
  
    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.value - a.value; });
  
    return myNodes;
  }

  
  
  var chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; })
 

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    //  enter selection to apply our transtition to below.
    var bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      // .attr('fill', function (d) { return fillColor(d.group); })
      .attr('fill', function (d) {return fillColor(d.group);})
      // .attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
      .attr('stroke-width', 2)
      .attr('opacity', 0)


      
      

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);


  };


  chart.toggleDisplay = function (displayName) {
    if (displayName === 'year') {
      splitBubbles();
    } else {
      groupBubbles();
    }
  };


  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = bubbleChart();

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(error, data) {
  if (error) {
    console.log(error);
  }

  myBubbleChart('g', data);
}



// Load the data.
// d3.csv('https://raw.githubusercontent.com/vlandham/bubble_chart_v4/master/data/gates_money.csv', display);
d3.csv('https://raw.githubusercontent.com/shashanksharad/TransgenderDiscrimination/main/TransDiscriminationData.csv', display)


///////////////////////////////////////////////////////////////////////////////



// Parse the Data
d3.csv("https://raw.githubusercontent.com/shashanksharad/TransgenderDiscrimination/main/age_distr.csv", function(data) {

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.group)}).keys()
// console.log(groups)
  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr('class', 'xaxisgrpbr')
    .attr('opacity', 0)
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 55])
    .range([ height, 0 ]);
  g.append("g")
  .attr('class', 'yaxisgrpbr')
  .attr('opacity', 0)
    .call(d3.axisLeft(y));
  // 

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#0065a2','#00b0ba'])





  // Show the bars
 
    // Enter in data = loop group per group
    g.append("g")
    .attr('class', 'allgrpbars')
    .attr('opacity', 0)
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
    .attr('class', 'grpbar')
    
      .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
       .attr("y", function(d){
        return y(0)})
        .attr("height", 0)
        .attr("width", xSubgroup.bandwidth())
        .attr("fill", function(d) { return color(d.key); });
        
      


})



// ////////////////////////////////////////////////////////////////////////////

// Parse the Data
d3.csv("https://raw.githubusercontent.com/shashanksharad/TransgenderDiscrimination/main/wage_diff.csv", function(data) {

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.group)}).keys()
// console.log(groups)
  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr('class', 'xaxisgrpbrwage')
    .attr('opacity', 0)
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 40])
    .range([ height, 0 ]);
  g.append("g")
  .attr('class', 'yaxisgrpbrwage')
  .attr('opacity', 0)
    .call(d3.axisLeft(y));
  // 

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#0065a2','#00b0ba'])





  // Show the bars
 
    // Enter in data = loop group per group
    g.append("g")
    .attr('class', 'allgrpbarswage')
    .attr('opacity', 0)
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
    .attr('class', 'grpbarwage')
    
      .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
       .attr("y", function(d){
        return y(0)})
        .attr("height", 0)
        .attr("width", xSubgroup.bandwidth())
        .attr("fill", function(d) { return color(d.key); });
        
      


})
////////////////////////////////////////////////////////

// Parse the Data
d3.csv("https://raw.githubusercontent.com/shashanksharad/TransgenderDiscrimination/main/income_genderid.csv", function(data) {

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.group)}).keys()
// console.log(groups)
  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr('class', 'xaxisgrpbrwagegid')
    .attr('opacity', 0)
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 40])
    .range([ height, 0 ]);
  g.append("g")
  .attr('class', 'yaxisgrpbrwagegid')
  .attr('opacity', 0)
    .call(d3.axisLeft(y));
  // 

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e74c3c', '#f4d03f','#0065a2','#00b0ba'])





  // Show the bars
 
    // Enter in data = loop group per group
    g.append("g")
    .attr('class', 'allgrpbarswagegid')
    .attr('opacity', 0)
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
    .attr('class', 'grpbarwagegid')
    
      .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
       .attr("y", function(d){
        return y(0)})
        .attr("height", 0)
        .attr("width", xSubgroup.bandwidth())
        .attr("fill", function(d) { return color(d.key); });
        
      


})
////////////////////////////////////////////////////////

dataset =[
  {
    name: "Lack of Legal Protection",
    title: "Lack of Legal Protection",
    color: "#2E86C1",
    value: 100,
  },
  {
    name: "Poverty",
    title: "Poverty",
    color: "#229954",
    value: 29,
  },
  {
    name: "Stigma, Harassment & Discrimination",
    title: "Stigma, Harassment & Discrimination",
    color: "#AAB7B8",
    value: 100,
  },
   
  { name: "Violence", title: "Violence",color: "#E74C3C", value: 54 },
  { name: "Poor Health Coverage", title: "Poor Health Coverage",color: "#F4D03F", value: 22 },
  { name: "Inaccurate ID Documents", title: "Inaccurate ID Documents",color: "#884EA0", value: 50 },
  
];

    var bars = g.selectAll('.bar').data(dataset);
    var barsE = bars.enter()
      .append('rect')
      .attr('class', 'bar');
    bars = bars.merge(barsE)
      .attr('x', 0)
      .attr('y', function (d, i) { return yBarScale(i);})
      .attr('fill', function (d, i) { return d3.schemeCategory10[i]; })
      .attr('width', 0)
      .attr('height', yBarScale.bandwidth());

    var barText = g.selectAll('.bar-text').data(dataset);
    barText.enter()
      .append('text')
      .attr('class', 'bar-text')
      .text(function (d) { return d.title+' ('+d.value+'%)'; })
      .attr('x', 0)
      .attr('dx', 5)
      .attr('y', function (d, i) { return yBarScale(i);})
      .attr('dy', yBarScale.bandwidth() / 2)
      .style('font-size', '12px')
      .style('text-anchor', 'right')
      .attr('fill', 'white')
      .attr('opacity', 0);

//       ////////////////////////////////////////////////////////////////////////////////////////////////


var data = [ {name: "White: 76%", value: 76},
			{name: "Black: 5%", value:  5},
			{name: "Asian: 2%", value:  2},
			{name: "American Indian: 1%", value:  1},
      {name: "latina/o: 5%", value:  5} ,
    {name: "Multiracial: 11%", value: 11}];

// var margin = {top: 20, right: 20, bottom: 20, left: 20};
// 	width = 400 - margin.left - margin.right;
// 	height = width - margin.top - margin.bottom;



// var g = d3.select("g")
// .attr("transform", "translate(" + ((width/2)+margin.left) + "," + ((height/2)+margin.top) + ")");

console.log(width);
var radius = Math.min(width, height) / 2;

var color_donut = d3.scaleOrdinal().range(d3.schemeDark2);

var arc = d3.arc()
  .innerRadius(radius * 0.4)         // This is the size of the donut hole
  .outerRadius(radius * 0.7);
  
console.log(arc.centroid)   
var outerArc = d3.arc()
  .innerRadius(radius * 0.75)
  .outerRadius(radius * 0.75);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.value; });


var arcs = g.selectAll(".arc")
  .data(pie(data));
  
var arcse = arcs.enter().append("path")
  .attr("class", "arc");

arcs = arcs.merge(arcse)
  .style("fill", function(d) { return color_donut(d.data.name); })
  .attr("stroke", "white")
  .attr("stroke-width", 6)
  .attr('opacity', 0);
  arcse.attr("transform", "translate(" + ((width/2)) + "," + ((height/2)) + ")");
  

  
  // Add the polylines between chart and labels:
	var dc_polylines = g.selectAll('.dc_poly').data(pie(data));
  
  var dc_polylinese = dc_polylines.enter()
  	.append('polyline')
    .attr('class','dc_poly');
  
  dc_polylines = dc_polylines.merge(dc_polylinese)
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 2)
    .attr('points', function(d) {
      var posA = arc.centroid(d) // line insertion in the slice
      var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 ;// we need the angle to see if the X position will be at the extreme right or extreme left
      console.log(midangle)
      posC[0] = radius * 0.75 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })
    .attr('opacity', 0);
    dc_polylinese.attr("transform", "translate(" + ((width/2)) + "," + ((height/2)) + ")");

// Add the polylines between chart and labels:
  var dc_labels = g.selectAll('.dc_lbls').data(pie(data));
  
  var dc_labelse = dc_labels.enter()
  .append('text')
  .text( function(d) { console.log(d.data.name) ; return d.data.name } )
  .style("font-size", "12px")
  .attr('class', 'dc_lbls');

  // dc_labelse.attr("transform", "translate(" + ((width/2)) + "," + ((height/2)) + ")");

  dc_labels = dc_labels.merge(dc_labelse)
    .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.79 * (midangle < Math.PI ? 1 : -1)+width/2;
        pos[1] = pos[1]+height/2;
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function(d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })
    .attr('opacity', 0);

//////////////////////////////////////////////////////////////////////////////////////////////////////

var data2 = [ {name: "one", value: 850},
{name: "two", value:  550},
{name: "three", value:  600},
{name: "four", value:  300},
{name: "five", value:  150} ];

// var margin = {top: 20, right: 20, bottom: 20, left: 20};
// 	width = 400 - margin.left - margin.right;
// 	height = width - margin.top - margin.bottom;



// var g = d3.select("g")
// .attr("transform", "translate(" + ((width/2)+margin.left) + "," + ((height/2)+margin.top) + ")");

console.log(width);
var radius = Math.min(width, height) / 2;

var color_donut = d3.scaleOrdinal().range(d3.schemeDark2);

var arc = d3.arc()
.innerRadius(radius * 0.4)         // This is the size of the donut hole
.outerRadius(radius * 0.7);

console.log(arc.centroid)   
var outerArc = d3.arc()
.innerRadius(radius * 0.75)
.outerRadius(radius * 0.75);

var pie = d3.pie()
.sort(null)
.value(function(d) { return d.value; });


var arcs = g.selectAll(".arc_")
.data(pie(data2));

var arcse = arcs.enter().append("path")
.attr("class", "arc_");

arcs = arcs.merge(arcse)
.style("fill", function(d) { return color_donut(d.data.name); })
.attr("stroke", "white")
.attr("stroke-width", 6)
.attr('opacity', 0);
arcse.attr("transform", "translate(" + ((width/2)) + "," + ((height/2)) + ")");



// Add the polylines between chart and labels:
var dc_polylines = g.selectAll('.dc_poly_').data(pie(data2));

var dc_polylinese = dc_polylines.enter()
.append('polyline')
.attr('class','dc_poly_');

dc_polylines = dc_polylines.merge(dc_polylinese)
.attr("stroke", "black")
.style("fill", "none")
.attr("stroke-width", 1)
.attr('points', function(d) {
var posA = arc.centroid(d) // line insertion in the slice
var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
var posC = outerArc.centroid(d); // Label position = almost the same as posB
var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 ;// we need the angle to see if the X position will be at the extreme right or extreme left
console.log(midangle)
posC[0] = radius * 0.75 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
return [posA, posB, posC]
})
.attr('opacity', 0);
dc_polylinese.attr("transform", "translate(" + ((width/2)) + "," + ((height/2)) + ")");

// Add the polylines between chart and labels:
var dc_labels = g.selectAll('.dc_lbls_').data(pie(data2));

var dc_labelse = dc_labels.enter()
.append('text')
.text( function(d) { console.log(d.data.name) ; return d.data.name } )
.attr('class', 'dc_lbls_');

// dc_labelse.attr("transform", "translate(" + ((width/2)) + "," + ((height/2)) + ")");

dc_labels = dc_labels.merge(dc_labelse)
.attr('transform', function(d) {
  var pos = outerArc.centroid(d);
  var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
  pos[0] = radius * 0.79 * (midangle < Math.PI ? 1 : -1)+width/2;
  pos[1] = pos[1]+height/2;
  return 'translate(' + pos + ')';
})
.style('text-anchor', function(d) {
  var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
  return (midangle < Math.PI ? 'start' : 'end')
})
.attr('opacity', 0); 

    


// /////////////////////////////////////////////////

var data3 = [ {name: "Full Time Employed", value: 46},
{name: "Part Time Employed", value:  16},
{name: "Multiple Jobs", value:  8},
{name: "Self Employed/Busines", value:  8},
{name: "Self Employed/Contract", value:  4},
{name: "Unemployed (looking)", value:  11},
{name: "Unemployed (not looking)", value:  3},
{name: "Disability", value:  8},
{name: "Student", value:  20} ,
{name: "Retired", value:  7},
{name: "Homemaker", value:  2},
{name: "Other", value:  7} 
 ];

// var margin = {top: 20, right: 20, bottom: 20, left: 20};
// 	width = 400 - margin.left - margin.right;
// 	height = width - margin.top - margin.bottom;



// var g = d3.select("g")
// .attr("transform", "translate(" + ((width/2)+margin.left) + "," + ((height/2)+margin.top) + ")");

console.log(width);
var radius = Math.min(width, height) / 2;

var color_donut = d3.scaleOrdinal().range(d3.schemeCategory20);

var arc = d3.arc()
.innerRadius(radius * 0.4)         // This is the size of the donut hole
.outerRadius(radius * 0.7);

console.log(arc.centroid)   
var outerArc = d3.arc()
.innerRadius(radius * 0.75)
.outerRadius(radius * 0.75);

var pie = d3.pie()
.sort(null)
.value(function(d) { return d.value; });


var arcs = g.selectAll(".arc__")
.data(pie(data3));

var arcse = arcs.enter().append("path")
.attr("class", "arc__");

arcs = arcs.merge(arcse)
.style("fill", function(d) { return color_donut(d.data.name); })
.attr("stroke", "white")
.attr("stroke-width", 6)
.attr('opacity', 0);
arcse.attr("transform", "translate(" + ((width/2)) + "," + ((height/2)) + ")");



// Add the polylines between chart and labels:
var dc_polylines = g.selectAll('.dc_poly__').data(pie(data3));

var dc_polylinese = dc_polylines.enter()
.append('polyline')
.attr('class','dc_poly__');

dc_polylines = dc_polylines.merge(dc_polylinese)
.attr("stroke", "black")
.style("fill", "none")
.attr("stroke-width", 1)
.attr('points', function(d) {
var posA = arc.centroid(d) // line insertion in the slice
var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
var posC = outerArc.centroid(d); // Label position = almost the same as posB
var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 ;// we need the angle to see if the X position will be at the extreme right or extreme left
console.log(midangle)
posC[0] = radius * 0.75 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
return [posA, posB, posC]
})
.attr('opacity', 0);
dc_polylinese.attr("transform", "translate(" + ((width/2)) + "," + ((height/2)) + ")");

// Add the polylines between chart and labels:
var dc_labels = g.selectAll('.dc_lbls__').data(pie(data3));

var dc_labelse = dc_labels.enter()
.append('text')
.text( function(d) { console.log(d.data.name) ; return d.data.name } )
.attr('class', 'dc_lbls__');

// dc_labelse.attr("transform", "translate(" + ((width/2)) + "," + ((height/2)) + ")");

dc_labels = dc_labels.merge(dc_labelse)
.attr('transform', function(d) {
  var pos = outerArc.centroid(d);
  var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
  pos[0] = radius * 0.79 * (midangle < Math.PI ? 1 : -1)+width/2;
  pos[1] = pos[1]+height/2;
  return 'translate(' + pos + ')';
})
.style('text-anchor', function(d) {
  var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
  return (midangle < Math.PI ? 'start' : 'end')
})
.attr('opacity', 0); 

    


// /////////////////////////////////////////////////

// Parse the Data
d3.csv("https://raw.githubusercontent.com/shashanksharad/TransgenderDiscrimination/main/edu.csv", function(data) {

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.group)}).keys()
// console.log(groups)
  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr('class', 'xaxisgrpbredu')
    .attr('opacity', 0)
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 45])
    .range([ height, 0 ]);
  g.append("g")
  .attr('class', 'yaxisgrpbredu')
  .attr('opacity', 0)
    .call(d3.axisLeft(y));
  // 

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#0065a2','#00b0ba'])





  // Show the bars
 
    // Enter in data = loop group per group
    g.append("g")
    .attr('class', 'allgrpbarsedu')
    .attr('opacity', 0)
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
    .attr('class', 'grpbaredu')
    
      .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
       .attr("y", function(d){
        return y(0)})
        .attr("height", 0)
        .attr("width", xSubgroup.bandwidth())
        .attr("fill", function(d) { return color(d.key); });
        
      


})


      ////////////////////////////////////////////////////////////////////////////////////////////////

      var data4 = [ {name: "Gay/Lesbian/Same Gender", value: 23},
      {name: "Bisexual", value:  25},
      {name: "Queer", value:  23},
      {name: "Heterosexual", value:  23},
      {name: "Asexual", value:  4},
      {name: "Other", value:  2},
      
       ];
      
      // var margin = {top: 20, right: 20, bottom: 20, left: 20};
      // 	width = 400 - margin.left - margin.right;
      // 	height = width - margin.top - margin.bottom;
      
      
      
      // var g = d3.select("g")
      // .attr("transform", "translate(" + ((width/2)+margin.left) + "," + ((height/2)+margin.top) + ")");
      
      console.log(width);
      var radius = Math.min(width, height) / 2;
      
      var color_donut = d3.scaleOrdinal().range(d3.schemeCategory20);
      
      var arc = d3.arc()
      .innerRadius(radius * 0.4)         // This is the size of the donut hole
      .outerRadius(radius * 0.7);
      
      console.log(arc.centroid)   
      var outerArc = d3.arc()
      .innerRadius(radius * 0.75)
      .outerRadius(radius * 0.75);
      
      var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.value; });
      
      
      var arcs = g.selectAll(".arc___")
      .data(pie(data4));
      
      var arcse = arcs.enter().append("path")
      .attr("class", "arc___");
      
      arcs = arcs.merge(arcse)
      .style("fill", function(d) { return color_donut(d.data.name); })
      .attr("stroke", "white")
      .attr("stroke-width", 6)
      .attr('opacity', 0);
      arcse.attr("transform", "translate(" + ((width/2)) + "," + ((height/2)) + ")");
      
      
      
      // Add the polylines between chart and labels:
      var dc_polylines = g.selectAll('.dc_poly___').data(pie(data4));
      
      var dc_polylinese = dc_polylines.enter()
      .append('polyline')
      .attr('class','dc_poly___');
      
      dc_polylines = dc_polylines.merge(dc_polylinese)
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', function(d) {
      var posA = arc.centroid(d) // line insertion in the slice
      var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 ;// we need the angle to see if the X position will be at the extreme right or extreme left
      console.log(midangle)
      posC[0] = radius * 0.75 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
      })
      .attr('opacity', 0);
      dc_polylinese.attr("transform", "translate(" + ((width/2)) + "," + ((height/2)) + ")");
      
      // Add the polylines between chart and labels:
      var dc_labels = g.selectAll('.dc_lbls___').data(pie(data4));
      
      var dc_labelse = dc_labels.enter()
      .append('text')
      .text( function(d) { console.log(d.data.name) ; return d.data.name } )
      .attr('class', 'dc_lbls___');
      
      // dc_labelse.attr("transform", "translate(" + ((width/2)) + "," + ((height/2)) + ")");
      
      dc_labels = dc_labels.merge(dc_labelse)
      .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.79 * (midangle < Math.PI ? 1 : -1)+width/2;
        pos[1] = pos[1]+height/2;
        return 'translate(' + pos + ')';
      })
      .style('text-anchor', function(d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
      })
      .attr('opacity', 0); 


  };

  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  var setupSections = function () {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showTitle;
    activateFunctions[1] = showWorldMap;
    activateFunctions[2] = showFillerTitle2;
    activateFunctions[3] = showBubbleChart;
    // activateFunctions[4] = showGrid;
    // activateFunctions[5] = highlightGrid;
    activateFunctions[4] = showBar;
    activateFunctions[5] = showDonut1;
    // activateFunctions[6] = showDonut2;
    activateFunctions[6] = showGroupHistPart;
    activateFunctions[7] = showGroupHistPart2;
    activateFunctions[8] = showGroupHistPart3;
    activateFunctions[9] = showDonut3;
    activateFunctions[10] = showGroupHistPart4;
    activateFunctions[11] = showDonut4;
    // activateFunctions[8] = showHistPart;
    // activateFunctions[9] = showHistAll;
    // activateFunctions[10] = showCough;
    // activateFunctions[11] = showHistAll;

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < 12; i++) {
      updateFunctions[i] = function () {};
    }
    // updateFunctions[7] = updateCough;
  };

  function showTitle() {
    g.selectAll('.count-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.openvis-title')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);
    


      g.selectAll('.countries')
      .transition()
      .duration(600)
      .style("opacity", 0)


      g.selectAll('.countries')
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          

          d3.select(this)
            .style("opacity", 0)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          

          d3.select(this)
            .style("opacity", 0)
            .style("stroke","white")
            .style("stroke-width",0.3);
        });
      g.selectAll('.d3-tip')
        .transition()
        .duration(600)
        .attr('opacity', 0);

        var tips = document.getElementsByClassName('d3-tip')
        for (var i = 0; i < tips.length; i++) {
          tips[i].style.display = "none"; 
       }
  }
  


  /**
   * showFillerTitle - filler counts
   *
   * hides: intro title
   * hides: square grid
   * shows: filler count title
   *
   */
  function showWorldMap() {
    g.selectAll('.openvis-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    // g.selectAll('.square')
    //   .transition()
    //   .duration(0)
    //   .attr('opacity', 0);

    g.selectAll('.count-title2')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    
      
    var format = d3.format(","); 
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Transgender Support Score: </strong><span class='details'>" + format(d.support) +"</span>";
      })



    // g.append(tip)
   

    
    g.selectAll('.countries')
      .transition()
      .duration(600)
      .style("opacity", 1)
        // tooltips
    g.selectAll('.countries')
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",0.3);
        });
        g.call(tip);

      
        
        

  
      // tooltips
        



    
    
        
  }


  function showFillerTitle2() {
    
    g.selectAll('.countries')
    .transition()
    .duration(600)
    .style("opacity", 0)

        g.selectAll('.countries')
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          

          d3.select(this)
            .style("opacity", 0)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          

          d3.select(this)
            .style("opacity", 0)
            .style("stroke","white")
            .style("stroke-width",0.3);
        });

        var tips = document.getElementsByClassName('d3-tip')
        for (var i = 0; i < tips.length; i++) {
          tips[i].style.display = "none"; 
       }

     

   

    g.selectAll('.bubble')
      .transition()
      .duration(0)
      .attr('opacity', 0);

      g.selectAll('.bubbles')
      .transition()
      .duration(3000)
      .attr('r', function (d) { return d.radius; });

    g.selectAll('.count-title2')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);

      var tips = document.getElementsByClassName('tooltip')
        for (var i = 0; i < tips.length; i++) {
          tips[i].style.display = "none"; 
       }

      //  tooltip.hideTooltip();
    g.selectAll('.bubble')
      .on('mouseover', function (d) { return null })
      .on('mouseout', function (d) { return null });
 
  }





function showBubbleChart() {
    g.selectAll('.count-title2')
      .transition()
      .duration(0)
      .attr('opacity', 0);



  var tooltip = floatingTooltip('gates_tooltip', 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width / 2, y: height / 2 };

  // @v4 strength to apply to the position forces
  var forceStrength = 0.04;

  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }
 

  function ticked() {
    g.selectAll('circle')
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }

  var simulation = d3.forceSimulation()
    .velocityDecay(0.04)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .force('collision', d3.forceCollide().radius(d => d.radius + 1))
    .on('tick', ticked);
    simulation.stop()



  d3.selection.prototype.nodes = function(){
    var nodes = new Array(this.size()), i = -1;
    this.each(function() { nodes[++i] = this; });
    return nodes;
  }

simulation.nodes(d3.selectAll(".bubble").data());
simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

    // @v4 We can reset the alpha value and restart the simulation
simulation.alpha(0.1).restart();

    

  // groupBubbles();
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black').attr('stroke-width', '4px').attr('opacity', 0.8);

    var content = '<span class="value">' +
                  d.name +
                  '</span><br/>' +
                  '<span class="value">'+
                  d.value +'%'+
                  '</span><br/>';

    tooltip.showTooltip(content, d3.event);
  }
  
   
  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', 'white').attr('stroke-width', '2px').attr('opacity', 1)

    tooltip.hideTooltip();
  }

    g.selectAll('.bubble')
      .attr('opacity', 1.0)
      .attr('r', 0);
      

    g.selectAll('.bubble')
      .transition()
      .duration(1000)
      .attr('r', function (d) { return d.radius; })

    g.selectAll('.bubble')
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

      g.selectAll('.bar-text')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    // groupBubbles();

    g.selectAll('.bar')
      .transition()
      .duration(600)
      .attr('width', 0);

      hideAxis(xAxisBar);

  
 
  }


  
  function showBar() {
    // ensure bar axis is set
    showAxis(xAxisBar);
// hideAxis(xAxisgrpbar);
// hideAxis(yAxisgrpbar);
    
    g.selectAll('circle')
    .transition()
    .duration(600)
    .attr('opacity', 0);

    var tips = document.getElementsByClassName('tooltip')
    for (var i = 0; i < tips.length; i++) {
      tips[i].style.display = "none"; 
   }

  //  tooltip.hideTooltip();
g.selectAll('.bubble')
  .on('mouseover', function (d) { return null })
  .on('mouseout', function (d) { return null });


    g.selectAll('.hist')
      .transition()
      .duration(600)
      .attr('height', function () { return 0; })
      .attr('y', function () { return height; })
      .style('opacity', 0);

    g.selectAll('.bar')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('width', function (d) { return xBarScale(d.value); })
      .attr('opacity', 1);

    g.selectAll('.bar-text')
      .transition()
      .duration(600)
      .delay(1200)
      .attr('opacity', 1);

      var radius = Math.min(width, height) / 2;

  
  

      g.selectAll('.arc')
      .transition().delay(function(d, i) { return (5-i)*100; }).duration(100)
      .attr('opacity', 0)
      
      ;
  
      g.selectAll('.dc_poly')
      .transition()
        .duration(0)
        .attr('opacity', 0);
      g.selectAll('.dc_lbls')
      .transition()
        .duration(0)
        .attr('opacity', 0);

    // var tips = document.getElementsByClassName('arc')
    // for (var i = 0; i < tips.length; i++) {
    //   tips[i].style.display = "none";
    // }

    // var tips = document.getElementsByClassName('dc_poly')
    // for (var i = 0; i < tips.length; i++) {
    //   tips[i].style.display = "none";
    // }

    // var tips = document.getElementsByClassName('dc_lbls')
    // for (var i = 0; i < tips.length; i++) {
    //   tips[i].style.display = "none";
    // }

     

  

      
      
  }

  /////////////////////////////////////

  function showDonut1(){
    hideAxis(xAxisBar);

    g.selectAll('.bar-text')
    .transition()
    .duration(0)
    .attr('opacity', 0);

  g.selectAll('.bar')
    .transition()
    .duration(600)
    .attr('width', 0);

  var height = 520;
  var radius = Math.min(width, height) / 2;

  
  var arc = d3.arc()
    .innerRadius(radius * 0.4)         // This is the size of the donut hole
    .outerRadius(radius * 0.7);
    var tr_dur = 700;
  g.selectAll('.arc')
  .transition().delay(function(d, i) { return i*tr_dur; }).duration(tr_dur)
  .attrTween('d', function(d) {
  var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
       return function(t) {
           d.endAngle = i(t);
         return arc(d);
       }
  })
  .attr('opacity', 1)
  ;

  
  g.selectAll('.dc_poly')
  .transition().delay(function(d, i) { return i*tr_dur; }).duration(tr_dur)
  .attr('opacity', 1);
  g.selectAll('.dc_lbls')
  .transition().delay(function(d, i) { return i*tr_dur; }).duration(tr_dur)
  .attr('opacity', 1);

 

  // g.selectAll('.arc_')
  //     .transition().delay(function(d, i) { return (5-i)*100; }).duration(100)
  //     .attr('opacity', 0)
      
  //     ;
  
  // g.selectAll('.dc_poly_')
  // .transition()
  //   .duration(0)
  //   .attr('opacity', 0);
  // g.selectAll('.dc_lbls_')
  // .transition()
  //   .duration(0)
  //   .attr('opacity', 0);

  var height = 520;
var y = d3.scaleLinear()
.domain([0, 40])
.range([ height, 0 ]);
g.selectAll('.allgrpbars').attr('opacity', 1)
.selectAll('.grpbar').selectAll('rect')
.transition()
.duration(800)
.attr("y", function(d){
  return y(0)})
  .attr("height", 0)

  g.selectAll('.yaxisgrpbr')
  .transition()
  .duration(300)
.attr('opacity', 0) 
g.selectAll('.xaxisgrpbr')
.transition()
.duration(300)
.attr('opacity', 0) 

  

    
  }
 /////////////////////////////////////////////////////

 function showDonut2(){
  g.selectAll('.arc')
      .transition().delay(function(d, i) { return (5-i)*100; }).duration(100)
      .attr('opacity', 0)
      
      ;
  
      g.selectAll('.dc_poly')
      .transition()
        .duration(0)
        .attr('opacity', 0);
      g.selectAll('.dc_lbls')
      .transition()
        .duration(0)
        .attr('opacity', 0);

 
var height = 520;
var width = 600;
var radius = Math.min(width, height) / 2;


var arc_ = d3.arc()
  .innerRadius(radius * 0.4)         // This is the size of the donut hole
  .outerRadius(radius * 0.7);

var tr_dur = 700;
g.selectAll('.arc_')
.transition().delay(function(d, i) { return i*tr_dur+100; }).duration(tr_dur)
.attrTween('d', function(d) {
var i_ = d3.interpolate(d.startAngle+0.1, d.endAngle);
     return function(t) {
         d.endAngle = i_(t);
       return arc_(d);
     }
})
.attr('opacity', 1)
;
g.selectAll('.dc_poly_')
.transition().delay(function(d, i) { return i*tr_dur; }).duration(tr_dur)
.attr('opacity', 1);

g.selectAll('.dc_lbls_')
.transition().delay(function(d, i) { return i*tr_dur; }).duration(tr_dur)
.attr('opacity', 1);



var height = 520;
var y = d3.scaleLinear()
.domain([0, 40])
.range([ height, 0 ]);
g.selectAll('.allgrpbars').attr('opacity', 1)
.selectAll('.grpbar').selectAll('rect')
.transition()
.duration(800)
.attr("y", function(d){
  return y(0)})
  .attr("height", 0)

  g.selectAll('.yaxisgrpbr')
  .transition()
  .duration(300)
.attr('opacity', 0) 
g.selectAll('.xaxisgrpbr')
.transition()
.duration(300)
.attr('opacity', 0) 

  
}




//////////////////////////////////////////////////////////////////////
function showGroupHistPart(){

  g.selectAll('.arc')
  .transition().delay(function(d, i) { return (5-i)*100; }).duration(100)
  .attr('opacity', 0)
  
  ;

  g.selectAll('.dc_poly')
  .transition()
    .duration(0)
    .attr('opacity', 0);
  g.selectAll('.dc_lbls')
  .transition()
    .duration(0)
    .attr('opacity', 0);
var height = 520;
var y = d3.scaleLinear()
.domain([0, 55])
.range([ height, 0 ]);

// g.selectAll('.allgrpbars').attr('opacity', 1)

g.selectAll('.allgrpbars').attr('opacity', 1)
.selectAll('.grpbar').selectAll('rect')
.transition()
.duration(800)
.attr("y", function(d) { return y(d.value); })
.attr("height", function(d) { return height - y(d.value); });
 



g.selectAll('.yaxisgrpbr')
  .transition()
  .duration(300)
.attr('opacity', 1) 
g.selectAll('.xaxisgrpbr')
.transition()
.duration(300)
.attr('opacity', 1) 

var height = 520;
var y = d3.scaleLinear()
.domain([0, 40])
.range([ height, 0 ]);
g.selectAll('.allgrpbarswage').attr('opacity', 1)
.selectAll('.grpbarwage').selectAll('rect')
.transition()
.duration(800)
.attr("y", function(d){
  return y(0)})
  .attr("height", 0)

  g.selectAll('.yaxisgrpbrwage')
  .transition()
  .duration(300)
.attr('opacity', 0) 
g.selectAll('.xaxisgrpbrwage')
.transition()
.duration(300)
.attr('opacity', 0) 


    
  }

  function showGroupHistPart2(){
    var height = 520;
var y = d3.scaleLinear()
.domain([0, 40])
.range([ height, 0 ]);
g.selectAll('.allgrpbars').attr('opacity', 1)
.selectAll('.grpbar').selectAll('rect')
.transition()
.duration(800)
.attr("y", function(d){
  return y(0)})
  .attr("height", 0)


  g.selectAll('.yaxisgrpbr')
  .transition()
  .duration(300)
.attr('opacity', 0) 
g.selectAll('.xaxisgrpbr')
.transition()
.duration(300)
.attr('opacity', 0) 

var height = 520;
var y = d3.scaleLinear()
.domain([0, 40])
.range([ height, 0 ]);

// g.selectAll('.allgrpbars').attr('opacity', 1)

g.selectAll('.allgrpbarswage').attr('opacity', 1)
.selectAll('.grpbarwage').selectAll('rect')
.transition()
.duration(800)
.attr("y", function(d) { return y(d.value); })
.attr("height", function(d) { return height - y(d.value); });
 

g.selectAll('.yaxisgrpbrwage')
  .transition()
  .duration(300)
.attr('opacity', 1) 
g.selectAll('.xaxisgrpbrwage')
.transition()
.duration(300)
.attr('opacity', 1) 

var height = 520;
var y = d3.scaleLinear()
.domain([0, 40])
.range([ height, 0 ]);
g.selectAll('.allgrpbarswagegid').attr('opacity', 1)
.selectAll('.grpbarwagegid').selectAll('rect')
.transition()
.duration(800)
.attr("y", function(d){
  return y(0)})
  .attr("height", 0)

  g.selectAll('.yaxisgrpbrwagegid')
  .transition()
  .duration(300)
.attr('opacity', 0) 
g.selectAll('.xaxisgrpbrwagegid')
.transition()
.duration(300)
.attr('opacity', 0) 


  }
//////////////////////////////////////////////////////////////////////
function showGroupHistPart3(){
  var height = 520;
var y = d3.scaleLinear()
.domain([0, 40])
.range([ height, 0 ]);
g.selectAll('.allgrpbarswage').attr('opacity', 1)
.selectAll('.grpbarwage').selectAll('rect')
.transition()
.duration(800)
.attr("y", function(d){
return y(0)})
.attr("height", 0)


g.selectAll('.yaxisgrpbrwage')
.transition()
.duration(300)
.attr('opacity', 0) 
g.selectAll('.xaxisgrpbrwage')
.transition()
.duration(300)
.attr('opacity', 0) 

var height = 520;
var y = d3.scaleLinear()
.domain([0, 40])
.range([ height, 0 ]);

// g.selectAll('.allgrpbars').attr('opacity', 1)

g.selectAll('.allgrpbarswagegid').attr('opacity', 1)
.selectAll('.grpbarwagegid').selectAll('rect')
.transition()
.duration(800)
.attr("y", function(d) { return y(d.value); })
.attr("height", function(d) { return height - y(d.value); });


g.selectAll('.yaxisgrpbrwagegid')
.transition()
.duration(300)
.attr('opacity', 1) 
g.selectAll('.xaxisgrpbrwagegid')
.transition()
.duration(300)
.attr('opacity', 1) 

g.selectAll('.arc__')
.transition().delay(function(d, i) { return (5-i)*100; }).duration(100)
.attr('opacity', 0)

;

g.selectAll('.dc_poly__')
.transition()
  .duration(0)
  .attr('opacity', 0);
g.selectAll('.dc_lbls__')
.transition()
  .duration(0)
  .attr('opacity', 0);


}

//////////////////////////////////////

function showDonut3(){
  

 
var height = 520;
var width = 600;
var radius = Math.min(width, height) / 2;


var arc_ = d3.arc()
  .innerRadius(radius * 0.4)         // This is the size of the donut hole
  .outerRadius(radius * 0.7);

var tr_dur = 700;
g.selectAll('.arc__')
.transition().delay(function(d, i) { return i*tr_dur+100; }).duration(tr_dur)
.attrTween('d', function(d) {
var i_ = d3.interpolate(d.startAngle+0.1, d.endAngle);
     return function(t) {
         d.endAngle = i_(t);
       return arc_(d);
     }
})
.attr('opacity', 1)
;
g.selectAll('.dc_poly__')
.transition().delay(function(d, i) { return i*tr_dur; }).duration(tr_dur)
.attr('opacity', 1);

g.selectAll('.dc_lbls__')
.transition().delay(function(d, i) { return i*tr_dur; }).duration(tr_dur)
.attr('opacity', 1);



var height = 520;
var y = d3.scaleLinear()
.domain([0, 40])
.range([ height, 0 ]);
g.selectAll('.allgrpbarswagegid').attr('opacity', 1)
.selectAll('.grpbarwagegid').selectAll('rect')
.transition()
.duration(800)
.attr("y", function(d){
  return y(0)})
  .attr("height", 0)

  g.selectAll('.yaxisgrpbrwagegid')
  .transition()
  .duration(300)
.attr('opacity', 0) 
g.selectAll('.xaxisgrpbrwagegid')
.transition()
.duration(300)
.attr('opacity', 0) 

var height = 520;
var y = d3.scaleLinear()
.domain([0, 45])
.range([ height, 0 ]);
g.selectAll('.allgrpbarsedu').attr('opacity', 1)
.selectAll('.grpbaredu').selectAll('rect')
.transition()
.duration(800)
.attr("y", function(d){
  return y(0)})
  .attr("height", 0)

  g.selectAll('.yaxisgrpbredu')
  .transition()
  .duration(300)
.attr('opacity', 0) 
g.selectAll('.xaxisgrpbredu')
.transition()
.duration(300)
.attr('opacity', 0) 

  
}

////////////////////////////////
function showGroupHistPart4(){

  g.selectAll('.arc__')
  .transition().delay(function(d, i) { return (5-i)*100; }).duration(100)
  .attr('opacity', 0)
  
  ;

  g.selectAll('.dc_poly__')
  .transition()
    .duration(0)
    .attr('opacity', 0);
  g.selectAll('.dc_lbls__')
  .transition()
    .duration(0)
    .attr('opacity', 0);

var height = 520;
var y = d3.scaleLinear()
.domain([0, 45])
.range([ height, 0 ]);

// g.selectAll('.allgrpbars').attr('opacity', 1)

g.selectAll('.allgrpbarsedu').attr('opacity', 1)
.selectAll('.grpbaredu').selectAll('rect')
.transition()
.duration(800)
.attr("y", function(d) { return y(d.value); })
.attr("height", function(d) { return height - y(d.value); });
 



g.selectAll('.yaxisgrpbredu')
  .transition()
  .duration(300)
.attr('opacity', 1) 
g.selectAll('.xaxisgrpbredu')
.transition()
.duration(300)
.attr('opacity', 1) 

g.selectAll('.arc___')
.transition().delay(function(d, i) { return (5-i)*100; }).duration(100)
.attr('opacity', 0)

;

g.selectAll('.dc_poly___')
.transition()
  .duration(0)
  .attr('opacity', 0);
g.selectAll('.dc_lbls___')
.transition()
  .duration(0)
  .attr('opacity', 0);



    
  }
  ///////////////////////////////////

  function showDonut4(){
  

 
    var height = 520;
    var width = 600;
    var radius = Math.min(width, height) / 2;
    
    
    var arc_ = d3.arc()
      .innerRadius(radius * 0.4)         // This is the size of the donut hole
      .outerRadius(radius * 0.7);
    
    var tr_dur = 700;
    g.selectAll('.arc___')
    .transition().delay(function(d, i) { return i*tr_dur+100; }).duration(tr_dur)
    .attrTween('d', function(d) {
    var i_ = d3.interpolate(d.startAngle+0.1, d.endAngle);
         return function(t) {
             d.endAngle = i_(t);
           return arc_(d);
         }
    })
    .attr('opacity', 1)
    ;
    g.selectAll('.dc_poly___')
    .transition().delay(function(d, i) { return i*tr_dur; }).duration(tr_dur)
    .attr('opacity', 1);
    
    g.selectAll('.dc_lbls___')
    .transition().delay(function(d, i) { return i*tr_dur; }).duration(tr_dur)
    .attr('opacity', 1);
    
    
    
    var height = 520;
var y = d3.scaleLinear()
.domain([0, 45])
.range([ height, 0 ]);
g.selectAll('.allgrpbarsedu').attr('opacity', 1)
.selectAll('.grpbaredu').selectAll('rect')
.transition()
.duration(800)
.attr("y", function(d){
  return y(0)})
  .attr("height", 0)

  g.selectAll('.yaxisgrpbredu')
  .transition()
  .duration(300)
.attr('opacity', 0) 
g.selectAll('.xaxisgrpbredu')
.transition()
.duration(300)
.attr('opacity', 0) 
    
      
    }
 



 

  /**
   * showAxis - helper function to
   * display particular xAxis
   *
   * @param axis - the axis to show
   *  (xAxisHist or xAxisBar)
   */
  function showAxis(axis) {
    g.select('.x.axis')
      .call(axis)
      .transition().duration(500)
      .style('opacity', 1);
  }

  /**
   * hideAxis - helper function
   * to hide the axis
   *
   */
  function hideAxis() {
    g.select('.x.axis')
      .transition().duration(500)
      .style('opacity', 0);
  }

 
  function updateCough(progress) {
    g.selectAll('.cough')
      .transition()
      .duration(0)
      .attr('opacity', progress);

    g.selectAll('.hist')
      .transition('cough')
      .duration(0)
      .style('fill', function (d) {
        return (d.x0 >= 14) ? coughColorScale(progress) : '#008080';
      });
  }


  function getWords(rawData) {
    return rawData.map(function (d, i) {
      // is this word a filler word?
      d.filler = (d.filler === '1') ? true : false;
      // time in seconds word was spoken
      d.time = +d.time;
      // time in minutes word was spoken
      d.min = Math.floor(d.time / 60);

      // positioning for square visual
      // stored here to make it easier
      // to keep track of.
      d.col = i % numPerRow;
      d.x = d.col * (squareSize + squarePad);
      d.row = Math.floor(i / numPerRow);
      d.y = d.row * (squareSize + squarePad);
      return d;
    });
  }

  /**
   * getFillerWords - returns array of
   * only filler words
   *
   * @param data - word data from getWords
   */
  function getFillerWords(data) {
    return data.filter(function (d) {return d.filler; });
  }

  /**
   * getHistogram - use d3's histogram layout
   * to generate histogram bins for our word data
   *
   * @param data - word data. we use filler words
   *  from getFillerWords
   */
  function getHistogram(data) {
    // only get words from the first 30 minutes
    var thirtyMins = data.filter(function (d) { return d.min < 30; });
    // bin data into 2 minutes chuncks
    // from 0 - 31 minutes
    // @v4 The d3.histogram() produces a significantly different
    // data structure then the old d3.layout.histogram().
    // Take a look at this block:
    // https://bl.ocks.org/mbostock/3048450
    // to inform how you use it. Its different!
    return d3.histogram()
      .thresholds(xHistScale.ticks(10))
      .value(function (d) { return d.min; })(thirtyMins);
  }

  /**
   * groupByWord - group words together
   * using nest. Used to get counts for
   * barcharts.
   *
   * @param words
   */
  function groupByWord(words) {
    return d3.nest()
      .key(function (d) { return d.word; })
      .rollup(function (v) { return v.length; })
      .entries(words)
      .sort(function (a, b) {return b.value - a.value;});
  }

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function (index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return chart;
};


/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(data) {
  // create a new plot and
  // display it
  var plot = scrollVis();
  d3.select('#vis')
    .datum(data)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    // activate current section
    plot.activate(index);
  });

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });
}

// load data and display
d3.tsv('https://raw.githubusercontent.com/vlandham/scroll_demo/gh-pages/data/words.tsv', display);
