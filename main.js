//  Main.js
//  Samuel Henderson, 2014-08-29
//  Contains all javascript for the NPI Census Project

// This global string variable has the URL to the CensusDataService
var censusSiteUrl = "http://npi.ssmic.com/"
var censusDataServiceLocation = censusSiteUrl + "CensusDataService.asmx/"

// Load our Dojo modules, initialize our google map and load our Topics combobox (the other comboboxes are loaded via selection changed events)
var map;
require([
    "esri/map",
    "esri/geometry/Extent",
    "esri/layers/KMLLayer",
	"esri/symbols/SimpleLineSymbol",
    "esri/symbols/TextSymbol",
	"esri/symbols/SimpleMarkerSymbol",
    "esri/renderers/SimpleRenderer",
	"esri/layers/FeatureLayer",
    "esri/layers/LabelLayer",
    "esri/dijit/Legend",
	"esri/Color",
	"./src/geojsonlayer.js",

    "dojo/_base/array",
    "dojo/parser",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom",
    "dojo/_base/fx",
    "dijit/layout/BorderContainer",
    "dijit/form/ComboBox",
    "dijit/layout/ContentPane",
    "dojo/data/ItemFileReadStore",
    "dojo/domReady!"], function (
    Map,
    Extent,
    KMLLayer,
	SimpleLineSymbol,
    TextSymbol,
	SimpleMarkerSymbol,
    SimpleRenderer,
	FeatureLayer,
    LabelLayer,
    Legend,
	Color,
	GeoJsonLayer,

    arrayUtils,
    parser,
    domAttr,
    domStyle,
    dom,
    fx,
    ComboBox) {

        parser.parse();

        //FadeInLoading();
        domStyle.set("meta", "opacity", "0");

        map = new Map("map", {
            center: [-84.35, 46.533333],
            zoom: 6,
            basemap: "topo",
            logo: false,
            showAttribution: false,
            extent: new Extent({ xmin: -9402143.628480503, ymin: 5859696.671480425, xmax: -9377454.468344426, ymax: 5872767.403317172, spatialReference: { wkid: 102100} })
        });

        var topic;
        var variable;
        var year;
        var geography;

        // Populate the Topics combobox and have it's Change event load the data for the variables combobox
        PopulateTopicsComboBox();
        var topicsBox = dijit.byId("selTopics")
        topicsBox.on("Change", function (value) {
            ResetComboBox("selVariables");
            ResetComboBox("selYears");
            ResetComboBox("selGeographies");
            topic = value; //topic = topicsBox.store.getValue(topicsBox.item, "name")
            PopulateVariablesComboBox(value);
        });

        // Have the Variables combobox Change event populate the Years combobox using the value selected from the Variables Combobox
        // along with the value selected from the Topics ComboBox
        var variablesBox = dijit.byId("selVariables")
        variablesBox.on("Change", function (value) {
            ResetComboBox("selYears");
            ResetComboBox("selGeographies");
            variable = value
            PopulateYearsComboBox(value, topic);
        });

        // Have the Years combobox Change event populate the Geographies combobox using the value selected from the Years Combobox,
        // the value selected from the Variables ComboBox, and the value selected from the Topics Combobox
        var yearsBox = dijit.byId("selYears")
        yearsBox.on("Change", function (value) {
            ResetComboBox("selGeographies");
            year = value;
            PopulateGeographiesComboBox(value, variable, topic);
        });

        // Have the Geographies combobox Change event load the KMZ file and show the loading window,
        // the value selected from the Variables ComboBox, and the value selected from the Topics Combobox
        var geographiesBox = dijit.byId("selGeographies")
        geographiesBox.on("Change", function (value) {
            if (value != "Select a Geography") {
                geography = value;
                var geoKMZ = (geography == "Census Division" ? "CD" : (geography == "Census Subdivision" ? "CSD" : "CT"));
                var kmzPath = censusSiteUrl + "kmzdata/" + topic + "/" + variable + "/" + year + "/" + geography + "/"
                var kmzFileName = topic + "_" + variable + "_" + year + "_" + geoKMZ + ".kmz";
                var kmlURL = kmzPath + kmzFileName.replace(/\s/g, '');
                //LoadKMZ(encodeURI(kmlURL));
				//LoadLabels(encodeURI(kmlURL));
                //LoadKMZ("kmzdata/doc.kml");
				LoadLabels("kmzdata/doc.json");
                //LoadKMZ("http://npi.ssmic.com/kmzdata/Population%20Age/Total%20Population/2011/Census%20Subdivision/PopulationAge_TotalPopulation_2011_CSD.kmz");
                //PopulateGeographiesComboBox(value, variable, topic);
            }
        });

        function FadeInLoading() {
            domStyle.set("meta-text", "color", "#777");
            dojo.byId("meta-text").innerHTML = "Loading map data";
            domStyle.set("meta-icon", "display", "block");
            domStyle.set("meta", "opacity", 0);
            domStyle.set("meta", "display", "block");

            var fadeArgs = { node: "meta" };
            fx.fadeIn(fadeArgs).play();
        }

        function FadeOutLoading() {
            domStyle.set("meta", "opacity", "1");
            var fadeArgs = { node: "meta" };
            fx.fadeOut(fadeArgs).play();
        }
		
		//function LoadLabels(url){
		//	console.log("Attempting to load JSON: '" + url + "'");
			
		//	var geoJsonLayer = new GeoJsonLayer({
		//		url: "kmzdata/doc.json"
		//	});
			
		//	map.addLayer(geoJsonLayer);
			
		//	console.log("Added JSON Layer!");
		//	console.log("Adding label");
		//	var censusLabel = new TextSymbol().setColor("#666");
		//	censusLabel.font.setSize("14pt");
		//	censusLabel.font.setFamily("arial");
		//	censusLabelRenderer = new SimpleRenderer(censusLabel);
		//	var labels = new LabelLayer({ id: "labels" });
			// tell the label layer to label the countries feature layer 
			// using the field named "admin"
		//	labels.addFeatureLayer(geoJsonLayer, censusLabelRenderer, "{ POP2006 }");
			// add the label layer to the map
		//	map.addLayer(labels);
		//	console.log("Labels added!");
			// Add to map
			
		//}
		
		//function LoadLabels(url){
		//	console.log("Attempting to load JSON: '" + url + "'");
			
		//	var geoJsonLayer = new GeoJsonLayer({
		//		url: "kmzdata/doc.json"
		//	});
			
		//	map.addLayer(geoJsonLayer);
			
		//	console.log("Added JSON Layer!");
		//	console.log("Adding label");
		//	var censusLabel = new TextSymbol().setColor("#666");
		//	censusLabel.font.setSize("14pt");
		//	censusLabel.font.setFamily("arial");
		//	censusLabelRenderer = new SimpleRenderer(censusLabel);
		//	var labels = new LabelLayer({ id: "labels" });
			// tell the label layer to label the countries feature layer 
			// using the field named "admin"
		//	labels.addFeatureLayer(geoJsonLayer, censusLabelRenderer, "{ POP2006 }");
			// add the label layer to the map
		//	map.addLayer(labels);
		//	console.log("Labels added!");
			// Add to map
			
		//}
		
		function LoadLabels(url){
			console.log("Attempting to label JSON");
			
			var featureCollection = {
				layerDefinition: {
					"geometryType": "esriGeometryPolyline",
					"fields": [{
						"name": "OBJECTID",
						"type": "esriFieldTypeOID"
					},{
						"name": "text",
						"type": "esriFieldTypeString"
					},{
						"name": "address",
						"type": "esriFieldTypeString"
					}]
				},
				features: [{
					"attributes": {
						OBJECTID : 1, 
						text : 'TEST TEST TEST', 
						address : '538 Korah Road', 
					},
					"geometry": { "x": -84.35, "y": 46.533333 }
				}]
			};
			
			var labelField = "text";			
			var featureLayer = new esri.layers.FeatureLayer(featureCollection, {
				mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
				outfields: [labelField]
			});
			
			
			
			
			
			// create a text symbol to define the style of labels
			var statesColor = new Color("#666");
			var statesLine = new SimpleLineSymbol("solid", statesColor, 1.5);
			var statesSMS = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([0,255,0,0.25]));
			var simpleJson = {
				"type": "simple",
				"label": "",
				"description": "",
				"symbol": {
					"color": [210,105,30,191],
					"size": 6,
					"angle": 0,
					"xoffset": 0,
					"yoffset": 0,
					"type": "esriSMS",
					"style": "esriSMSCircle",
					"outline": {
						"color": [0,0,128,255],
						"width": 0,
						"type": "esriSLS",
						"style": "esriSLSSolid"
					}
				}
			}
			
			var rend = new SimpleRenderer(simpleJson);
			featureLayer.setRenderer(rend);			
			map.addLayer(featureLayer);
			console.log("logging featureLayer");
			console.log(featureLayer);
			
			
			var statesLabel = new TextSymbol().setColor(statesColor);
			statesLabel.font.setSize("14pt");
			statesLabel.font.setFamily("arial");
			statesLabelRenderer = new SimpleRenderer(statesLabel);
			var labels = new LabelLayer({ id: "labels" });
			// tell the label layer to label the countries feature layer 
			// using the field named "admin"
			labels.addFeatureLayer(featureLayer, statesLabelRenderer, "${" + labelField + "}");
			// add the label layer to the map
			
			map.addLayer(labels);
			console.log("logging labelLayer");
			console.log(labels);
			
			
			
		}

        function LoadKMZ(kmlURL) {
            console.log("Attempting to load KMZ: '" + kmlURL + "'");
            FadeInLoading();
            //var kml = new KMLLayer(kmlURL, { id: "kml" });
            var kml = new KMLLayer("http://samuelhenderson.github.io/kmzdata/doc.kml", { id: "kml" });
            kml.setOpacity(0.75);
            map.addLayer(kml);

            kml.on("load", function () {
                console.log(map.layerIds);
                FadeOutLoading();

                console.log("KMZ Loaded");

                var layers = kml.getLayers();

                console.log(layers);
                var layer = layers[1];

                // Center the KML's extent
                var kmlExtent;
                if (layer.graphics && layer.graphics.length > 0) {
                    var layerExtent = esri.graphicsExtent(layer.graphics);
                    kmlExtent = layerExtent;
                }
                map.setExtent(kmlExtent);

                // Set up Labeling
                //var censusLabel = new TextSymbol().setColor("#666");
                //censusLabel.font.setSize("14pt");
                //censusLabel.font.setFamily("arial");
                //censusLabelRenderer = new SimpleRenderer(censusLabel);
                //var labels = new LabelLayer({ id: "labels" });
                // tell the label layer to label the countries feature layer 
                // using the field named "admin"
                //labels.addFeatureLayer(layer, censusLabelRenderer, "{CSD NAME}");
                // add the label layer to the map
                //map.addLayer(labels);

                // Add Legend
                //console.log(layer);
                //                var layerInfo = { layer: layer, title: layer.name };
                //                
                //                console.log(layerInfo.length);
                //                if (layerInfo.length > 0) {
                //                    console.log("Building legend!");
                //                    var legendDijit = new Legend({
                //                        map: map,
                //                        layerInfos: layerInfo
                //                    }, "legendDiv");
                //                    legendDijit.startup();
                //                }
            });

            // Handle KML Loading Errors
            kml.on("error", function (error) {
                console.log(error);
                domStyle.set("meta-icon", "display", "none");
                domStyle.set("meta-text", "color", "red");
                dojo.byId("meta-text").innerHTML = "Error loading KML: " + error.error.message;
            });
        }

        // Resets the combox specified by comboBoxID
        function ResetComboBox(comboBoxID) {
            dijit.byId(comboBoxID).reset();
        }

    });

function PopulateTopicsComboBox() {
    //Populate the dropdown list box with unique values
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",        
        url: censusDataServiceLocation + "GetTopics",
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
        url: censusDataServiceLocation + "GetVariables",
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
        url: censusDataServiceLocation + "GetYears",
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
        url: censusDataServiceLocation + "GetGeographies",
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
