window.onload = function () {

  L.popup({className: 'intro-popup'})
    .setLatLng([33.7540521,-84.4237409])
    .setContent('' +
      'This is a map of metro Atlanta early voting<br>' +
      'locations. On the right side of the screen,<br>' +
      'you can select the county in which you are<br>' + 
      'registered to vote. Once you have selected<br>' + 
      'your county, you can click on the locations<br>' + 
      'to see their times and addresses. You can<br>' +
      'vote early at any location in your own<br>' +
      'county. No reason is required to vote early. ')
    .openOn(map);

  var pollingIcon = L.AwesomeMarkers.icon({
    icon: 'check-square-o',
    prefix: 'fa',
    markerColor: 'red'
  });

  // Advance Voting Polling Places

  function onEachPolling(feature, layer) {
    layer.bindPopup("<b>" + feature.properties.County + " County" +
      "</b><br>" + feature.properties.Location +
      "<br>" + feature.properties.Address +
      "<br>" + feature.properties.City +
      "<br><br><b>Oct. 13-17:</b> " + feature.properties.Oct13to17 +
      "<br><b>Oct. 20-24:</b> " + feature.properties.Oct20to24 +
      "<br><b>Oct. 27-31:</b> " + feature.properties.Oct27to31 +
      "<br><b>Sat. Oct. 18:</b> " + feature.properties.Oct18 +
      "<br><b>Sun. Oct. 19:</b> " + feature.properties.Oct19 +
      "<br><b>Sat. Oct. 25:</b> " + feature.properties.Oct25 +
      "<br><b>Sun. Oct. 26:</b> " + feature.properties.Oct26);
  };

  function createCountyLayer(county) {
    return L.geoJson(polling, {
      filter: function(feature, latlng) {
        switch (feature.properties.County) {
          case county: return true;
          default: return false;
        };
      },
      onEachFeature: onEachPolling,
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {icon: pollingIcon});
      }
    });
  };

  var barrowLayer = createCountyLayer("Barrow");
  var bartowLayer = createCountyLayer("Bartow");
  var carrollLayer = createCountyLayer("Carroll");
  var cherokeeLayer = createCountyLayer("Cherokee");
  var claytonLayer = createCountyLayer("Clayton");
  var cobbLayer = createCountyLayer("Cobb");
  var cowetaLayer = createCountyLayer("Coweta");
  var dekalbLayer = createCountyLayer("DeKalb");
  var douglasLayer = createCountyLayer("Douglas");
  var fayetteLayer = createCountyLayer("Fayette");
  var forsythLayer = createCountyLayer("Forsyth");
  var fultonLayer = createCountyLayer("Fulton").addTo(map);
  var gwinnettLayer = createCountyLayer("Gwinnett");
  var hallLayer = createCountyLayer("Hall");
  var henryLayer = createCountyLayer("Henry");
  var newtonLayer = createCountyLayer("Newton");
  var pauldingLayer = createCountyLayer("Paulding");
  var rockdaleLayer = createCountyLayer("Rockdale");
  var spaldingLayer = createCountyLayer("Spalding");
  var waltonLayer = createCountyLayer("Walton");

  // map

  L.control.attribution({position: 'bottomleft'}).addTo(map);

  L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    attribution: 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" /><br>' +
    'Made for <a href="http://www.codeforatlanta.org/"><img src="images/code-for-atlanta.png" height=70></a> by <a href="http://proximityviz.com/"><img src="images/prox-small.png"></a>',
    maxZoom: 18
  }).addTo(map);

  var counties = {
    "Barrow": barrowLayer,
    "Bartow": bartowLayer,
    "Carroll": carrollLayer,
    "Cherokee": cherokeeLayer,
    "Clayton": claytonLayer,
    "Cobb": cobbLayer,
    "Coweta": cowetaLayer,
    "DeKalb": dekalbLayer,
    "Douglas": douglasLayer,
    "Fayette": fayetteLayer,
    "Forsyth": forsythLayer,
    "Fulton": fultonLayer,
    "Gwinnett": gwinnettLayer,
    "Hall": hallLayer,
    "Henry": henryLayer,
    "Newton": newtonLayer,
    "Paulding": pauldingLayer,
    "Rockdale": rockdaleLayer,
    "Spalding": spaldingLayer,
    "Walton": waltonLayer
  };

  L.control.layers(counties, null, {
    collapsed: false
  }).addTo(map);

  // change zoom and center of map when county changes
  map.on('baselayerchange', function(e) {
    map.fitBounds(e.layer.getBounds(), {
      maxZoom: 14
    });
  });
};