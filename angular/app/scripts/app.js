'use strict';

/**
 * @ngdoc overview
 * @name earlyVotingApp
 * @description
 * # earlyVotingApp
 *
 * Main module of the application.
 */
angular
  .module('earlyVotingApp', [
    'leaflet-directive',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMaterial',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .run(['$rootScope', '$route', function($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function() {
      document.title = $route.current.title + "Georgia Early Voting | Code for Atlanta";
    });
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        title: '',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        title: 'About | ',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/counties', {
        title: 'Counties | ',
        templateUrl: 'views/counties.html',
        controller: 'CountiesCtrl',
        controllerAs: 'counties'
      })
      .when('/counties/:countyName', {
        title: 'County | ',
        templateUrl: 'views/county.html',
        controller: 'CountyCtrl',
        controllerAs: 'county',
        resolve: {
          countyBoundaries: ['$http', '$route', function($http, $route) {
            var county = $route.current.params.countyName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            var fileName = 'data/county-outlines/' + county + '.geojson';
            return $http.get(fileName).then(function(result) {
              return result.data.features[0];
            })
          }],
          countyElectionInfo: ['$http', '$route', function($http, $route) {
            var county = $route.current.params.countyName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            return $http.get('data/elections/20151103-locations.json').then(function(result) {
              return result.data[county];
            })
          }
          ]
        }
      })
      .when('/counties/:countyName/:pollingPlace', {
        title: 'Polling Place | ',
        templateUrl: 'views/place.html',
        controller: 'PlaceCtrl',
        controllerAs: 'place',
        resolve: {
          pollingPlaceInfo: [ '$http', '$route', function($http, $route) {
            var county = $route.current.params.countyName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            return $http.get('data/elections/20151103-locations.json').then(function(result) {
              return result.data[county][0].features[$route.current.params.pollingPlace];
            })
          }
          ]
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
