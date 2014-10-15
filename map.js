window.onload = function () {

  var hereIcon = L.icon({
    iconUrl: 'youarehere-2.png',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -37]
  });

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

  // map.locate({
  //   setView: true, 
  //   maxZoom: 12,
  //   watch: false
  // })
  //   .on('locationfound', function(e){
  //       var marker = L.marker([e.latitude, e.longitude], {icon: hereIcon})
  //       // fa-bullseye or glyphicon-screenshot
  //       .bindPopup('You are here');
  //       map.addLayer(marker);
  //       currentCoords = e.latitude;
  //   })
  //   .on('locationerror', function(e){
  //       console.log(e);
  //       alert("Location access denied.");
  //   });

  L.control.attribution({position: 'bottomleft'}).addTo(map);

  L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    attribution: 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" /> | ' +
    'Made for <a href="http://www.codeforatlanta.org/"><img src="images/code-for-atlanta.png" height=70></a> by <a href="http://proximityviz.com/"><img src="images/prox-small.jpg"></a>',
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
    map.fitBounds(e.layer.getBounds());
  });
};