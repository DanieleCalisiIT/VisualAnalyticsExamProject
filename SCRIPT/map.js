d3.csv("DATASET/Deaths_EU.csv").then(function(data){
    data.forEach(function(d){
        d["Country"] = d.Entity;
        d.Year = +d.Year; //Convert to date
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
        d.Low_bone_mineral_density = +d.Low_bone_mineral_density;
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
    
    var mylist = document.getElementById("List_Deaths");
    var slider = document.getElementById("Slider_Year");
    var numero_Country_Brushed =  document.getElementById("number_of_Country_Selected")

    function prova(){
        console.log('prova')
    }
    

    mylist.addEventListener('change', Change_In_The_Map);
    slider.addEventListener('change', Change_In_The_Map);
    //numero_Country_Brushed.addEventListener('change', Change_In_The_Map_W_Brushed)
    

    function MouseOver(event,d,year_Selected){
        var Country_name = d.properties.name
        d3.select("#Country_name").text(Country_name);
        for(var l=0; l<Array_Deaths.length ; l++){
            var H6 = '#' +  Array_Deaths[l];
            d3.select(H6)
                .text(function(d){
                    for(var i=0; i<data.length;i++){
                        if (data[i].Country == Country_name){
                            if(data[i].Year == year_Selected){
                                var Death = data[i][Array_Deaths[l]]
                                return Math.floor(Death);
                            }

                            }
                        }
                    }
                )}

    }

    var countries_Selected = ["String_Del"]
    function Click_on_Country(event,d){
        
        if (window.event.ctrlKey) {
            //ctrl was held down during the click
            var Country_name = d.properties.name
            if(!countries_Selected.includes(Country_name)){
                countries_Selected.push(Country_name)
            }
            
            return countries_Selected

        }
        else{
            countries_Selected =["String_Del"]
            return countries_Selected
        }
    }

    

    //Changes based on TIMELINE and Type of Death

    


    function Change_In_The_Map(){

        d3.selectAll("svg").remove();

        var death_Selected = mylist.options[mylist.selectedIndex].value;
        var year_Selected = document.getElementById("Slider_Year").value;


        //Width and height
        var width = 500;
        var height = 400;
        viewbox = "0 0 450 400"
        var transform = "translate(-50,0)";

        let svg = d3.select("#map")
                        .append("svg")
                        .style("position", "absolute")
                        .attr("viewBox",viewbox)
                        .attr("preserveAspectRatio","xMinYMin meet")
                        /*.attr("width", width)
                        .attr("height", height)
                        .attr("transform", transform)*/




        var legendWidth = 100
        var legendHeight = 200
        let svgLegend = d3.select("#map")
                .append("svg")
                .attr("id", "mapcolorlegendSVG")
                .attr("width", legendWidth)
                .attr("height", legendHeight);

        svgLegend.append("text").attr("x", 0).attr("y", 10).text("MAP COLOR LEGEND").style("font-size", "10px").style("font-family", "American Typewriter, serif")
            
                        

        //Define map projection
        let geoJsonUrl = ''

        var europeProjection = d3.geoMercator()
                                    .center([ 15, 52 ])
                                    .scale([ width/1.3 ])
                                    .translate([ width / 1.9, height / 2 ])


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
                .attr("fill", function(d){
                    for(var i=0; i<data.length;i++){
                        if (data[i].Country == d.properties.name ){
                            if (data[i].Year == year_Selected ){
                                var maxDeath = getMax(data, death_Selected);

                                var color = d3.scaleLinear()
                                    .domain([0, maxDeath[death_Selected]])
                                    .range(["#ffffb2","#bd0026"]);
                                
                                return color(data[i][death_Selected]);

                            }

                        }
                    }
                
                })
                .attr("id_Country",function(d){
                    return d.properties.name
                })

                .style("stroke", "grey") 
                
                .on("mouseover",function(_event,d){
                    MouseOver(_event,d,year_Selected);
                })

                .on("click",function(_event,d){
                    Countries_sel = Click_on_Country(_event,d)
                    d3.selectAll("hidden").remove();
                    d3.select("body")
                            .data(Countries_sel)
                            //Questo .enter cicla sugli elementi in data
                            .enter()
                            .append("hidden")
                            .attr("id",function(d){
                                for(var i=0;i<Countries_sel.length;i++){
                                    if(d==Countries_sel[i]){
                                        return "Selected_Country_" + i
                                    }
                                }
                            })
                            .attr("value",function(d){
                                    return d
                            })
                    var Variable_of_Number_Country_Sel = document.getElementById("number_of_Country_Selected");
                    Variable_of_Number_Country_Sel.setAttribute("value", Countries_sel.length-1);
                    Variable_of_Number_Country_Sel.onchange()
                    
                })                
            
                
            });

    }

    Change_In_The_Map();



});


function Stroke_Country_map(){

    var numero_Country_Brushed =  document.getElementById("number_of_Country_Selected").value
    var map = document.getElementById("map")
    var map_svg = map.getElementsByTagName("path")

    if (numero_Country_Brushed > 0){
        for (let i=0; i < map_svg.length; i++){
            for(let l=1; l<=numero_Country_Brushed;l++){
                var base = "Selected_Country_"
                var id_country = base.concat(l)
                country_parsed = document.getElementById(id_country).getAttribute("value")
                if(map_svg[i].getAttribute("id_Country") === country_parsed){
                    map_svg[i].style["stroke-width"]="3"
                    map_svg[i].style["stroke"] = "blue"
                }
            }
        }

    }
    else{
        for (let i=0; i < map_svg.length; i++){
            map_svg[i].style["stroke-width"]="1"
            map_svg[i].style["stroke"] = "grey"
        }
    }
    
}



