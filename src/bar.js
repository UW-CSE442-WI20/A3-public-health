(() => {
  const d3 = require('d3');
  // const myUtilityFunc = require('./utility-funcs');


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

  var year_month = 32
  // Parse the Data
  d3.csv(dated).then(function(data) {
    data = data.filter(function(d){return d['ym'] == year_month})
    data = data.sort(function(a,b){return b.Count - a.Count})
    data = data.slice(0,10)
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

    // Bars
    svg.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", function(d) { return x(d.Disease); })
        .attr("y", function(d) { return y(d.Count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.Count); })
        .attr("fill", "#69b3a2")

  })
})()
