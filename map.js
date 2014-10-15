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
    layer.bindPopup(feature.properties.Location +
      "<br>" + feature.properties.Address1 +
      "<br>" + feature.properties.Address2 +
      "<br>" + feature.properties.City +
      "<br><br>Weekdays: " + 
      "<br>" + feature.properties.WeekdayDates +
      "<br>" + feature.properties.WeekdayTimes +
      "<br><br>Saturdays: " +
      "<br>" + feature.properties.SaturdayDates + 
      "<br>" + feature.properties.SaturdayTimes + 
      "<br><br>Sundays: " +
      "<br>" + feature.properties.SundayDates +
      "<br>" + feature.properties.SundayTimes);
  };

  var fultonLayer = L.geoJson(polling, {
    onEachFeature: onEachPolling,
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng, {icon: pollingIcon});
    }
  }).addTo(map);

  // map

  map.locate({
    setView: true, 
    maxZoom: 12,
    watch: false
  })
    .on('locationfound', function(e){
        var marker = L.marker([e.latitude, e.longitude], {icon: hereIcon})
        // fa-bullseye or glyphicon-screenshot
        .bindPopup('You are here');
        map.addLayer(marker);
        currentCoords = e.latitude;
    })
    .on('locationerror', function(e){
        console.log(e);
        alert("Location access denied.");
    });

  L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    attribution: 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" /> | ' +
    'Made for <a href="http://www.codeforatlanta.org/"><img src="images/code-for-atlanta.png" height=70></a> by <a href="http://proximityviz.com/"><img src="images/prox-small.jpg"></a>',
    maxZoom: 18
  }).addTo(map);

  var counties = {
    "Fulton": fultonLayer
  };

  var time = {
    //
  };

  L.control.layers(counties, time, {
    collapsed: false
  }).addTo(map);

};