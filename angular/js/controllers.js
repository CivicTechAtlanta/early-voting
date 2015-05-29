var earlyVotingControllers = angular.module('earlyVotingControllers', []);

earlyVotingControllers.controller('SelectCountyCtrl', ['$scope', '$http', function ($scope, $http) {
	$http.get('models/20150616.json').success(function(data) {
		$scope.counties = data;
	});
}]);

earlyVotingControllers.controller('CountyMapCtrl', ['$scope', '$routeParams', function($scope, $routeParams){
	$scope.countyId = $routeParams.countyId;
	console.log($routeParams.countyId);
}]);
