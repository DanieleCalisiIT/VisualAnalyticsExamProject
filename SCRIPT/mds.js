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
        d.Low_bone_mineral_density = d.Low_bone_mineral_density;
        d.Air_pollution = +d.Air_pollution;
        d.Outdoor_air_pollution = +d.Outdoor_air_pollution;
        d.Diet_high_in_sodium = +d.Diet_high_in_sodium;
    });

    let Array_Deaths = ["Unsafe_water_source","Unsafe_sanitation","Household_air_pollution_from_solid_fuels","Child_wasting","Low_birth_weight_for_gestation",
        "Secondhand_smoke","Alcohol_use","Drug_use","Diet_low_in_fruits","Unsafe_sex","High_fasting_plasma_glucose","High_body_mass_index","High_systolic_blood_pressure",
        "Smoking","Iron_deficiency","Vitamin_A_deficiency","Low_bone_mineral_density","Air_pollution","Outdoor_air_pollution","Diet_high_in_sodium"];

    var mylist = document.getElementById("List_Deaths");
    mylist.addEventListener('change', Change_In_MDS);

    var slider = document.getElementById("Slider_Year");
    slider.addEventListener('change', Change_In_MDS);


    function Calculate_Proximity_Matrix(year,death_sel){
        var Matrix = new Array(41);

        for (var i = 0; i < Matrix.length; i++) {
            Matrix[i] = new Array(41);
        }

        //Questi supp servono poichè loro tengono memoria della posizione precedentemente salvata nella matrice
        var suppX = 0;
        

        //Adesso bisogna ciclare fissando un valore
        for( var i = 0; i < data.length; i++ ){
            if(data[i].Year == year){
                var Num_Deaths_of_Country_for_year = data[i][death_sel];
                var suppY = 0;

                for(var j=0; j < data.length;j++){
                    
                    if(data[j].Year == year){
                        var Num_Value_To_Subtract_of_another_Country =  data[j][death_sel];
                        var Proximity = Math.abs(Num_Deaths_of_Country_for_year - Num_Value_To_Subtract_of_another_Country);

                        Matrix[suppX][suppY] = Proximity;
                        suppY++;    
                    }
                }
                suppX++;
                                
            }
        }

        return Matrix

    }


    function mds_classic(distances, dimensions) {
    
        // square distances
        var M = numeric.mul(-.5, numeric.pow(distances, 2));

        // double centre the rows/columns
        function mean(A) { return numeric.div(numeric.add.apply(null, A), A.length); }
        var rowMeans = mean(M),
            colMeans = mean(numeric.transpose(M)),
            totalMean = mean(rowMeans);

        for (var i = 0; i < M.length; ++i) {
            for (var j =0; j < M[0].length; ++j) {
                M[i][j] += totalMean - rowMeans[i] - colMeans[j];
            }
        }

        // take the SVD of the double centred matrix, and return the
        // points from it
        var ret = numeric.svd(M),
            eigenValues = numeric.sqrt(ret.S);
        return ret.U.map(function(row) {
            return numeric.mul(row, eigenValues).splice(0, dimensions);
        });
    };

    
    
    
    
    
    function Change_In_MDS(){

        var death_Selected = mylist.options[mylist.selectedIndex].value;
        var year_Selected = document.getElementById("Slider_Year").value;

        var Matrix;
        Matrix = Calculate_Proximity_Matrix(year_Selected,death_Selected);

        points_data = mds_classic(Matrix,2);

        console.log(points_data)




    }

    Change_In_MDS();

});