window.onload = function () {

  L.popup({className: 'intro-popup'})
    .setLatLng([33.7540521,-84.4237409])
    .setContent('' +
      'This is a map of metro Atlanta early voting<br>' +
      'locations for the March 17, 2015 election.<br>' + 
      'On the right side of the screen, you can <br>' +
      'select the county in which you are<br>' + 
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
      "<br><br><b>Feb. 23-27:</b> " + feature.properties.Feb23to27 +
      "<br><b>Sat. Feb. 28:</b> " + feature.properties.Feb28 +
      "<br><b>Sun. Mar. 1:</b> " + feature.properties.Mar1 +
      "<br><b>Mar. 2-6:</b> " + feature.properties.Mar2to6 +
      "<br><b>Sat. Mar. 7:</b> " + feature.properties.Mar7 +
      "<br><b>Sun. Mar. 8:</b> " + feature.properties.Mar8 +
      "<br><b>Mar. 9-13:</b> " + feature.properties.Mar9to13);
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

  var fultonLayer = createCountyLayer("Fulton").addTo(map);

  // map

  L.control.attribution({position: 'bottomleft'}).addTo(map);

  L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    attribution: 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" /><br>' +
    'Made for <a href="http://www.codeforatlanta.org/"><img src="images/code-for-atlanta.png" height=70></a> by <a href="http://proximityviz.com/"><img src="images/prox-small.png"></a>',
    maxZoom: 18
  }).addTo(map);

  var counties = {
    "Fulton": fultonLayer
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