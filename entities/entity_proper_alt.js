$("#chart_proper").empty();

var barData = [{
  "id": 5,
  "quantity": 21,
  "quantityPlaced": 5,
  "quantityExecuted": 5,
  "status": "New"
}, {
  "id": 6,
  "quantity": 5614,
  "quantityPlaced": 1028,
  "quantityExecuted": 788,
  "status": "New"
}, {
  "id": 7,
  "quantity": 6366,
  "quantityPlaced": 2569,
  "quantityExecuted": 893,
  "status": "New"
}, {
  "id": 8,
  "quantity": 6655,
  "quantityPlaced": 1252,
  "quantityExecuted": 350,
  "status": "New"
}, {
  "id": 9,
  "quantity": 5784,
  "quantityPlaced": 1844,
  "quantityExecuted": 749,
  "status": "New"
}, {
  "id": 10,
  "quantity": 6750,
  "quantityPlaced": 3133,
  "quantityExecuted": 902,
  "status": "New"
}, {
  "id": 11,
  "quantity": 2946,
  "quantityPlaced": 624,
  "quantityExecuted": 464,
  "status": "New"
}, {
  "id": 12,
  "quantity": 2794,
  "quantityPlaced": 647,
  "quantityExecuted": 387,
  "status": "New"
}, {
  "id": 13,
  "quantity": 4000,
  "quantityPlaced": 391,
  "quantityExecuted": 391,
  "status": "New"
}, {
  "id": 14,
  "quantity": 4407,
  "quantityPlaced": 1665,
  "quantityExecuted": 683,
  "status": "New"
}];
var drawChart = function(data) {
  var margin = {
    t: 30,
    r: 20,
    b: 20,
    l: 70
  },
    width = 600,
    height = 600;
  var w = width - margin.l - margin.r;
  var h = height - margin.t - margin.b;
  
  
  var y = d3.scale.linear().domain([0, data.length]).range([h - margin.t - margin.b, 0]);
  var x = d3.scale.linear().range([0, w - margin.r - margin.l]);

  var color = ["#FF8000", "#FECC88", "#FFF4D2"];
  var getRanges = function(d) {
    var e, p;
    e = ((d.count / d.total)).toFixed(4);
    p = (((d.total-d.count) / d.total)).toFixed(4);
    return [[0, e], [e, (p - e).toFixed(4)], [p, 1 - p]];
  };
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .tickSubdivide(true)
    .tickFormat(d3.format(".0%"))
    .ticks(3);

  var yAxis = d3.svg.axis()
    .scale(y)
    .tickSubdivide(true)
    .ticks(5)
    .orient("left");

  var svg = d3.select("#chart_proper").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("transform", "translate(0," + (margin.t) + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.l + "," + (margin.t) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.l + "," + (margin.t) + ")")
    .call(yAxis);

  data.forEach(function(td, j) {
    svg.append("g")
      .attr("transform", "translate(" + margin.l + "," + (y(j) + margin.t - 25/2) + ")")
      .selectAll("rect")
      .data(getRanges(td))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .style("fill", function(d, i) {
        return color[i];
      })
      .attr("width", function(d, i) {
        return x(d[1]);
      })
      .attr("height", 25)
      .attr("transform", function(d, i) {
        return "translate(" + x(d[0]) + ",0)";
      });
  });
};
//drawChart(barData);


$.ajax({
  dataType: "json",
  url: "entity_proper.json",
  //data: data,
  success: function(data){drawChart(data);}//function(res){data=res;}
});

