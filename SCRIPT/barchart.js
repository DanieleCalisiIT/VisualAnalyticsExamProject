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
        "Germany","Greece","Hungary","Iceland","Ireland","Italy","Latvia","Lithuania","Luxembourg","Macedonia","Malta","Moldova","Montenegro","Netherlands",
        "Normway","Poland","Portugal","Romania","Serbia","Slovakia","Spain","Sweden","Switzerland","UK","Ukraine"];  //38  //macedonia e UK messe bene  (hungary doppia rimossa)

    var SelectedCountries = ["Albania","Ireland","Italy","Ukraine"]   //è quello che mi arriva dalle checkbox
    SelectedCountries.sort() //nel caso non lo fosse

    var ColorsParallel = ["#009179","#008291","#005B91","#003491","#000E91","#000091","#1E0091","#450091","#6B0091","#8F0090","#90006D","#900049","#900026","#8F0004","#8F1800",
                  "#8E3B00","#8E5E01","#8E7F03", "#7B8D04", "#5B8D06","#3C8C08","#499112","#56951C","#629A26","#6D9F31","#79A43B","#83A845","#8EAD4F","#98B259","#A1B663",
                    "#ABBB6D","#B3C077","#BCC582","#C3C98C","#CBCE96","#D2D3A0","#D7D7AA","#DCDAB4"]  //38 tolti ultimi 3

    var ColorsTest = ['#F44336','#FFEBEE','#FFCDD2','#EF9A9A','#E57373','#EF5350','#F44336','#E53935','#D32F2F','#C62828','#B71C1C','#FF8A80','#FF5252','#FF1744','#D50000','#E91E63',
    '#FCE4EC','#F8BBD0','#F48FB1','#F06292','#EC407A','#E91E63','#D81B60','#C2185B','#AD1457','#880E4F','#FF80AB','#FF4081','#F50057','#C51162','#9C27B0','#F3E5F5','#E1BEE7',
    '#CE93D8','#BA68C8','#AB47BC','#9C27B0','#8E24AA'] //38


    var slider = document.getElementById("Slider_Year");
    slider.addEventListener('change', Change_In_Barchart);

    var margin = {top: 0, right: 20, bottom: 0, left: 200},
                    width = 800 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

    function isCountrySelected(c){
        for(var i = 0; i < SelectedCountries.length; i++){
            if(c == SelectedCountries[i])
                return true
        }
        return false
    }

    function NormalizeAndRetrieve(year){
        
        var RelevantValues = new Array(SelectedCountries.length);

        for (var i = 0; i < SelectedCountries.length; i++) {
            RelevantValues[i] = new Array(Array_Deaths.length + 2);  //ha nome country e year in piu
        }
        
        

        var j = 0
        for( var i = 0; i < data.length; i++ ){
            if(data[i].Year == year && isCountrySelected(data[i].Country)){
                RelevantValues[j] = data[i]
                j++
            }
        }

        //console.log(RelevantValues)
        
        var ArrayTotals = new Array(Array_Deaths.length).fill(0);
        for( var i = 0; i < Array_Deaths.length; i++){
            for (var j = 0; j < SelectedCountries.length; j++){
                
                if (RelevantValues[j][Array_Deaths[i]] > 0){
                    ArrayTotals[i] =  ArrayTotals[i] + RelevantValues[j][Array_Deaths[i]]
                }
                //else non agg nulla
            }
        }

        //console.log(ArrayTotals)

        //relevant values è una matrice CountryXMorte, io devo passare a MorteXCountry, oltre a normalizzare

        var NormalizedValues = new Array(Array_Deaths.length);

        var sum = 0
        for( var i = 0; i < Array_Deaths.length; i++){
            NormalizedValues[i] = new Array(SelectedCountries.length); 
            sum = 0
            for (var j = 0; j < SelectedCountries.length; j++){
                if (RelevantValues[j][Array_Deaths[i]] >= 0){
                    NormalizedValues[i][SelectedCountries[j]] = (RelevantValues[j][Array_Deaths[i]]/ArrayTotals[i])*100   //il normalized avrà le countries in ordine alfabetico
                }
                else{
                    NormalizedValues[i][SelectedCountries[j]] = 0.0
                }
                sum += NormalizedValues[i][SelectedCountries[j]]
            }
            //console.log(sum)
        }
        
        //console.log(NormalizedValues)

        return NormalizedValues
    }

   
    

    function Change_In_Barchart(){

        //d3.selectAll("svg").remove();

        let year_Selected = document.getElementById("Slider_Year").value;

        var svg = d3.select("#barchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")"); //cos'è

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

            
        var color = d3.scaleOrdinal()
            .domain(Countries)  //non selectedCountries
            .range(ColorsTest)

        normalized_values = NormalizeAndRetrieve(year_Selected)

        //console.log(normalized_values)

        //groups = cause morte
        //subgroups = countries

        var stackGen = d3.stack().keys(SelectedCountries)
        var stackedData = stackGen(normalized_values)

        var deathNum = -1
        var currentCountry = ""
        
        //console.log(stackedData)

        svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .enter().append("g")  //loop
                .attr("fill", function(d) { 
                    currentCountry = d.key  //d è array di stack di una Nazione
                    return color(currentCountry); })    
                .selectAll("rect")
                .data(function(d) {  return d; }) 
                .enter().append("rect")  //loop  //entra nell' array di una Nazione
                    .attr("x", function(d) { 
                        //console.log(d[0]) //originale (fino a 100 o meno)
                        //console.log(x(d[0])) //scalato con width
                        return x(d[0]); })  //d riguarda valori di una morte per quella Nazione
                    .attr("y", function(d) { 
                        if (deathNum == Array_Deaths.length - 1){
                            deathNum = -1
                        }
                        deathNum++;
                        return y(Array_Deaths[deathNum]); })
                    //qui potrei metterci attrib relativi alla sua country e sua morte (per hover)
                    .attr("height",y.bandwidth()-5)  //qui decidi spessore righe
                    .attr("width", function(d) { return x(d[1]) - x(d[0]); })

    }

    Change_In_Barchart();
    


});