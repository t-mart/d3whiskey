
queue()
  .defer(d3.csv, "whiskies.csv")
  .await(ready);

function ready(error, whiskies) {

  var pie_side = 300;
  var pie_radius = pie_side / 2;

  var pie_radius_scale = d3.scale.linear()
    .domain([0, 4])
    .range([0.4,1.0]);

  var pie_svgs = d3.select("#whiskey_pies")
    .selectAll("pies")
    .data(whiskies).enter().append("svg")
    .attr("width", pie_side)
    .attr("height", pie_side)
    .append("g")
    .attr("transform", "translate(" + pie_radius + "," + pie_radius + ")");

  var color = d3.scale.linear()
    .domain([0,4])
    .range(["rgb(255,255,255)","rgb(218,165,32)"]);

  var pie_arc = d3.svg.arc()
    .outerRadius(function(d,i) {
      return pie_radius_scale(d.data.value) * pie_radius; })
    .innerRadius(pie_radius * 0.4);

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d,i) {return 1;});

  var pie_arc_data;
  var g = pie_svgs.selectAll(".pie_arc")
    .data(function(d,i){
      pie_arc_data = d3.map(d);
      pie_arc_data.remove("RowID");
      pie_arc_data.remove("Distillery");
      pie_arc_data.remove("Latitude");
      pie_arc_data.remove("Longitude");
      pie_arc_data.remove("Postcode");
      pie_arc_data = d3.entries(pie_arc_data);
      return pie(pie_arc_data);
    })
  .enter().append("g")
    .attr("class", "pie_arc");

  g.append("path")
    .attr("d", pie_arc)
    .style("fill", function(d) { return color(d.data.value); });

  g.append("text")
    .attr("class", "pie_label_name")
    .attr("transform", function(d) { return "translate(" + pie_arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .attr("class","arc_label")
    .style("text-anchor", "middle")
    .text(function(d) { return d.data.key ; });

  g.append("text")
    .attr("transform", function(d) { return "translate(" + pie_arc.centroid(d) + ")"; })
    .attr("dy", "1.35em")
    .attr("class","arc_label")
    .style("text-anchor", "middle")
    .text(function(d) { return d.data.value ;});

  pie_svgs.append("text")
    .attr("class","label")
    .style("text-anchor", "middle")
    .attr("dy", "0.5em")
    .text(function(d) {return d.Distillery;});
}
