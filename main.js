//  Main.js
//  Samuel Henderson, 2014-08-29
//  Contains all javascript for the NPI Census Project

// Load our Dojo modules, initialize our google map and load our Topics combobox (the other comboboxes are loaded via selection changed events)
var map, graphicsLayer;
require([
    "esri/map",
    "esri/layers/KMLLayer",
    "dojo/parser",
    "dojo/dom-style",
    "dijit/layout/BorderContainer",
    "dijit/form/ComboBox",
    "dijit/layout/ContentPane",
    "dojo/data/ItemFileReadStore",
    "dojo/domReady!"], function (
    Map,
    KMLLayer,
    parser,
    domStyle,       
    ComboBox) {

        parser.parse();

        map = new Map("map", {
            center: [-84.35, 46.533333],
            zoom: 6,
            basemap: "topo",
            logo: false,
            showAttribution: false,
            extent: new Extent({ xmin: -9402143.628480503, ymin: 5859696.671480425, xmax: -9377454.468344426, ymax: 5872767.403317172, spatialReference: { wkid: 102100} })
        });

        var kmlUrl = "https://dl.dropboxusercontent.com/u/37758746/PopulationAge_TotalPopulation_2011_CSD_TEST.kmz";
        var kml = new KMLLayer(kmlUrl);
        map.addLayer(kml);
        kml.on("load", function () {
            domStyle.set("meta", "display", "none");
        });

//        var topic;
//        var variable;
//        var year;

//        // Populate the Topics combobox and have it's Change event load the data for the variables combobox
//        PopulateTopicsComboBox();
//        var topicsBox = dijit.byId("selTopics")
//        topicsBox.on("Change", function (value) {
//            topic = value; //topic = topicsBox.store.getValue(topicsBox.item, "name")
//            PopulateVariablesComboBox(value);
//        });

//        // Have the Variables combobox Change event populate the Years combobox using the value selected from the Variables Combobox
//        // along with the value selected from the Topics ComboBox
//        var variablesBox = dijit.byId("selVariables")
//        variablesBox.on("Change", function (value) {            
//            variable = value
//            PopulateYearsComboBox(value, topic);
//        });

//        // Have the Years combobox Change event populate the Geographies combobox using the value selected from the Years Combobox,
//        // the value selected from the Variables ComboBox, and the value selected from the Topics Combobox
//        var yearsBox = dijit.byId("selYears")
//        yearsBox.on("Change", function (value) {            
//            year = value;
//            PopulateGeographiesComboBox(value, variable, topic);
//        });

    });

function PopulateTopicsComboBox() {
    //Populate the dropdown list box with unique values
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: "http://devnpicensus.cgc.local/CensusDataService.asmx/GetTopics", 
        url: "http://localhost:61056/CensusDataService.asmx/GetTopics",
        data: "{}",
        async: false,
        dataType: "json",
        success: function (results) {
            console.log(results.d)
            var allTopics = $.parseJSON(results.d).topics.split(";");
            //console.log(allTopics.length);
            var values = [];
            var testVals = {};
            dojo.forEach(allTopics, function (topic) {
                if (!testVals[topic]) {
                    testVals[topic] = true;
                    values.push({ name: topic })
                }
            });

            values.sort(compare);
            var dataItems = {
                identifier: 'name',
                label: 'name',
                items: values
            };
            var store = new dojo.data.ItemFileReadStore({ data: dataItems });
            dijit.byId("selTopics").set("store", store);            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            //console.log(xhr.responseText);
            console.log(thrownError);
            outageMapData = [];
        }
    });
}

// Populates the VariablesCombobox with data returned from AJAX call
//  value:  The topic folder to list the variable folders found within
function PopulateVariablesComboBox(value) {
    //Populate the dropdown list box with unique values
    console.log(value);
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: "http://localhost:61056/CensusDataService.asmx/GetVariables",
        url: "http://localhost:61056/CensusDataService.asmx/GetVariables",
        data: "{topic: '" + value + "'}",
        async: false,
        dataType: "json",
        success: function (results) {
            console.log(results.d)
            var allVariables = $.parseJSON(results.d).variables.split(";");
            //console.log(allVariables.length);
            var values = [];
            var testVals = {};
            dojo.forEach(allVariables, function (variable) {
                if (!testVals[variable]) {
                    testVals[variable] = true;
                    values.push({ name: variable })
                }
            });

            values.sort(compare);
            var dataItems = {
                identifier: 'name',
                label: 'name',
                items: values
            };
            var store = new dojo.data.ItemFileReadStore({ data: dataItems });
            dijit.byId("selVariables").set("store", store);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            //console.log(xhr.responseText);
            console.log(thrownError);
            outageMapData = [];
        }
    });
}

// Populates the Years Combobox with data returned from AJAX call
//  value:  The variable folder to list the year folders found within
//  topic:  The topic folder containing the variable folder we are searching in
function PopulateYearsComboBox(value, topic) {
    //Populate the dropdown list box with unique values
    console.log(value);
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: "http://localhost:61056/CensusDataService.asmx/GetYears",
        url: "http://localhost:61056/CensusDataService.asmx/GetYears",
        data: "{variable: '" + value + "', topic: '" + topic + "'}",
        async: false,
        dataType: "json",
        success: function (results) {
            console.log(results.d)
            var allYears = $.parseJSON(results.d).years.split(";");
            //console.log(allYears.length);
            var values = [];
            var testVals = {};
            dojo.forEach(allYears, function (year) {
                if (!testVals[year]) {
                    testVals[year] = true;
                    values.push({ name: year })
                }
            });

            values.sort(compare);
            var dataItems = {
                identifier: 'name',
                label: 'name',
                items: values
            };
            var store = new dojo.data.ItemFileReadStore({ data: dataItems });
            dijit.byId("selYears").set("store", store);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            //console.log(xhr.responseText);
            console.log(thrownError);
            outageMapData = [];
        }
    });
}

// Populates the Geographies Combobox with data returned from AJAX call
//  value:  The year folder to list the geography folders found within
//  variable:  The variable folder containing the year folder we are searching in
//  topic:  The topic folder containing the variable folder containing the year folder
function PopulateGeographiesComboBox(value, variable, topic) {
    //Populate the dropdown list box with unique values
    console.log(value);
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: "http://localhost:61056/CensusDataService.asmx/GetGeographies",
        url: "http://localhost:61056/CensusDataService.asmx/GetGeographies",
        data: "{year: '" + value + "', variable: '" + variable + "', topic: '" + topic + "'}",
        async: false,
        dataType: "json",
        success: function (results) {
            console.log(results.d)
            var allYears = $.parseJSON(results.d).geographies.split(";");
            //console.log(allYears.length);
            var values = [];
            var testVals = {};
            dojo.forEach(allYears, function (year) {
                if (!testVals[year]) {
                    testVals[year] = true;
                    values.push({ name: year })
                }
            });

            values.sort(compare);
            var dataItems = {
                identifier: 'name',
                label: 'name',
                items: values
            };
            var store = new dojo.data.ItemFileReadStore({ data: dataItems });
            dijit.byId("selGeographies").set("store", store);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            //console.log(xhr.responseText);
            console.log(thrownError);
            outageMapData = [];
        }
    });
}

function compare(a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase())
        return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase())
        return 1;
    return 0;
}



//$(document).ready(function () {

//});
