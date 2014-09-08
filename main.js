//  Main.js
//  Samuel Henderson, 2014-08-29
//  Contains all javascript for the NPI Census Project

// Load our Dojo modules, initialize our google map and load our Topics combobox (the other comboboxes are loaded via selection changed events)
var map, graphicsLayer;
require(["esri/map",
    "esri/layers/KMLLayer",
    "esri/geometry/Extent",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/GraphicsLayer",
    "esri/dijit/HomeButton",
    "esri/layers/FeatureLayer",
    "esri/dijit/Legend",
    "dojo/_base/array",
    "dojo/dom-style",
    "dojo/dom",
    "dojo/parser",
    "esri/graphic",
    "esri/layers/ImageParameters",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/SpatialReference",
    "dijit/form/ComboBox",
    "dojo/data/ItemFileReadStore",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer",
    "dojo/domReady!"], function (Map,
    KMLLayer,
    Extent,
    ArcGISDynamicMapServiceLayer,
    GraphicsLayer,
    HomeButton,
    FeatureLayer,
    Legend,
    arrayUtils,
    domStyle,
    dom,
    parser,
    ComboBox,
    Graphic,
    ImageParameters,
    Query,
    QueryTask,
    SpatialReference) {

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
            domstyle.set("loading", "display", "none");
        });

        //PopulateTopics();

    });

function PopulateTopics() {
    //Populate the dropdown list box with unique values

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://npi.ssmic.com/CensusDataService.asmx/GetTopics",
        data: "{}",
        async: false,
        dataType: "json",
        success: function (results) {
            console.log(results)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            //console.log(xhr.responseText);
            console.log(thrownError);
            outageMapData = [];
        }
    });
}

function PopulateVariables(results) {
    //Populate the dropdown list box with unique values

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
