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
        d.Low_bone_mineral_density = +d.Low_bone_mineral_density; //dimenticato il piu
        d.Air_pollution = +d.Air_pollution;
        d.Outdoor_air_pollution = +d.Outdoor_air_pollution;
        d.Diet_high_in_sodium = +d.Diet_high_in_sodium;
        d.Diet_low_in_whole_grains = +d.Diet_low_in_whole_grains; //aggiunto
    });

    let Array_Deaths = ["Unsafe_water_source","Unsafe_sanitation","Household_air_pollution_from_solid_fuels","Child_wasting","Low_birth_weight_for_gestation",
        "Secondhand_smoke","Alcohol_use","Drug_use","Diet_low_in_fruits","Unsafe_sex","High_fasting_plasma_glucose","High_body_mass_index","High_systolic_blood_pressure",
        "Smoking","Iron_deficiency","Vitamin_A_deficiency","Low_bone_mineral_density","Air_pollution","Outdoor_air_pollution","Diet_high_in_sodium","Diet_low_in_whole_grains"]; //grains da togliere?
    //21
    let Countries =["Albania","Austria","Belarus","Belgium","Bosnia","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland","France",
        "Germany","Greece","Hungary","Iceland","Ireland","Italy","Latvia","Lithuania","Luxembourg","Malta","Moldova","Montenegro","Netherlands",
        "Normway","Poland","Portugal","Romania","Serbia","Slovakia","Spain","Sweden","Switzerland","Ukraine","UK","Macedonia","Hungary"];  //39


    var slider = document.getElementById("Slider_Year");
    slider.addEventListener('change', Change_In_Barchart);

    var margin = {top: 0, right: 0, bottom: 0, left: 200},
                    width = 800 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

    function NormalizeAndRetrieve(year){
        
        var RelevantValues = new Array(Countries.length);

        for (var i = 0; i < Countries.length; i++) {
            RelevantValues[i] = new Array(Array_Deaths.length + 2);  //ha nome country e year in piu
        }

        console.log(RelevantValues)

        var j = 0
        for( var i = 0; i < data.length; i++ ){
            if(data[i].Year == year){
                RelevantValues[j] = data[i]
                j++
            }
        }

        var ArrayTotals = new Array(Array_Deaths.length).fill(0);
        for( var i = 0; i < Array_Deaths.length; i++){
            for (var j = 0; j < Countries.length; j++){
                
                ArrayTotals[i] =  ArrayTotals[i] + RelevantValues[j][Array_Deaths[i]]
            }
        }

        //console.log(ArrayTotals)

        var NormalizedValues = new Array(Countries.length);

        for (var i = 0; i < Countries.length; i++) {
            NormalizedValues[i] = new Array(Array_Deaths.length);
        }
        for( var i = 0; i < Array_Deaths.length; i++){
            for (var j = 0; j < Countries.length; j++){
                NormalizedValues[j][Array_Deaths[i]] = (RelevantValues[j][Array_Deaths[i]]/ArrayTotals[i])*100
            }
        }
        //console.log(RelevantValues)
        //console.log(NormalizedValues)

        return NormalizedValues
    }

   
    

    function Change_In_Barchart(){

        var year_Selected = document.getElementById("Slider_Year").value;

        var svg = d3.select("#barchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 100])
            .range([ 0, width ]);
        svg.append("g")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleBand()
            .domain(Array_Deaths)
            .range([height, 30])
        svg.append("g")
            .call(d3.axisLeft(y).tickSizeOuter(0));

            //da completare
        var color = d3.scaleOrdinal()
            .domain(Countries)
            .range(['#e41a1c','#377eb8','#4daf4a'])

        normalized_values = NormalizeAndRetrieve(year_Selected)
        
/*
  // Normalize the data -> sum of each group must be 100!
  console.log(data)
  dataNormalized = []
  data.forEach(function(d){
    // Compute the total
    tot = 0
    for (i in subgroups){ name=subgroups[i] ; tot += +d[name] }
    // Now normalize
    for (i in subgroups){ name=subgroups[i] ; d[name] = d[name] / tot * 100}
  })

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.group); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())

        
    */    


    }

    Change_In_Barchart();
    


});