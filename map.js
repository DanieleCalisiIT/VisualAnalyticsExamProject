d3.csv("Deaths_EU.csv").then(function(data){
    data.forEach(function(d){
        d["Country"] = d.Entity;
        d.Year = new Date(+d.Year, 0, 1); //Convert to date
        d.Unsafe_water_source = +d.Unsafe_water_source; //Convert to number
        d.Unsafe_sanitation = +d.Unsafe_sanitation;
        d.Household_air_pollution_from_solid_fuels = +d.Household_air_pollution_from_solid_fuels;
        d.Child_wasting = +d.Child_wasting;
        d.Low_birth_weight_for_gestation = +d.Low_birth_weight_for_gestation;
        d.Secondhand_smoke = +d.Secondhand_smoke;
        d.Alcohol_use = +d.Alcohol_use;
        d.Drug_use = +d.Drug_use;
        d.Diet_low_in_fruits = +d.Diet_low_in_fruits;
        d.Unsafe_sex = +d.Unsafe_sex;
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
    });

    let Array_Deaths = ["Unsafe_water_source","Unsafe_sanitation","Household_air_pollution_from_solid_fuels","Child_wasting","Low_birth_weight_for_gestation",
        "Secondhand_smoke","Alcohol_use","Drug_use","Diet_low_in_fruits","Unsafe_sex","High_fasting_plasma_glucose","High_body_mass_index","High_systolic_blood_pressure",
        "Smoking","Iron_deficiency","Vitamin_A_deficiency","Low_bone_mineral_density","Air_pollution","Outdoor_air_pollution","Diet_high_in_sodium"];
    
    function getMax(arr, prop) {
    var max;
    for (var i=0 ; i<arr.length ; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

    
    function MouseOver(event,d,death){
        var Country_name = d.properties.name
        d3.select("#Country_name").text(Country_name);
        for(var l=0; l<Array_Deaths.length ; l++){
            var H4 = '#' +  Array_Deaths[l];
            d3.select(H4)
                .text(function(d){
                    for(var i=0; i<data.length;i++){
                        if (data[i].Country == Country_name ){
                            var Death = data[i][Array_Deaths[l]]
                            return Death;
                            


                            }
                        }
                    }
                )}

    }


    //Changes based on TIMELINE and Type of Death

    var mylist = document.getElementById("List_Deaths");
    var slider = document.getElementById("Slider_Year");

    mylist.addEventListener('change', Change_In_The_Map);
    slider.addEventListener('change', Change_In_The_Map);



    
    function Change_In_The_Map(){
        d3.select("svg").remove();

        
        var death_Selected = mylist.options[mylist.selectedIndex].value;
        console.log(death_Selected)


          //Width and height
        var width = 500;
        var height = 400;
        var transform = "translate(50,100)";

        let svg = d3.select("body").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("transform", transform)
                        
                        

        //Define map projection
        let geoJsonUrl = ''

        var europeProjection = d3.geoMercator()
                                    .center([ 15, 52 ])
                                    .scale([ width / 1.5 ])
                                    .translate([ width / 1.8, height / 2 ])


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

                            var maxDeath = getMax(data, death_Selected);

                            console.log(maxDeath[death_Selected])

                            var color = d3.scaleLinear()
                                .domain([0, maxDeath[death_Selected]])
                                .range(["#ffffb2","#bd0026"]);
                            
                            return color(data[i][death_Selected]);
                        }
                    }
                
                }) 
                .on("mouseover",function(_event,d,death){
                    MouseOver(_event,d,death_Selected);
                })
            
                
            });

    }

    Change_In_The_Map();



});



