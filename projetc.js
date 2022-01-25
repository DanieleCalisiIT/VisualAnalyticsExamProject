d3.csv("Deaths_EU.csv").then(function(data){
    data.forEach(function(d){
        d["Country"] = d.Entity;
        d.Year = new Date(+d.Year, 0, 1); //Convert to date
        d.Unsafe_water_source = +d.Unsafe_water_source; //Convert to number
        d.Unsafe_sanitation = +d.Unsafe_sanitation;
        d.Household_air_pollution_from_solid_fuels = +d.Household_air_pollution_from_solid_fuels;
        d.Child_wasting = +d.Child_wasting;
        d.Child_stunting = +d.Child_stunting;
        d.Low_birth_weight_for_gestation = +d.Low_birth_weight_for_gestation;
        d.Secondhand_smoke = +d.Secondhand_smoke;
        d.Alcohol_use = +d.Alcohol_use;
        d.Drug_use = +d.Drug_use;
        d.Diet_low_in_fruits = +d.Diet_low_in_fruits;
        d.Diet_low_in_vegetables = +d.Diet_low_in_vegetables;
        d.Unsafe_sex = +d.Unsafe_sex;
        d.Low_physical_activity = +d.Low_physical_activity;
        d.High_fasting_plasma_glucose = +d.High_fasting_plasma_glucose;
        d.High_body_mass_index = +d.High_body_mass_index;
        d.High_systolic_blood_pressure = +d.High_systolic_blood_pressure;
        d.Smoking = +d.Smoking;
        d.Iron_deficiency = +d.Iron_deficiency;
        d.Vitamin_A_deficiency = +d.Vitamin_A_deficiency;
        d.Low_bone_mineral_density = d.Low_bone_mineral_density;
        d.Air_pollution = +d.Air_pollution;
        d.Outdoor_air_pollution = +d.Outdoor_air_pollution;
        d.Diet_high_in_sodium = +d.Diet_high_in_sodium;
        d.Diet_low_in_whole_grains = +d.Diet_low_in_whole_grains;
        d.Diet_low_in_nuts_and_seeds = +d.Diet_low_in_nuts_and_seeds;
    });

    //CODE HERE
    /*for(var i=0; i<data.length;i++){
        if (data[i].Country == "Italy"){
            console.log(data[i]);
        }
    }*/
    let Array_Deaths = ["Unsafe_water_source","Unsafe_sanitation"];

    var color = d3.scaleLinear()
                .domain([0, 220])
                .range(["#ffeda0","#f03b20"]);

    
    function MouseOver(event,d){
        var Country_name = d.properties.name
        d3.select("#Country_name").text(Country_name);
        for(var l=0; l<Array_Deaths.length ; l++){
            var H4 = '#' +  Array_Deaths[l];
            console.log(H4)
            d3.select(H4)
                .text(function(d){
                    for(var i=0; i<data.length;i++){
                        if (data[i].Country == Country_name ){
                            console.log(data[i].Country)
                            var Death = data[i][Array_Deaths[l]]
                            return Death;
                                

                            }
                        }
                    }
                )}

    }


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

    //define function for mouseover/mouseon


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
            
            }) 
            .on("mouseover",function(_event,d){
                MouseOver(_event,d);
            })
           
            
        });
     

});



