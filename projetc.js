d3.csv("Deaths_EU.csv").then(function(data){
    data.forEach(function(d){
        d["Country"] = d.Entity;
        d.Year = new Date(+d.Year, 0, 1); //Convert to date
        d.Unsafe_water_source = +d.Unsafe_water_source; //Convert to number

    });

    //CODE HERE
    /*for(var i=0; i<data.length;i++){
        if (data[i].Country == "Italy"){
            console.log(data[i]);
        }
    }*/


    var color = d3.scaleLinear()
                .domain([0, 220])
                .range(["#ffeda0","#f03b20"]);

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
    


    d3.json(geoJsonUrl).then(geoJson=> {
        // Tell D3 to render a path for each GeoJSON feature
        svg.selectAll("path")
            .data(geoJson.features)
            .enter()
            .append("path")
            .attr("d", pathGenerator)
            .attr("stroke", "grey") 
            .attr("fill", function(d){
                for(var i=0; i<data.length;i++){
                    if (data[i].Country == d.properties.name ){
                        return color(data[i].Unsafe_water_source);
                    }
                }
                
            });
        });

});




