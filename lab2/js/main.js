

var keyUp = false;
//Fly to your location
var goToOrigin = _.once(function(lat, lng) {
  map.flyTo([lat, lng], 14);
});

// Set colors for each polygon
var myStyle = function(feature) {
  // return {fillColor: 'red'};
switch(feature.properties.use_) {
  case 'Recreation Site': return {color: "orange", fillOpacity: 0.9, weight: 1};
  case 'Athletic': return {color: "#DC143C", fillOpacity: 0.9, weight: 1};
  case 'Recreation BLDG': return {color: "orange", fillOpacity: 0.5, weight: 1};
  case 'Boathouse': return {color: "MidnightBlue", fillOpacity: 0.5, weight: 1};
  case 'Park- Neighborhood': return {color: "green", fillOpacity: 0.9, weight: 1};
  case 'Park- Regional/Watershed': return {color: "green", fillOpacity: 0.5, weight: 1};
  case 'Park- Mini': return {color: "#006400", fillOpacity: 0.5, weight: 1, fillcolor: "green"};
  case 'Golf': return {color: "#00CED1", fillOpacity: 0.5, weight: 1};
  case 'Historic House': return {color: "yellow", fillOpacity: 0.5, weight: 0.6};
  default: return {
    color:"MidnightBlue",
    fillOpacity: 0.3,
    weight: 0.8
  };
}
};
//Importing geoJson
L.geoJson(cityLimits, {
  style: {color: "MidnightBlue", fillOpacity:0}
}).addTo(map);

L.geoJson(pprAssets, {
  style: myStyle,
}).addTo(map);

// Drawing tools
var drawControl = new L.Control.Draw({
  draw: {
    polyline: true,
    polygon: false,
    circle: true,
    marker: false,
    rectangle: true,
  }
});
 map.addControl(drawControl);



var state = {
  position: {
    marker: null,
    updated: null
  }
};

var popupContent = "You are here!";

var updatePosition = function(lat, lng, updated) {
  if (state.position.marker) { map.removeLayer(state.position.marker); }
  state.position.marker = L.circleMarker([lat, lng],
    {
      color: "red",
      radius: 10,
      clickable: true

}).bindPopup(popupContent).openPopup();
  state.position.updated = updated;
  state.position.marker.addTo(map);
  goToOrigin(lat, lng);
};

//Define global variables for current Lat and Lon
var yourLat;
var yourLon;

$(document).ready(function() {
  /* This 'if' check allows us to safely ask for the user's current position */
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      updatePosition(position.coords.latitude, position.coords.longitude, position.timestamp);
      yourLat = position.coords.latitude;
      yourLon = position.coords.longitude;

    });
  } else {
    alert("Unable to access geolocation API!");
  }
});

//Define global variables used for 1st API call
var routePoints;
var finalCoord;
var finalLat;
var finalLon;

var routing = function(dest){
  console.log(dest);
  var direction = $.ajax('https://search.mapzen.com/v1/search?api_key=mapzen-oKSP1Yt&text=' + dest + '&boundary.circle.lat=' + yourLat + '&boundary.circle.lon=' + yourLon + '&boundary.circle.radius=100');
  //retrieve the lat.long coordinates from the geoJSON
  direction.done(function(geoInfo)
  {
    finalCoord = geoInfo.features[0].geometry.coordinates;
    finalLon = geoInfo.features[0].geometry.coordinates[0];
    finalLat = geoInfo.features[0].geometry.coordinates[1];

    //mapzen costing model: https://mapzen.com/documentation/mobility/turn-by-turn/api-reference/
    routePoints =
    {
      "locations":
        [
          {"lat": yourLat, "lon": yourLon},{"lat": finalLat, "lon": finalLon}
        ],
      "costing":"bicycle",
      "directions_options":
          {"units":"miles"}
    };
    var markLat = finalLat;
    var markLon = finalLon;
    var point = [markLat, markLon];
    var dataArray = geoInfo.features[0].geometry.coordinates;
    // var marker = L.marker(point).addTo(map);
    var invisible = L.circleMarker(point,
      {
        opacity: 0,
        fillOpacity:0
    }).addTo(map);

    var latlon = dataArray.reverse();
  });
};

  /* Every time a key is lifted while typing in the #dest input, disable
   * the #calculate button if no text is in the input
   */
  $('#dest').keyup(function(e) {
    // if ($('#dest').val().length === 0) {
    //   $('#calculate').attr('disabled', true);
    // } else {
    //   $('#calculate').attr('disabled', false);
    // }
    keyUp = true;
    var dest = $('#dest').val();
    //Makes an API request and returns geo JSON
    routing(dest);
 });
//Define global variables for the 2nd API call
var bestRoute;
var bikePath;

// Make a polygon hover
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#f6ea18',
        dashArray: '',
        fillOpacity: 0.3
    });

    // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    //     layer.bringToFront();
    // }
}
// defining what happens at the mouseout
function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

var geojson;
// ... our listeners
// geojson = L.geoJson(pprAssets, {
//   style: myStyle,
// });

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

var populateSearch = function(e) {
  $('#dest').val(e.target.feature.properties.address  + " " + "Philadelphia" + " " + "PA");
};

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click:populateSearch
    });
}

geojson = L.geoJson(pprAssets, {
    style: myStyle,
    onEachFeature: onEachFeature
}).bindPopup(function (layer) {
    return ("<b>" + layer.feature.properties.label + "</b> <br>" + layer.feature.properties.description  +"<br> " + "<br>"  + "<b>ADDRESS:</b>" + " " + layer.feature.properties.address + '<br>' + '<b>USE:</b>' + " " + layer.feature.properties.use_);
  }).addTo(map);

console.log(routePoints);
$(function(){
  // click handler for the "calculate" button (probably you want to do something with this)
    $("#calculate").click(function(e) {
      var stringRoute;
      var calc;
      if(keyUp === false){
        var dest = $('#dest').val();
        console.log(dest);
        //Makes an API request and returns geo JSON
        routing(dest);
        if(routePoints){
          stringRoute = "https://matrix.mapzen.com/optimized_route?json=" + JSON.stringify(routePoints) + "&api_key=mapzen-oKSP1Yt";
          calc = $.ajax(stringRoute);
          calc.done(function(getInfo) {
            var str = getInfo.trip.legs[0].shape;
            console.log(str);
            var bikePath = decode(str);
            var bestRoute = L.polyline(bikePath, {
              color: 'red'
            }).addTo(map);
          });
        }

      }else{
        stringRoute = "https://matrix.mapzen.com/optimized_route?json=" + JSON.stringify(routePoints) + "&api_key=mapzen-oKSP1Yt";
        calc = $.ajax(stringRoute);
        calc.done(function(getInfo) {
          var str = getInfo.trip.legs[0].shape;
          var bikePath = decode(str);
          var bestRoute = L.polyline(bikePath, {
            color: 'red'
          }).addTo(map);
        });
      }


    });
});


//Buffering Syntax
// var bufferedPoint = turf.buffer(pprAssets, 1, 'miles');
// L.geoJSON(bufferedPoint).addTo(map);
// console.log(bufferedPoint);
