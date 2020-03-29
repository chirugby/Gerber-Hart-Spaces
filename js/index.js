
var cartodbSqlBase = 'https://zingbot.cartodb.com/api/v2/sql?q=',
    cartodbSqlBaseTours = 'https://zingbot.cartodb.com/api/v2/sql',
    //outgoingTable = 'outgoing_masterv2';
    outgoingTable = 'outgoinggsync0908';

// Store state of the current tour
var tourLine =[];
var tourMarkers = [];

var seq,
    story,
    tourMarkersLayer,
    tourLinesLayer;

var disabledStyle = {
    color: '#854EDE',
    fillColor: "#854EDE",
    radius: 6,
    weight: 0,
    fillOpacity: 0.5
};
var enabledStyle = {
    radius: 10,
    fillOpacity: 0.8
};
var lineStyle = {
    color: "#854EDE",
    weight: 3,
    opacity: .5,
    smoothFactor: 1,
    dashArray: '4,8',
    clickable: false
};

// $.getJSON(cartodbSqlBase + 'SELECT *, ST_X(the_geom) AS lng, ST_Y(the_geom) AS lat FROM ' + outgoingTable, function(data) { //get all table elements from      CartoDB

//Not actually adding the tours to the list yet. ISSUE
// function addAvailableTours() {
//     $.getJSON(cartodbSqlBase + 'SELECT DISTINCT tour_name, city FROM outgoingtours', function (data) {
//         $.each(data.rows, function () {
//             var $opt = $('<option></option>')
//                 .data(this)
//                 .text(this.city + ', ' + this.tour_name);
//             $('.tour-picker').append($opt);
//         });
//     });
// }

// function tourNext() {
//     seq.next();
// }

// function tourPrev() {
//     seq.prev();
// }

// function tourFinish(map, continuing) {
//     // Clean up tour state
//     if (tourMarkersLayer) {
//         tourMarkersLayer.clearLayers();
//         map.removeLayer(tourMarkersLayer);
//     }
//     if (tourLinesLayer) {
//         tourLinesLayer.clearLayers();
//         map.removeLayer(tourLinesLayer);
//     }
//     if (story) {
//         story.clear();
//     }
//     map.closePopup();

//     if (!continuing) {
//         $('.tour-picker-help').hide();
//     }
// }

// function tourInit(map, city, name) {
//     $('.tour-picker-help').show();
//     tourFinish(map, true);
//     seq = O.Sequential();
//     story = O.Story();

//     O.Keys().left().then(seq.prev, seq)
//     O.Keys().right().then(seq.next, seq)

//     // fetch data from a geojson file
//     var sqlProtestName = name.replace(/'/g, "''")
//     var url = cartodbSqlBaseTours + '?' + $.param({
//         format: 'GeoJSON',
//         q: "SELECT * FROM outgoingtours WHERE city = '" + city + "' AND tour_name = '" + sqlProtestName + "'"
//     });
//     $.getJSON(url, null, function(data) {
//       console.log('hello');
//         tourMarkersLayer = L.layerGroup([]).addTo(map);
//         tourLinesLayer = L.layerGroup([]).addTo(map);
//         var linesLayers = {};

//         var timeGroups = _.groupBy(data.features, function (feature) {
//             return moment(feature.properties.time, 'MM/DD/YYYY HH:mm:ss');
//         });

//         var groupEndPoints = {};

//         var sortedTimes = _.sortBy(_.keys(timeGroups), function (time) {
//             return moment(new Date(time)).toISOString();
//         });
//         $.each(sortedTimes, function (i, time) {
//             var features = timeGroups[time],
//                 geom = turf.featurecollection(features);
//             var lines = [];

//             // Add markers
//             var pos = turf.centroid(geom),
//                 latlng = [pos.geometry.coordinates[1], pos.geometry.coordinates[0]];

//             var layer = L.geoJson(geom, {
//                 style: disabledStyle,
//                 pointToLayer: function (feature, latlng) {
//                     return L.circleMarker(latlng);
//                 }
//             });
//             tourMarkersLayer.addLayer(layer);

//             // Add lines
//             $.each(features, function (i, point) {
//                 var origin = groupEndPoints[point.properties.start_group];
//                 if (origin) {
//                     lines.push([origin, point.geometry.coordinates]);
//                 }
//             });

//             // Update groupEndPoints
//             $.each(features, function (i, point) {
//                 groupEndPoints[point.properties.end_group] = point.geometry.coordinates;
//             });

//             if (lines.length) {
//                 var linesGeom = {
//                     type: 'Feature',
//                     geometry: {
//                         type: 'MultiLineString',
//                         coordinates: lines
//                     },
//                     properties: {
//                         time: time
//                     }
//                 };
//                 var linesLayer = L.geoJson(linesGeom, {
//                     style: lineStyle
//                 });
//                 linesLayers[time] = linesLayer;
//             }

//             var content = _.map(geom.features, function (feature)
//                 { return feature.properties.location; })
//                 .join(', ');

//             var action = O.Step(
//                 O.Action(function () {
//                     // Set everything else to disabled
//                     tourMarkersLayer.eachLayer(function (layer) {
//                         layer.setStyle(disabledStyle);
//                     });

//                     // Set the current layer to enabled
//                     layer.setStyle(enabledStyle);
//                 }),
//                 O.Action(function () {
//                     var displayedDate = moment(new Date(time));
//                     tourLinesLayer.eachLayer(function (layer) {
//                         var layerDate = new Date(layer.getLayers()[0].feature.properties.time);

//                         // Remove layers that come after the current time
//                         if (displayedDate.diff(layerDate) < 0) {
//                             tourLinesLayer.removeLayer(layer);
//                         }
//                     });
//                     if (linesLayers[time]) {
//                         tourLinesLayer.addLayer(linesLayers[time]);
//                     }
//                 }),
//                 O.Action(function () {
//                     map.setView(latlng, 12);
//                 }),
//                 O.Action(function () {
//                     var offset = [100, 0],
//                         position = 'right';
//                     if (L.Browser.mobile) {
//                         offset = [0, 100];
//                         position = 'center';
//                     }
//                     var popup = new L.DirectionalPopup({
//                         closeButton: true,
//                         className: 'odyssey-popup-lateral',
//                         offset: offset,
//                         position: position
//                     })
//                         .setLatLng(latlng)
//                         .setContent("<div id='protestTour'><div id='protestTourLocation'>" + content + "</div><p><button type='button' class='btn-tour' onclick='tourFinish(map)'>End Tour</button><button type='button' class='btn-tour btn-tour-next' onclick='tourNext()'>&rarr;Next</button><button type='button' class='btn-tour btn-tour-prev' onclick='tourPrev()'>&larr; Previous</button></p></div>")

//                     map.openPopup(popup)
//                 })
//             );
//             story.addState(seq.step(i), action)
//         });

//         story.go(0);
//     });
// }




///End tour


  // Constants
var global_data2; //for testing


//SQL_API_TABLE_SECONDARY = '';
var sublayers = [];
var layerSource = {
    user_name: 'zingbot',
    type: 'cartodb',
    sublayers: [{
        sql: "SELECT * FROM " + outgoingTable,
        cartocss: '#outgoinggdrivesync{ marker-fill:#bababa;[audience="lesbian"]{marker-fill: #000;}}',
        infowindow: false
    }]
}

var locCircle;
var layerUrl =
    'https://zingbot.cartodb.com/api/v2/viz/84236048-b8ca-11e4-8e46-0e0c41326911/viz.json';
var sublayer;
var map;

    //get url parameters in bar from Stack Overflow http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
var urlParams;
var url_loc;

(window.onpopstate = function () { //get url parameters expecting CartoDB ID ("id") but all values will be parsed
var match,
    pl     = /\+/g,  // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    query  = window.location.search.substring(1);

urlParams = {};
    while (match = search.exec(query))
    urlParams[decode(match[1])] = decode(match[2]);
    })(); //end getting the url parameter in the string

$.getJSON(cartodbSqlBase + 'SELECT *, ST_X(the_geom) AS lng2, ST_Y(the_geom) AS lat2 FROM ' + outgoingTable, function(data) { //get all table elements from      CartoDB
$.each(data.rows, function(key, val) {
    locations[val.cartodb_id] = val; //add each location to locations object
    });
    if (locations[urlParams.id] != undefined){ //check for valid cartodb id in  url parameter
    url_loc = urlParams.id; // if the url parameter is a valid cartodb id, assign to url_loc
    }
    init(); // draw the map
    }); //end getJSON


function draw_infobox(data){ //function to take in the values and display these in the infobox
var genre2, genre, pub_desc, year_closed, cartodb_id, audience_2; //placeholder values
    // global_data2 = data; // push into global scope for debugging

    // validate values for display
    if (data.hasOwnProperty('genre') && data.genre != null) {
        genre = data.genre;
    } else {
        genre = '';
    };
    if (data.hasOwnProperty('genre2') && data.genre2 != null){
        genre2 = data.genre2;
      } else {
        genre2 = '';
      };
    if (data.hasOwnProperty('pub_desc') && data.pub_desc != null){
        pub_desc = data.pub_desc;
      } else {
        pub_desc = '';
      };
    if (data.hasOwnProperty('year_closed') && data.year_closed != null){
        year_closed = 'c. ' + data.year_closed;
      } else {
        year_closed = 'present';
      };

      if (data.hasOwnProperty('audience_2') && data.audience_2 != null){
        audience_2 = ', ' + data.audience_2;
      } else {
        audience_2 = '';
      };

      if (data.hasOwnProperty('location') && data.location != null){
        streetAddress = data.location;
      } else {
        streetAddress = '';
      };


      // end value validation

      // display values in the info box
// $("#infoBar").html("<div id='infoBlockName'><li id='infoBarAudience'>" + data.audience + " > " + genre2 +" "+ genre +"</li><p id='infoBarName'>" + data.name + "</p><p id='infoBarOpened'>c. " + data.year_opened + " - " + year_closed + "</p><p id = 'infoBarAddress'>" + streetAddress + "</p></div><div id='infoBarAction'><ul><li><a id='infoBarEdit' href='https://bit.ly/outgoingform' target='_blank'><i class='fa fa-pencil-square fa-2x' alt='Edit'></i></a></li><li><a id='infoBarShare' href='https://outgoingnyc.com/?id=" + data.cartodb_id +" 'target='_blank'><i class='fa fa fa-share-alt-square fa-2x' alt='Share link'></i></a></li><li><a id='infoBarTwitter' href='https://twitter.com/intent/tweet?source=webclient&text=I+found+" + data.name +"+on+https://outgoingnyc.com' target='_blank'><i class='fa fa-twitter-square fa-2x' alt='Tweet This Spot'> </i></a></li></ul></div><div id='infoBarRight'><p id='infoBarPubNotes'> " + pub_desc + "</p></div>");

$("#infoBar").html("<ul id='infoList'><li id='infoBarAudience'>" + data.audience + " | " + genre2 +" "+ genre +"</li><li id='infoBarName'>" + data.name + "</li><li id='infoBarOpened'>c. " + data.year_opened + " - " + year_closed + "</li><li id = 'infoBarAddress'>" + streetAddress + "</li><li id='infoBarPubNotes'> " + pub_desc + "</li></ul><div id='infoBarAction'><ul><li><a id='infoBarEdit' href='https://bit.ly/outgoingform' target='_blank'><i class='fa fa-pencil-square fa-2x' alt='Edit'></i></a></li><li><a id='infoBarShare' href='https://outgoingnyc.com/?id=" + data.cartodb_id +" 'target='_blank'><i class='fa fa fa-share-alt-square fa-2x' alt='Share link'></i></a></li><li><a id='infoBarTwitter' href='https://twitter.com/intent/tweet?source=webclient&text=I+found+" + data.name +"+on+https://outgoingnyc.com' target='_blank'><i class='fa fa-twitter-square fa-2x' alt='Tweet This Spot'> </i></a></li></ul></div><div id='infoBarRight'></div>");

    }; //end function draw_infobox

//stats addition. This is broken at the moment.
function addStats() {
    $.getJSON(cartodbSqlBase + 'SELECT count(*) FROM "' + outgoingTable + '"', function (data) {
        $.each(data.rows, function () {
            var $opt = $('<option></option>')
                .data(this)
                .text(this.city + ', ' + this.tour_name);
            $('.statWrapper').append($opt);
        });
    });
}
    function init(){

      // initiate leaflet map
      var loc_lat,loc_lng,zoom_level;
      if (url_loc){
        loc_lat = locations[url_loc].latitude;
        loc_lng = locations[url_loc].longitude;
        zoom_level = 18;
        draw_infobox(locations[url_loc]);

      } // end if


      map = new L.Map('cartodb-map', {
          center: [ loc_lat || 40.727760, loc_lng || -73.987218 ], //New York City
          maxZoom: 20,
          zoom: zoom_level || 12,
          zoomControl: true,
          keyboard: false
      }) //end map

      if (url_loc){
      if (locCircle) {
          map.removeLayer(locCircle);
          }
        locCircle = new L.CircleMarker([loc_lat,loc_lng],{
          stroke: true,
          color: 'red',
          fillColor:   "red",
          weight: 1,
          opacity: .1,
          radius:      10,
          fillOpacity: 0.1,
            })
        .addTo(map);
        }

      L.tileLayer('https://api.mapbox.com/styles/v1/zingbot/cj2hh1owt00092spkskvyqpyg/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemluZ2JvdCIsImEiOiJJU1NqTEdrIn0.hzY0M7fDqT5nMAgCffDCbg', {maxZoom: 21, attribution: '<a href="hhttps://www.mapbox.com/about/maps/">© Mapbox © OpenStreetMap</a>'
      })
        .addTo(map);

//GEOLOCATION INITIATION
        L.control.locate({
          position: 'topleft',  // set the location of the control
          drawCircle: true,  // controls whether a circle is drawn that shows the uncertainty about the location
          follow: false,  // follow the user's location
          setView: true, // automatically sets the map view to the user's location, enabled if `follow` is true
          stopFollowingOnDrag: false, // stop following when the map is dragged if `follow` is true (deprecated, see below)
          remainActive: false, // if true locate control remains active on click even if the user's location is in view.
          markerClass: L.circleMarker, // L.circleMarker or L.marker
          circleStyle: {
            },  // change the style of the circle around the user's location
          markerStyle: {},
          followCircleStyle: {},  // set difference for the style of the circle around the user's location while following
          followMarkerStyle: {},
          icon: 'fa fa-crosshairs',  // class for icon, fa-location-arrow or fa-map-marker
          iconLoading: 'fa fa-spinner fa-spin',  // class for loading icon
          circlePadding: [0, 0], // padding around accuracy circle, value is passed to setBounds
    onLocationError: function(err) {alert(err.message)},  // define an error callback function
    onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries
            alert(context.options.strings.outsideMapBoundsMsg);
    },
    showPopup: true, // display a popup when the user click on the inner marker
    strings: {
        title: "Show me where I am",  // title of the locate control
        metersUnit: "meters", // string for metric units
        feetUnit: "feet", // string for imperial units
        popup: "You are within {distance} {unit} from this point",  // text to appear if user clicks on circle
        outsideMapBoundsMsg: "You seem located outside the boundaries of the map" // default message for onLocationOutsideMapBounds
    },
    locateOptions: {
                maxZoom: 16,

    }  // define location options e.g enableHighAccuracy: true or maxZoom: 10
}).addTo(map);


//WALKING TOUR INITIATION
//Walking Tour One start
// L.marker([40.729568,-74.012704]).addTo(map).on('click', function(e) {
// tourInit(map, 'data/my_places.geojson')
// });
// Walking Tour Two start
// L.marker([40.727568,-74.017704]).addTo(map).on('click', function(e) {
// tourInit(map, 'data/my_places.geojson')
// });
// Walking Tour Three start


       // vis-only layer
       // cartodb.createLayer(map, layerUrl)
       //  .addTo(map)
       //  .on('done', function(layer) {
       //   var sublayer = layer.getSubLayer(2);

      // SQL-active layer
      cartodb.createLayer(map, layerSource, { https:true})    
        .addTo(map)
        .done(function(layer) {
          layer.setInteraction(true);
          layer.on('error', function(err) {
              console.log('error: ' + err);

            });


        var subLayerOptions = {
          sql: "SELECT * FROM " + outgoingTable,
          cartocss: $("#markerStyle").text(),
          interactivity: 'year_opened, cartodb_id, name, year_closed, audience, audience_2, audience, genre, genre2, source, pub_desc, location',
          infowindow: true
          } //end subLayerOptions

        sublayer = layer.getSubLayer(0);
        sublayer.set(subLayerOptions);
        sublayers.push(sublayer);

        sublayer.on('featureClick', function(e, latlng, pos, data) {
          ga('send', 'event', 'pop up', 'load', data.name);
          draw_infobox(data);
          loc_lat = locations[data.cartodb_id].latitude;
          loc_lng = locations[data.cartodb_id].longitude;
         if (locCircle) {
          map.removeLayer(locCircle);
          }

          locCircle = new L.CircleMarker([loc_lat,loc_lng],{stroke: true,
            fillColor:   "white",
            color: "white",
            weight: 2,
            opacity: 1,
            radius: 14,
            fillOpacity: 0,
            dashArray: "4,4",
            }).addTo(map);
            });
        //end sublayer.on

        sublayer.on('featureOver', function(e, latlng, pos, data, layerNumber) {

            cartodb.log.log(pos);
              $("#hoverWindow").css(
                {'display':'block',
                  'left':pos.x+10,
                  'bottom':($(window).height()-pos.y-10),
                  'cursor': 'pointer'
                });
              $("#hoverWindow")
                  .text(data.name);
          });

        sublayer.on('featureOut', function(e,latlng, pos, data, layerNumber)
         {
              $("#hoverWindow").css({'display':'none'});
          });


        var LayerActions = {
          mixed: function(){
            sublayers[0].setSQL("SELECT * FROM " + outgoingTable + " WHERE audience = 'Mixed'");
              return true;
          },
          gaymen: function(){
            sublayers[0].setSQL("SELECT * FROM " + outgoingTable + " WHERE audience = 'Gay'");
              return true;
          },
          lesbian: function(){
            sublayers[0].setSQL("SELECT * FROM " + outgoingTable + " WHERE audience = 'Lesbian'");
              return true;
            },
          bar: function(){
            sublayers[0].setSQL("SELECT * FROM " + outgoingTable + " WHERE genre ='Bar'");
            return true;
          },
          dance: function(){
            sublayers[0].setSQL("SELECT * FROM " + outgoingTable + " WHERE genre2 ='Dance'");
            return true;
          },
          bathhouse: function(){
            sublayers[0].setSQL("SELECT * FROM " + outgoingTable + " WHERE genre ='Bathhouse'");
            return true;
          },
          cafe: function(){
            sublayers[0].setSQL("SELECT * FROM " + outgoingTable + " WHERE genre ='Cafe'");
            return true;
          }

        }//end var LayerActions

        //button work
        $('.button').click(function() {
          $('.button').removeClass('selected');
          $(this).addClass('selected');
          LayerActions[$(this).attr('id')]();
          }); //end button click
        $('#geoLocate').click(function(){
           map.locate({setView: true, maxZoom: 16});
        });
        });
      }//end init

      function setSubLayer(dateMin,dateMax) {
            sublayers[0].setSQL("SELECT * FROM " + outgoingTable + " WHERE (year_closed >= " + dateMin + " OR year_closed IS NULL) AND year_opened <= " + dateMax);
            return true;
          }; //end function setSubLayer

      function searchbox(){
          var text = document.getElementById("search-box");
          // console.log(text.value);
          sublayers[0].setSQL("SELECT * FROM " + outgoingTable + " WHERE name ILIKE '%" + text.value + "%'");
          return true;
          ga('send', 'event', 'search', 'load', text.value);
        }; //end searchbox()

      function reset(){ //reset the display to all locations on the map
        document.getElementById("search-box").value = '';
        sublayers[0].setSQL("SELECT * FROM " + outgoingTable);
        return true;
      };

    var locations = {}; //JS object to contain all items in the table (used to lookup the url parameter)

// $(document).ready(function () {
//     addAvailableTours();
//     $('.tour-picker').on('change', function () {
//         var data = $(this).find(':selected').data();
//         if (data.city && data.tour_name) {
//             tourInit(map, data.city, data.tour_name);
//         }
//         else {
//             tourFinish(map);
//         }
//     });
// });

    //Google Analytics code
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-38175372-4', 'auto');
      ga('send', 'pageview');


//     setTimeout(function(){var a=document.createElement("script");
// var b=document.getElementsByTagName("script")[0];
// a.src=document.location.protocol+"//script.crazyegg.com/pages/scripts/0035/3700.js?"+Math.floor(new Date().getTime()/3600000);
// a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)}, 1);





