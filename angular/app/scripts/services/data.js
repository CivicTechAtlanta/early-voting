'use strict';

/**
 * @ngdoc service
 * @name earlyVotingApp.data
 * @description
 * # data
 * Service in the earlyVotingApp.
 */
angular.module('earlyVotingApp')
  .service('DataService', ['$http', function ($http) {

  	var electionData;

  	var getElectionData = function() {
  		$http.get('data/elections/20151103-locations.json')
      .then(function(result) {
        electionData = result.data;
        console.log(result);
        return electionData;
      });
  	};

    var getCountyElectionData = function(county) {
      if (typeof(electionData) !== 'undefined') {
        return electionData[county].data;
      } else {
        getElectionData().then(function() {
          getCountyElectionData(county);
        });
      }
    }

  	return {
      getCountyElectionData: getCountyElectionData,
  		getElectionData: getElectionData
  	};
  }]);
