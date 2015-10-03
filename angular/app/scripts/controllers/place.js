'use strict';

/**
 * @ngdoc function
 * @name earlyVotingApp.controller:PlaceCtrl
 * @description
 * # PlaceCtrl
 * Controller of the earlyVotingApp
 */
angular.module('earlyVotingApp')
	// pollingPlaceInfo comes from a resolve in the route
  .controller('PlaceCtrl', ['$http', '$routeParams', 'pollingPlaceInfo', '$scope', 
  								 function ($http,   $routeParams,   pollingPlaceInfo,   $scope) {
	function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
  this.today = moment().format("dddd, MMMM D");
  this.county = toTitleCase($routeParams.countyName);
  this.properties = pollingPlaceInfo.properties;
  var coordinates = pollingPlaceInfo.geometry.coordinates;

  for (var i = 0; i < this.properties.dates.length; i++) {
  	var date = this.properties.dates[i];
  	date.date = moment(date.date, "YYYY-MM-DD").format("dddd, MMMM D");
  	if (date.startTime && date.endTime) {
	  	date.openTime = moment(date.startTime, "HH:mm").format("LT") + " - " + moment(date.endTime, "HH:mm").format("LT");
  	} else {
  		date.openTime = "Closed";
  	}
  }

  // map
  var pollingPlaceMarker = {
  	lat: coordinates[1],
  	lng: coordinates[0],
  	icon: {
	  	iconUrl: '/images/pink-marker.png',
	  	shadowUrl: '/images/markers-shadow.png',
	  	iconSize: [36,46],
	  	shadowSize: [35,16],
	  	iconAnchor: [18,42],
	  	shadowAnchor: [11,13],
	  	popupAnchor: [0,-42]}
  };

  angular.extend($scope, {
  	county: {
  		lat: coordinates[1],
  		lng: coordinates[0],
  		zoom: 14
  	},
  	markers: {
  		mainMarker: angular.copy(pollingPlaceMarker)
  	}
  });

  this.googleMapsLink = "http://maps.google.com/maps?daddr='" + this.properties.address + ' ' + this.properties.city + ', GA ' + this.properties.zip + "'";

  }]);
