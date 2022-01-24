d3.csv("Deaths_EU.csv").then(function(data){
    data.forEach(function(d){
        d["Country"] = d.Entity;
        d.Year = new Date(+d.Year, 0, 1); //Convert to date
        d.Unsafe_water_source = +d.Unsafe_water_source; //Convert to number

    });


    //CODE HERE
    console.log(data[0]);
});



//Width and height
var width = 500;
var height = 400;
var transform = "translate(200,100)";

let svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", transform)
                

//Define map projection
let geoJsonUrl = ''

var europeProjection = d3.geoMercator()
                            .center([ 13, 52 ])
                            .scale([ width / 1.5 ])
                            .translate([ width / 2, height / 2 ])


//Define path generator
var pathGenerator = d3.geoPath().projection(europeProjection)
geoJsonUrl = "https://gist.githubusercontent.com/spiker830/3eab0cb407031bf9f2286f98b9d0558a/raw/7edae936285e77be675366550e20f9166bed0ed5/europe_features.json"

d3.json(geoJsonUrl).then(geojson => {
    // Tell D3 to render a path for each GeoJSON feature
    svg.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", pathGenerator) // This is where the magic happens
        .attr("stroke", "grey") // Color of the lines themselves
        .attr("fill", "white") // Color uses to fill in the lines
    })
