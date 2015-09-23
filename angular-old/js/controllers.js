angular.module('earlyVotingApp')

  .controller('SelectCountyCtrl', ['$scope', '$http', 'Filter', 'Locations', function ($scope, $http, Filter, Locations) {

  	Locations.getLocations().success(function(data) {
  		$scope.counties = data;
  	});

    $scope.setCounty = function(name) {
      Filter.setCounty(name);
    }
  }])

  .controller('CountyMapCtrl', ['$scope', '$routeParams', 'Locations', function($scope, $routeParams, Locations){
    //Capitalize first letter for the view
  	var county = $routeParams.countyId;
    $scope.countyId = county.charAt(0).toUpperCase() + county.slice(1);

    angular.extend($scope, {
      atlanta: {
        lat: 33.750152, 
        lng: -84.388011,
        zoom: 9
      }
    });

    // When We have a GeoJSON file of these locations we can add them to the map with the code below
    // Locations.getLocations().success(function(data) {
    //   console.log(data);
    //   angular.extend($scope, {
    //     geojson: data
    //   });
    // });
  }]);
