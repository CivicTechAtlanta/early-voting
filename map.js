window.onload = function () {

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

  var pollingLayer = L.geoJson(polling, {
    onEachFeature: onEachPolling
  }).addTo(map);

  // map

  L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    attribution: '<a href="http://proximityviz.com/">Proximity Viz</a> | Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />',
    maxZoom: 18
  }).addTo(map);

};