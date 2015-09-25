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
      .when('/counties/:countyName', {
        title: 'County | ',
        templateUrl: 'views/county.html',
        controller: 'CountyCtrl',
        controllerAs: 'county'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
