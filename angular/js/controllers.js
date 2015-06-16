angular.module('earlyVotingApp')

  .controller('SelectCountyCtrl', ['$scope', '$http', 'Filter', function ($scope, $http, Filter) {

  	$http.get('models/20150616.json').success(function(data) {
  		$scope.counties = data;
  	});

    $scope.setCounty = function(name) {
      Filter.setCounty(name);
    }
  }])

  .controller('CountyMapCtrl', ['$scope', '$routeParams', function($scope, $routeParams){
  	$scope.countyId = $routeParams.countyId;
    // get county name from routeParams
    // make sure county is set in Filter service
  }]);
