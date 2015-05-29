var earlyVotingApp = angular.module('earlyVotingApp', [
	'ngRoute',
	'earlyVotingControllers'
]);

earlyVotingApp.config(['$routeProvider',function($routeProvider) {
	$routeProvider.
		when('/select-county', {
			templateUrl: 'templates/select-county.html',
			controller: 'SelectCountyCtrl'
		}).
		when('/county-map/:countyId', {
			templateUrl: 'templates/county-map.html',
			controller: 'CountyMapCtrl'
		}).
		otherwise({
			redirectTo: '/select-county'
		});
}]);
