// Color Mappings Using this color-blind friendly color pallette:
// https://davidmathlogic.com/colorblind/#%23332288-%23117733-%2344AA99-%2388CCEE-%23DDCC77-%23CC6677-%23AA4499-%23882255
var colors = ['#332288', '#117733', '#44aa99', '#88ccee', '#ddcc77', '#cc6677', '#aa4499', '#aa4499', '#882255'];
var disease_list = ["Chlamydia trachomatis infection", "Campylobacteriosis", "Salmonellosis",
                    "Human immunodeficiency virus diagnoses", "Invasive pneumococcal disease", "Pertussis",
                    "Shigellosis"];
var color_map = {};
// looping over disease list and map a disease to a color
for (let i = 0; i < disease_list.length; i++) {
  name = disease_list[i];
  color_map[name] = colors[i];
}
// for the hover window; look_up contains disease, year_month, and count
// look_up["HIV"][0] reutrns the count for HIV at Jan 2016
var look_up = {};
const dated = require('./dated.csv')
var year_month = 0
module.exports = (ym) => {
  if (ym) {
    year_month = ym;
  }
  var char_generated = document.getElementById("bar-chart").childElementCount > 0;

  var margin = {top: 30, right: 30, bottom: 70, left: 60},
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#bar-chart");
  if (!char_generated) {
    svg = d3.select("#bar-chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
  }

  var lsvg = d3.select("#bar-legend") //Legend SVG
  if (!char_generated) {
    lsvg = d3.select("#bar-legend")
      .append("svg")
        .attr("width", 400)
        .attr("height", 500)
      .append("g");
  }

  // Parse the Data
  d3.csv(dated).then(function(data) {
    data = data.filter(function(d){
      var cond = d['ym'] == year_month;
      // only restric for disease in the disease list
      cond &= disease_list.includes(d.Disease);
      return cond;
    })
    data = data.sort(function(a,b){return b.Count - a.Count})
    // data = data.slice(0,8)
    var max = d3.max(data, function(d) { return +d.Count;} );
    var max = Math.ceil(max / 15000) * 15000
    // console.log(max)
    // add to look up
    data.forEach(d => {
      if (!look_up[d.Disease]) {
        look_up[d.Disease] = {};
      }
      look_up[d.Disease][year_month] = d.Count;
    })

    // X axis
    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(data.map(function(d) { return d.Disease; }))
      .padding(0.2);
    if (char_generated) {
      d3.select("#x-axis")
        .transition()
        .call(d3.axisBottom(x))
    } else {
      svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");
    }

    // Add Y axis
    var y = d3.scaleLog()
      .domain([1, max])
      .range([ height, 0])
      .base(5);
    if (char_generated) {
      d3.select("#y-axis")
        .transition()
        .call(d3.axisLeft(y));
    } else {
      svg.append("g")
        .attr("id", "y-axis")
        .call(d3.axisLeft(y));
    }
    // remove ticks without a number
    document.querySelectorAll(".tick").forEach(e => {
      if (e.querySelector("text").innerHTML == "") {
        e.remove();
      }
    })

    // Bars
    if (char_generated) {
      svg.selectAll("mybar")
        .data(data)
        .enter();
      d3.selectAll('rect')
        .transition()
          .attr("x", function(d) { return x(d.Disease); })
          .attr("y", function(d) { return y(d.Count); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d.Count); })
          .attr("fill", function(d,i){return color_map[d.Disease]})
    } else {
      // when page first loads
      // create hover window
      var info = d3.select("body").append("div")
        .attr("id", "tooltip")
      svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
          .attr("disease", (d) => {return d.Disease})
          .attr("count", (d) => {return d.count})
          .attr("x", function(d) { return x(d.Disease); })
          .attr("y", function(d) { return y(d.Count); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d.Count); })
          .attr("fill", function(d,i){return color_map[d.Disease]})
          .on('mouseover', mouseover)
          .on('mouseout', function (d, i) {
            d3.select(this).transition()
              .duration(10)
              .attr("opacity", 1);
            info.transition()
              .duration(10)
              .style("opacity", 0);
            document.querySelectorAll(`#bar-legend *[disease='${d.Disease}']`).forEach(e =>{
              e.classList.remove("legend-highlight");
            })
          })
    }

    function mouseover(d) {
      // console.log(look_up)
      // bar char hover color change
      d3.select(this).transition()
        .duration(10)
        .attr("opacity", .85);
      // show hover window
      info.transition()
        .duration(10)
        .style("opacity", 1)
      // set the content and position the hover window
      info.html(`<strong>${d.Disease}</strong><br>
                  <strong>Date:</strong> ${document.getElementById("month-year").innerText}<br>
                  <strong>Infected Number:</strong> ${parseInt(look_up[d.Disease][year_month])}`)
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 15 + "px")
        .style("position", "absolute");
      // highlight legend
      document.querySelectorAll(`#bar-legend *[disease='${d.Disease}']`).forEach(e =>{
        e.classList.add("legend-highlight");
      })
    }

    var keys = data.map(function(d) { return d.Disease})
    var size = 20
    // Add one dot in the legend for each name.
    if (!char_generated) {
      lsvg.selectAll("mydots")
        .data(keys)
        .enter()
        .append("circle")
          .attr("disease", (d) => {return d})
          .attr("class", "legend-circles")
          .attr("cx", 60)
          .attr("cy", function(d,i){ return 100 + i*40}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .style("fill", function(d){ return color_map[d]})
    }

    // Add one dot in the legend for each name.
    if (!char_generated) {
      lsvg.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
        .attr("disease", (d) => {return d})
        .attr("class", "legend-text")
        .attr("x", 80)
        .attr("y", function(d,i){ return 100 + i*40}) // 100 is where the first dot appears. 25 is the distance between dots
        // .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
    }
  })
};
