
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


var xAxisgrpbar = d3.axisBottom(x0)




var yAxisgrpbar = d3.axisLeft(y);

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
  var xAxisHist = d3.axisBottom()
    .scale(xHistScale)
    .tickFormat(function (d) { return d + ' min'; });

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
      xBarScale.domain([0, countMax]);

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

var color = d3.scaleThreshold()
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
    .style("fill", function(d) { if (populationById[d.id]) {return color(populationById[d.id])} else {return "rgb(240,240,240)"}; })
    .style('stroke', 'white')
    .style('stroke-width', 1.5)
    .style("opacity", 0)


}


      g.append('text')
      .attr('class', 'title count-title2 highlight')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text('Transgender2');

    g.append('text')
      .attr('class', 'sub-title count-title2')
      .attr('x', width / 2)
      .attr('y', (height / 3) + (height / 5))
      .text('Discrimination2');

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

  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  
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


////////////////////////////////////////////////////////////////////////////

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
  { name: "Lack of Health Coverage", title: "Lack of Health Coverage",color: "#F4D03F", value: 22 },
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
      .text(function (d) { return d.title; })
      .attr('x', 0)
      .attr('dx', 5)
      .attr('y', function (d, i) { return yBarScale(i);})
      .attr('dy', yBarScale.bandwidth() / 2)
      .style('font-size', '15px')
      .style('text-anchor', 'right')
      .attr('fill', 'white')
      .attr('opacity', 0);

      ////////////////////////////////////////////////////////////////////////////////////////////////




var color = d3.scaleOrdinal()
    .range(["#2c3e50","#95a5a6"]);

  // var svg = g.append("svg")
  //   .append("g")

// var g = d3.select('g')
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)

d3.json("https://raw.githubusercontent.com/shashanksharad/TransgenderDiscrimination/main/wage_group_barchart.json", function(error, data) {
    // console.log(data);

  var categoriesNames = data.map(function(d) { return d.categorie; });
  var rateNames = data[0].values.map(function(d) { return d.rate; });

  x0.domain(categoriesNames);
  x1.rangeRound([0, x0.bandwidth()]).domain(rateNames);
  y.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);




//////////////////////////////////////////////////////////

  g.selectAll('xaxisgrpbar')
      .append('xaxisgrpbar')
      .attr("class", "xaxisgrpbar")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisgrpbar);

  g.selectAll('yaxisgrpbar')
      .append('yaxisgrpbar')
      .attr("class", "yaxisgrpbar")
      .style('opacity','0')
      .call(yAxisgrpbar)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style('font-weight','bold')
      .text("Value");



 

  g.select('.yaxisgrpbar').transition().duration(500).delay(1300).style('opacity','1');

  var slice = g.selectAll("grpbar")
      .data(data)
      .enter().append("rect")
      .attr("class", "grpbar")
      .attr("transform",function(d) { return "translate(" + x0(d.categorie) + ",0)"; });

  slice.selectAll("grpbar")
      .data(function(d) { return d.values; })
      .enter().append("rect")
      .attr("width", x1.bandwidth())
      .attr("x", function(d) { return x1(d.rate); })
      .style("fill", function(d) { return color(d.rate) })
      .attr('opacity', 1)
      .attr("y", function(d) { return 10; })
      .attr("height", function(d) { return height-10; })
      .on("mouseover", function(d) {
          d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
      })
      .on("mouseout", function(d) {
          d3.select(this).style("fill", color(d.rate));
      });

  slice.selectAll("grpbar")
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
      .attr("y", function(d) { return 10; })
      .attr("height", function(d) { return height - 10; });

  //Legend
  var legend = svg.selectAll(".legend")
      .data(data[0].values.map(function(d) { return d.rate; }).reverse())
  .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
      .style("opacity",1);

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d); });

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {return d; });

  legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

});






      ////////////////////////////////////////////////////////////////////////////////////////////////

    // histogram
    // @v4 Using .merge here to ensure
    // new and old data have same attrs applied
    var hist = g.selectAll('.hist').data(histData);
    var histE = hist.enter().append('rect')
      .attr('class', 'hist');
    hist = hist.merge(histE).attr('x', function (d) { return xHistScale(d.x0); })
      .attr('y', height)
      .attr('height', 0)
      .attr('width', xHistScale(histData[0].x1) - xHistScale(histData[0].x0) - 1)
      .attr('fill', barColors[0])
      .attr('opacity', 0);

    // cough title
    g.append('text')
      .attr('class', 'sub-title cough cough-title')
      .attr('x', width / 2)
      .attr('y', 60)
      .text('cough')
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
    activateFunctions[5] = showGroupHistPart;
    activateFunctions[6] = showHistPart;
    activateFunctions[7] = showHistAll;
    activateFunctions[8] = showCough;
    activateFunctions[9] = showHistAll;

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < 10; i++) {
      updateFunctions[i] = function () {};
    }
    updateFunctions[7] = updateCough;
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

      // g.selectAll("grpbar")
      // .transition()
      // .delay(function (d) {return Math.random()*1000;})
      // .duration(1000)
      // .attr('opacity', 0);
  
      // g.selectAll('x axis')
      // .attr('opacity', 0);
      // g.selectAll('y axis')
      // .attr('opacity', 0);

      
      
  }

//////////////////////////////////////////////////////////////////////
  function showGroupHistPart(){
    hideAxis(xAxisBar);
    // showAxis(xAxisgrpbar);
    // showAxis(yAxisgrpbar);
    
    // g.selectAll('slice')
    // .transition()
    // .duration(600)
    // .attr('opacity', 1)

    // g.selectAll("grpbar")
    // .selectAll('rect')
    //   .attr('opacity', 1);

    //   g.selectAll("rect")
    //   .transition()
    //     .delay(function (d) {return Math.random()*1000;})
    //     .duration(1000)
    //     .attr("y", function(d) { return y(d.value); })
    //     .attr("height", function(d) { return height - y(d.value); })
    //     .attr('opacity', 1);


    g.selectAll('.bar-text')
    .transition()
    .duration(0)
    .attr('opacity', 0);

  g.selectAll('.bar')
    .transition()
    .duration(600)
    .attr('width', 0);
  }
//////////////////////////////////////////////////////////////////////

  function showHistPart() {

    hideAxis(xAxisgrpbar);
hideAxis(yAxisgrpbar);

g.selectAll("rect")
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
      .attr("y", function(d) { return y(d.value); })
      .attr('opacity', 0);

    g.selectAll('rect')
      .attr('opacity', 0)
    // switch the axis to histogram one
    showAxis(xAxisHist);



    // here we only show a bar if
    // it is before the 15 minute mark
    g.selectAll('.hist')
      .transition()
      .duration(600)
      .attr('y', function (d) { return (d.x0 < 15) ? yHistScale(d.length) : height; })
      .attr('height', function (d) { return (d.x0 < 15) ? height - yHistScale(d.length) : 0; })
      .style('opacity', function (d) { return (d.x0 < 15) ? 1.0 : 1e-6; });
  }


  function showHistAll() {
    // ensure the axis to histogram one
    showAxis(xAxisHist);

    g.selectAll('.cough')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    // named transition to ensure
    // color change is not clobbered
    g.selectAll('.hist')
      .transition('color')
      .duration(500)
      .style('fill', '#008080');

    g.selectAll('.hist')
      .transition()
      .duration(1200)
      .attr('y', function (d) { return yHistScale(d.length); })
      .attr('height', function (d) { return height - yHistScale(d.length); })
      .style('opacity', 1.0);
  }

  /**
   * showCough
   *
   * hides: nothing
   * (previous and next sections are histograms
   *  so we don't have to hide much here)
   * shows: histogram
   *
   */
  function showCough() {
    // ensure the axis to histogram one
    showAxis(xAxisHist);

    g.selectAll('.hist')
      .transition()
      .duration(600)
      .attr('y', function (d) { return yHistScale(d.length); })
      .attr('height', function (d) { return height - yHistScale(d.length); })
      .style('opacity', 1.0);
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
