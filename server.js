/*
 * npm install d3 node-jsdom
 */

import * as d3 from 'd3';
import * as jsdom from 'jsdom';
import * as http from 'http';

const { JSDOM } = jsdom;

function svgDOM(width, height) {
  // Setup DOM
  const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>');
  console.log(dom.window.document.querySelector("p").textContent);
  var body = d3.select(dom.window.document.body);
  // Create svg node
  return body.append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('width', width)
    .attr('height', height);
}

function d3Draw() {
  var π = Math.PI,
      τ = 2 * π,
      n = 500;

  var width = 960,
      height = 960,
      outerRadius = width / 2 - 20,
      innerRadius = outerRadius - 80;

  var svg = svgDOM(width, height);
  svg
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .selectAll("path")
      .data(d3.range(0, τ, τ / n))
    .enter().append("path")
      .attr("d", d3.arc()
          .outerRadius(outerRadius)
          .innerRadius(innerRadius)
          .startAngle(function(d) { return d; })
          .endAngle(function(d) { return d + τ / n * 1.1; }))
      .style("fill", function(d) { return d3.hsl(d * 360 / τ, 1, .5); });

   return svg.node().outerHTML
}

http.createServer(
  function (req, res) {
    // favicon - browser annoyance, ignore 
    if(req.url.indexOf('favicon.ico') >= 0) {
      res.statusCode = 404
      return
    }

    res.writeHead(200, { "Content-Type": 'application/json' });
    res.end(d3Draw());
  }
)
.listen(8080, function() {
  console.log("Server listening on port 8080");
});