(() => {
  const d3 = require('d3');
  const myUtilityFunc = require('./utility-funcs');


  const dated = require('./dated.csv')

  var margin = {top: 30, right: 30, bottom: 70, left: 60},
      width = 920 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#bar-chart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  var lsvg = d3.select("#bar-legend") //Legend SVG

  var year_month = 32
  // Parse the Data
  d3.csv(dated).then(function(data) {
    data = data.filter(function(d){return d['ym'] == year_month})
    data = data.sort(function(a,b){return b.Count - a.Count})
    data = data.slice(0,8)
    var max = d3.max(data, function(d) { return +d.Count;} );
    var max = Math.ceil(max / 15000) * 15000
    console.log(max)

    // X axis
    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(data.map(function(d) { return d.Disease; }))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, max])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Color Mappings Using this color-blind friendly color pallette:
    // https://davidmathlogic.com/colorblind/#%23332288-%23117733-%2344AA99-%2388CCEE-%23DDCC77-%23CC6677-%23AA4499-%23882255
    var color_map = ['#332288', '#117733', '#44aa99', '#88ccee', '#ddcc77', '#cc6677', '#aa4499', '#aa4499']
    // Bars
    svg.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", function(d) { return x(d.Disease); })
        .attr("y", function(d) { return y(d.Count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.Count); })
        .attr("fill", function(d,i){return color_map[i]})

  var keys = data.map(function(d) { return d.Disease; })
  var color = d3.scaleOrdinal()
      .domain(keys)
      .range(color_map)

  var size = 20
  // Add one dot in the legend for each name.
  svg.selectAll("mydots")
    .data(keys)
    .enter()
    .append("circle")
      .attr("cx", 100)
      .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", function(d){ return color(d)})

  // Add one dot in the legend for each name.
  svg.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", 120)
    .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    // .style("fill", function(d){ return color(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
  })

})()
