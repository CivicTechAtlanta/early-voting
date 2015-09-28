'use strict';

/**
 * @ngdoc function
 * @name earlyVotingApp.controller:CountyCtrl
 * @description
 * # CountyCtrl
 * Controller of the earlyVotingApp
 */
angular.module('earlyVotingApp')
  .controller('CountyCtrl', ['$scope', '$http', '$routeParams', 'countyElectionInfo', 'countyBoundaries', 'leafletBoundsHelpers', 
  									function ($scope,   $http,   $routeParams,   countyElectionInfo,   countyBoundaries,   leafletBoundsHelpers) {
  	function toTitleCase(str) {
	    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}
    this.county = toTitleCase($routeParams.countyName);
		this.countyElectionInfo = countyElectionInfo;
    var county = this.county;
    var countyBbox = countyBoundaries.properties.BOUNDS;
    this.bounds = leafletBoundsHelpers.createBoundsFromArray([
    	[ countyBbox[1], countyBbox[0] ],
    	[ countyBbox[3], countyBbox[2] ]
  	]);
  	// var fileName = 'data/county-outlines/' + this.county + '.geojson';
  	var pollingPlaceIndex = 0;

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
						weight: 2,
						opacity: 1,
						color: '#E03D69',
						fillOpacity: 0
					}
				},
				election: {
					data: countyElectionInfo,
					style: function(feature) {return {};},
					pointToLayer: function(feature, latlng) {
						return new L.marker(latlng, {icon: L.icon(pollingIcon)})
					},
					onEachFeature: function(feature, layer) {
						feature.id = pollingPlaceIndex;
						pollingPlaceIndex++;
						var pollingPlaceTitle = feature.properties.location !== "" ? feature.properties.location : "Polling Place";
						layer.bindPopup("<a href='#/counties/"+$routeParams.countyName+"/"+feature.id+"' class='popup-link'><span class='popup-text'>" + pollingPlaceTitle + "<br>" + feature.properties.datesSimplified + "</span><i class='popup-icon fa fa-chevron-right fa-2x' aria-label='view polling place details '></i></a>");
					}
				}
			});
	  }



		// geolocation
		var compare = function(a,b) {
		  if (a.distance < b.distance)
		    return -1;
		  if (a.distance > b.distance)
		    return 1;
		  return 0;
		}

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
			for (var i = 0; i < sortedPollingPlaces.length; i++) {
				var place = sortedPollingPlaces[i];
				place.distance = haversine(userPosition.latitude, userPosition.longitude, place.geometry.coordinates[1], place.geometry.coordinates[0]);
			};
		};

		if (countyElectionInfo.earlyVoting) {
			var pollingPlaces = countyElectionInfo[0].features;
			this.sortedPollingPlaces = pollingPlaces.slice(); // copy so as not to mess up IDs of routes for polling places within a county
			var sortedPollingPlaces = this.sortedPollingPlaces;
			this.sorted = "Sorting by distance is OFF";
			var sorted = this.sorted;

			navigator.geolocation.getCurrentPosition(function(position) {
				if (countyElectionInfo.earlyVoting) {
					computeDistances(position.coords);
					sortedPollingPlaces = sortedPollingPlaces.sort(compare);
					sorted = "Sorting by distance is ON";
				}
				// mark on map
				$scope.paths.circle.latlngs.lat = position.coords.latitude;
				$scope.paths.circle.latlngs.lng = position.coords.longitude;
				$scope.paths.circle.opacity = 1;
				$scope.paths.circle.fillOpacity = 0.5;
			});
		};

  }]);
