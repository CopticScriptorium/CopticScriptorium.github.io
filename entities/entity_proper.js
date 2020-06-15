//Margin conventions
$("#chart_proper").empty();

var margin = {top: 10, right: 50, bottom: 20, left: 227};

var widther = window.outerWidth;
if (widther>800){widther=800;}

var width = widther - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var barHeight = 50;      

//Appends the svg to the chart-container div
var svg = d3.select("#chart_proper").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//Draw the chart
//ready(data);

function ready(data) {
	
data.sort(function (a, b) {
    return (a.count/a.total) - (b.count/b.total);
});

//Creates the xScale 
var xScale = d3.scale.linear()
  .range([0,width]);

//Creates the yScale
cats = [];
for (row of data){
	cats.push(row["category"]);
}
var y0 = d3.scale.ordinal()
  .rangeBands([height, 0], 0)
  .domain(cats);

//Defines the y axis styles
var yAxis = d3.svg.axis()
  .scale(y0)
  .orient("left");

//Defines the y axis styles
var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom")
  .tickFormat(function(d) {return d + "%"; })
  .tickSize(height); 


  //FORMAT data
  data.forEach(function(d) {
    d.count = +d.count;
    d.total = +d.total;
  });


  //Sets the max for the xScale
  var maxX = d3.max(data, function(d) { return 100; });

  //Gets the min for bar labeling
  var minX = d3.min(data, function(d) { return 100*(d.count/d.total); });

  //Defines the xScale max
  xScale.domain([0, maxX ]);

  //Appends the y axis
  var yAxisGroup = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

//    .attr("class", function(d) { return "y.axis " + cats[d].replace(/ /g,"_").toLowerCase(); })

/*for (i in yAxisGroup){
	a = yAxisGroup[i];
	a.attr("class","y.axis " + cats[i]);
	}*/


  //Appends the x axis    
  var xAxisGroup = svg.append("g")
    .attr("class", "x axis")
    .call(xAxis); 

  //Binds the data to the bars      
  var categoryGroup = svg.selectAll(".g-category-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "g-category-group")
    .attr("transform", function(d) {
      return "translate(0," + y0(d.category) + ")";
    });

  //Appends background bar   
  var bars2 = categoryGroup.append("rect")
    .attr("width", function(d) { return xScale(100); })
    .attr("height", barHeight - 20 )
    .attr("class", "g-num2")
    .attr("transform", "translate(0,4)");   

  //Appends main bar   
  var bars = categoryGroup.append("rect")
    .attr("width", function(d) { return xScale(100*(d.count/d.total)); })
    .attr("height", barHeight - 20 )
    .attr("class", "g-num")
    .attr("class", function(d) { return "g-num " + d.category.replace(/ /g,"_").toLowerCase(); })
    .attr("transform", "translate(0,4)"); 
  
  //Binds data to labels
  var labelGroup = svg.selectAll("g-num")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "g-label-group")
    .attr("transform", function(d) {
      return "translate(0," + y0(d.category) + ")";
    });

  //Appends main bar labels   
  var barLabels = labelGroup.append("text") 
    .text(function(d) {return  (100*(d.count/d.total)).toFixed(2) + "%";})
    .attr("x", function(d) { 
      if (minX > 32) {
        return xScale(100*(d.count/d.total)) - 57;}
      else {
        return xScale(100*(d.count/d.total)) + 6;}})
    .style("fill", function(d){
      if (minX > 32) {
        return "white";}
      else {
        return "#696969";}}) 
    .attr("y", -10+y0.rangeBand()/1 )
    .attr("class", "g-labels");       

  var barLabels = labelGroup.append("text") 
    .text(function(d) {return  "("+d.total + ")";})
    .attr("x", function(d) { 
      if (d.total < 999) {
        return  470;}
      else {
        return  460;}})
    .style("fill", function(d){
      if (maxX > 32) {
        return "white";}
      else {
        return "#696969";}}) 
    .attr("y", -10+y0.rangeBand()/1 )
    .attr("class", "g-labels");       

      
  //RESPONSIVENESS
  d3.select(window).on("resize", resized);

  function resized() {

    //new margin
    var newMargin = {top: 10, right: 10, bottom: 20, left: 227};


    //Get the width of the window
    var w = d3.select(".g-chart").node().clientWidth;
    console.log("resized", w);

    //Change the width of the svg
    d3.select("svg")
      .attr("width", w);

    //Change the xScale
    xScale
      .range([0, w - newMargin.right - newMargin.left]);

    //Update the bars
    bars
      .attr("width", function(d) { return xScale(100*(d.count/d.total)); });

    //Update the second bars
    bars2
      .attr("width", function(d) { return xScale(100); });  

    //Updates bar labels
    barLabels
      .attr("x", function(d) { 
        if (minX > 32) {
          return xScale(100*(d.count/d.total)) - 37;}
        else {
          return xScale(100*(d.count/d.total)) + 6;}})
      .attr("y", y0.rangeBand()/1 )

    //Updates xAxis
    xAxisGroup
      .call(xAxis);   

    //Updates ticks
    xAxis
      .scale(xScale)

  };

}


$.ajax({
  dataType: "json",
  url: "entity_proper.json",
  //data: data,
  success: function(data){ready(data);}//function(res){data=res;}
});

