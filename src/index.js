/**
 * Using a bundler let's us import
 * third party libraries and our own modules
 * using the "require()" or "import * from 'X'"
 * syntax.
 */

const d3 = require('d3');
const myUtilityFunc = require('./utility-funcs');

console.log('This function was imported from another file.', myUtilityFunc(2));


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

var month = 'Dec.'
var year = 2016
// Parse the Data
d3.csv(dated).then(function(data) {
  data = data.filter(function(d){return d['Year'] == year && d['Month'] == month})
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
/*
 * Code to append elements to the page,
 * and do simple manipulations and animation
 * of style.
 */

// d3.select('svg')
//   .append('rect')
//     .attr('width', 20)
//     .attr('height', 20)
//     .attr('fill', 'blue')

// const circle = d3.selectAll('circle')

// circle
//   .attr('r', 100)
//   .attr('fill', 'black')
//   .transition()
//   .duration(1500)
//   .delay(1000)
//   .attr('r', 50)
//   .attr('fill', 'blue')

// circle
//   .on('click', function (d, i) {
//     d3.select(this).attr('r', 1)
//   })



/**
 * A data generating function.
 * We'll use this to create a dataset
 * that can be used with D3.
 */

const generateData = () => {
    return Math.random();
}


/**
 * Create our data set, is empty to start.
 */
const myData = [];

/**
 * Every second create a new data point.
 */
setInterval(() => {

    const lastDataPoint = generateData()
    myData.push(lastDataPoint)

    // Remove the first element if there are more than 10.
    if (myData.length > 10) {
        myData.shift();
    }

    d3.selectAll('circle')
        .transition()
        .attr('r', rScale(lastDataPoint))

    drawMyData();
}, 1000)

// console.log(myData)

/**
 * Instantiate an area scale. A SQRT scale is
 * appropriate for mapping data to area.
 *
 * You would use a linear scale instead if you wanted
 * to map data to e.g. position (as in the X, Y coordinates
 * on a scatter plot).
 *
 * D3 supports many other types of scales as well, including
 * color scales.
 */
const rScale = d3.scaleSqrt().domain([0, 1]).range([10, 100]);

// A scale is just a function that takes in a value in the
// DOMAIN, and returns a value in the RANGE.
console.log(rScale(0.5))



/**
 * Here we do data binding.
 */
const drawMyData = () => {

    // The initial update set.
    // The second argument to data() is the
    // key function. This is how D3 can match
    // data points between updates. Here we just
    // use the value itself, but you'd
    // likely want to use some sort of primary key
    // in practice.
    const updateSet = d3.selectAll('div.dataPoint').data(myData, (d) => {
        return d
    });

    // The enter set (any new data point).
    updateSet.enter()
        .append('div')
        .attr('class', 'dataPoint')
        .text((d) => {
            return d
        })
        .style('font-size', (d) => {
            // Data driven font-size!
            return rScale(d)
        })
        .style('color', (d, i) => {
            if (i === 0) {
                return 'black'
            }
            // Green if its bigger than the last value
            // we saw, red if its smaller.
            if (d > myData[i - 1]) {
                return 'green'
            }
            return 'red';
        })


    updateSet
        .style('color', 'black')

    // Any data point that disappeared.
    updateSet.exit()
        .remove()
}


drawMyData();
