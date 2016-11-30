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
    'ngTouch',
    'ui.bootstrap'
  ])
  .run(['$rootScope', '$route', '$window', '$location', function($rootScope, $route, $window, $location) {
    $rootScope.$on('$routeChangeSuccess', function() {
      document.title = $route.current.title + "Georgia Early Voting | Code for Atlanta";
      $window.scrollTo(0,0);
      $window.ga('send', 'pageview', { page: $location.url() }); // allows google analytics to track "pages" within the SPA
    });
  }])
  // .config(function($mdThemingProvider) {
  //   $mdThemingProvider.theme('default')
  //     .primaryPalette('pink')
  //     .accentPalette('amazingPaletteName');
  // })
  .constant("electionProperties", {
    // from http://sos.ga.gov/index.php/elections/2016_election_dates
    "date": "20161108",
    "type": "general election runoff",
    "registrationDate": "20161011",
    "earlyVotingDate": "20161128"
  })
  .config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('codeForATLPrimary', {
      '50': 'e6eef2',
      '100': 'b3ccd9',
      '200': '80aac0',
      '300': '558daa',
      '400': '2a7095',
      '500': '005480',
      '600': '004a70',
      '700': '003f60',
      '800': '003550',
      '900': '002a40',
      'A100': 'b3ccd9',
      'A200': '80aac0',
      'A400': '2a7095',
      'A700': '003f60',
      'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                          // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
       '200', '300', '400', 'A100'],
      'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.definePalette('codeForATLAccent', {
      '50': 'fae8ec',
      '100': 'f1bbc6',
      '200': 'e78da0',
      '300': 'df6780',
      '400': 'd74161',
      '500': 'cf1b41',
      '600': 'b51839',
      '700': '9b1431',
      '800': '811129',
      '900': '680e21',
      'A100': 'f1bbc6',
      'A200': 'e78da0',
      'A400': 'd74161',
      'A700': '9b1431',
      'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                          // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
       '200', '300', '400', 'A100'],
      'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('default')
      .primaryPalette('codeForATLPrimary')
      .accentPalette('codeForATLAccent');
  })
  .config(function (electionProperties, $routeProvider) {
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
            var county = $route.current.params.countyName;
            var fileName = 'data/county-outlines/' + county + '.geojson';
            return $http.get(fileName).then(function(result) {
              return result.data.features[0];
            });
          }],
          countyElectionInfo: ['$http', '$route', function($http, $route) {
            var county = $route.current.params.countyName;
            return $http.get('data/elections/' + electionProperties.date + '-locations.geojson').then(function(result) {
              if (typeof(result.data[county]) === "undefined") {
                // console.log("undefined");
                // result.data[county].earlyVoting = false;
                return {earlyVoting: false};
              } else {
                result.data[county].earlyVoting = true;
                return result.data[county];
              }
            }, function(error) {
              console.log(error);
            });
          }]
        }
      })
      .when('/counties/:countyName/:pollingPlace', {
        title: 'Polling Place | ',
        templateUrl: 'views/place.html',
        controller: 'PlaceCtrl',
        controllerAs: 'place',
        resolve: {
          pollingPlaceInfo: [ '$http', '$route', function($http, $route) {
            var county = $route.current.params.countyName;
            return $http.get('data/elections/' + electionProperties.date + '-locations.geojson').then(function(result) {
              var pollingPlaces = result.data[county][0].features;
              for (var i = 0; i < pollingPlaces.length; i++) {
                if (parseInt(pollingPlaces[i].properties.id) === parseInt($route.current.params.pollingPlace)) {
                  return pollingPlaces[i];
                }
              }
            });
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
