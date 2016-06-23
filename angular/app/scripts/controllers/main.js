'use strict';

/**
 * @ngdoc function
 * @name earlyVotingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the earlyVotingApp
 */
angular.module('earlyVotingApp')
  .controller('MainCtrl', function ($scope, $log, $location, electionProperties) {
    this.gaCounties = [];

    this.querySearch = function(query) {
      var results = query ? this.counties.filter( createFilterFor(query) ) : this.counties;
      return results;
    };
    this.searchTextChange = function(text) {
      $log.info('Text changed to ' + text);
    };
    this.selectedCountyChange = function(county) {
      $log.info('County changed to ' + JSON.stringify(county));
      $location.path("/counties/" + county.display);
    };
    /**
     * Build `counties` list of key/value pairs
     */
    function loadAll() {
      var gaCounties = [
        "Appling", "Atkinson", "Bacon", "Baker", "Baldwin", "Banks", "Barrow", "Bartow", "Ben Hill",
        "Berrien", "Bibb", "Bleckley", "Brantley", "Brooks", "Bryan", "Bulloch", "Burke", "Butts",
        "Calhoun", "Camden", "Candler", "Carroll", "Catoosa", "Charlton", "Chatham",
        "Chattahoochee", "Chattooga", "Cherokee", "Clarke", "Clay", "Clayton", "Clinch", "Cobb",
        "Coffee", "Colquitt", "Columbia", "Cook", "Coweta", "Crawford", "Crisp", "Dade", "Dawson",
        "Decatur", "DeKalb", "Dodge", "Dooly", "Dougherty", "Douglas", "Early", "Echols",
        "Effingham", "Elbert", "Emanuel", "Evans", "Fannin", "Fayette", "Floyd", "Forsyth",
        "Franklin", "Fulton", "Gilmer", "Glascock", "Glynn", "Gordon", "Grady", "Greene",
        "Gwinnett", "Habersham", "Hall", "Hancock", "Haralson", "Harris", "Hart", "Heard",
        "Henry", "Houston", "Irwin", "Jackson", "Jasper", "Jeff Davis", "Jefferson", "Jenkins",
        "Johnson", "Jones", "Lamar", "Lanier", "Laurens", "Lee", "Liberty", "Lincoln", "Long",
        "Lowndes", "Lumpkin", "Macon", "Madison", "Marion", "McDuffie", "McIntosh", "Meriwether",
        "Miller", "Mitchell", "Monroe", "Montgomery", "Morgan", "Murray", "Muscogee", "Newton",
        "Oconee", "Oglethorpe", "Paulding", "Peach", "Pickens", "Pierce", "Pike", "Polk", "Pulaski",
        "Putnam", "Quitman", "Rabun", "Randolph", "Richmond", "Rockdale", "Schley", "Screven",
        "Seminole", "Spalding", "Stephens", "Stewart", "Sumter", "Talbot", "Taliaferro", "Tattnall",
        "Taylor", "Telfair", "Terrell", "Thomas", "Tift", "Toombs", "Towns", "Treutlen", "Troup",
        "Turner", "Twiggs", "Union", "Upson", "Walker", "Walton", "Ware", "Warren", "Washington",
        "Wayne", "Webster", "Wheeler", "White", "Whitfield", "Wilcox", "Wilkes", "Wilkinson",
        "Worth"
      ];
      return gaCounties.map( function (county) {
        return {
          value: county.toLowerCase(),
          display: county
        };
      });
    }
    this.counties = loadAll();
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      return function filterFn(county) {
        return (county.value.indexOf(query) === 0);
      };
    }

    this.nextElectionDate = moment(electionProperties.date, "YYYYMMDD").format('LL');
    this.nextElectionType = electionProperties.type;
    this.nextElectionRegistrationDate = moment(electionProperties.registrationDate, "YYYYMMDD").format('LL');
    this.nextElectionEarlyVotingDate = moment(electionProperties.earlyVotingDate, "YYYYMMDD").format('LL');
  });
