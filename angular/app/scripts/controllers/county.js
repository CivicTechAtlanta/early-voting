'use strict';

/**
 * @ngdoc function
 * @name earlyVotingApp.controller:CountyCtrl
 * @description
 * # CountyCtrl
 * Controller of the earlyVotingApp
 */
angular.module('earlyVotingApp')
  .controller('CountyCtrl', ['$scope', '$routeParams', 'countyElectionInfo', 'countyBoundaries', 'electionProperties', 'leafletBoundsHelpers', 
                    function ($scope,   $routeParams,   countyElectionInfo,   countyBoundaries,   electionProperties,   leafletBoundsHelpers) {

    $scope.loading = false;
    this.county = $routeParams.countyName;
    this.countyElectionInfo = countyElectionInfo;
    this.electionDate = moment(electionProperties.date, "YYYYMMDD").format('LL');
    this.electionType = electionProperties.type;
    var countyBbox = countyBoundaries.properties.BOUNDS;
    this.bounds = leafletBoundsHelpers.createBoundsFromArray([
      [ countyBbox[1], countyBbox[0] ],
      [ countyBbox[3], countyBbox[2] ]
    ]);
    // var fileName = 'data/county-outlines/' + this.county + '.geojson';

    var pollingIcon = {
      iconUrl: '/images/pink-marker.png',
      shadowUrl: '/images/markers-shadow.png',
      iconSize: [36,46],
      shadowSize: [35,16],
      iconAnchor: [18,42],
      shadowAnchor: [11,13],
      popupAnchor: [0,-42]
    };

    if (countyElectionInfo.earlyVoting) {
      angular.extend($scope, {
        geojson: {},
        tiles: {
          url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          options: {
            attribution: 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />'
          }
        },
        // this is the geolocation marker
        // begins transparent
        paths: {
          circle: {
            weight: 2,
            opacity: 0,
            fillOpacity: 0,
            color: '#399FD3',
            type: "circleMarker",
            radius: 5,
            latlngs: {
              lat: 34.8377839,
              lng: -84.3792862
            }
          }
        }
      });
      angular.extend($scope.geojson, {
        outline: {
          data: countyBoundaries,
          style: {
            weight: 3,
            opacity: 1,
            color: '#E03D69',
            fillOpacity: 0
          }
        },
        election: {
          data: countyElectionInfo,
          style: function() {return {};},
          pointToLayer: function(feature, latlng) {
            return new L.marker(latlng, {icon: L.icon(pollingIcon)});
          },
          onEachFeature: function(feature, layer) {
            var pollingPlaceTitle = feature.properties.location !== "" ? feature.properties.location : "Polling Place";
            var lineBreaks = feature.properties.datesSimplified === "" ? "" : "<br><br>";
            // layer.bindPopup("<a href='#/counties/"+$routeParams.countyName+"/"+feature.properties.id+"' class='popup-link'><span class='popup-text'>" + pollingPlaceTitle + lineBreaks + feature.properties.datesSimplified + "</span><i class='popup-icon fa fa-chevron-right fa-2x' aria-label='view polling place details '></i></a>");
            layer.bindPopup("<a href='#/counties/"+$routeParams.countyName+"/"+feature.properties.id+"' class='popup-link'><span class='popup-text'>" + pollingPlaceTitle + lineBreaks + feature.properties.datesSimplified + "<todays-hours all-hours='" + feature.properties.dates + "'></todays-hours></span><i class='popup-icon fa fa-chevron-right fa-2x' aria-label='view polling place details '></i></a>");
          }
        }
      });
    }



    // geolocation
    var compare = function(a,b) {
      if (a.distance < b.distance) {
        return -1;
      }
      if (a.distance > b.distance) {
        return 1;
      }
      return 0;
    };

    var haversine = function(userLat, userLon, placeLat, placeLon) {
      function toRad(x) {
        return x * Math.PI / 180;
      }

      var R = 3961; // mi
      var x1 = userLat-placeLat;
      var dLat = toRad(x1);  
      var x2 = userLon-placeLon;
      var dLon = toRad(x2);  
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
        Math.cos(toRad(placeLat)) * Math.cos(toRad(userLat)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);  
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; 

      return d;
    };

    var computeDistances = function(userPosition) {
      for (var i = 0; i < pollingPlaces.length; i++) {
        var place = pollingPlaces[i];
        place.distance = haversine(userPosition.latitude, userPosition.longitude, place.geometry.coordinates[1], place.geometry.coordinates[0]);
      }
    };

    $scope.$on('geolocationComplete', function() {
      $scope.$apply(function() {
        pollingPlaces = pollingPlaces.sort(compare);
        $scope.sorted = true;
        $scope.loading = false;
        console.log("geolocationComplete");
      });
    });

    var geolocate = function() {
      $scope.loading = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        if (countyElectionInfo.earlyVoting) {
          computeDistances(position.coords);
          $scope.$emit('geolocationComplete');
        }
        // mark on map
        $scope.paths.circle.latlngs.lat = position.coords.latitude;
        $scope.paths.circle.latlngs.lng = position.coords.longitude;
        $scope.paths.circle.opacity = 1;
        $scope.paths.circle.fillOpacity = 0.5;
      }, function(error) {
        console.log(error);
        $scope.loading = false;
        $scope.errorText = "";
        if (error.message === "User denied Geolocation") {
          $scope.errorText = "Geolocation turned off";
          console.log($scope.errorText);
        }
      });
    };

    this.geolocate = geolocate;

    if (countyElectionInfo.earlyVoting) {
      var pollingPlaces = countyElectionInfo[0].features;
      this.pollingPlaces = pollingPlaces;
      $scope.sorted = false;

      geolocate();
    }

  }]);
