'use strict';

/**
 * @ngdoc directive
 * @name earlyVotingApp.directive:electionDay
 * @description
 * # electionDay
 */
angular.module('earlyVotingApp')
  .directive('electionDay', function (electionProperties) {
    var electionDate = moment(electionProperties.date, 'YYYYMMDD').format("dddd, MMMM Do");

    return {
      scope: true,
      restrict: 'E',
      template: `
        <p>
          ON ELECTION DAY (${electionDate}) do not go to an "Early Voting" location. Early Voting locations are only to be used before the designated election day.
        </p>
        <p>
          If you are going to vote on the day of the election, instead of voting early, <a href="https://www.mvp.sos.ga.gov/MVP/mvp.do" target="_blank">go to the Secretary of State's My Voter Page</a>.
          On this page you can fill in your Name and Birth Date, and it will tell you where to go to vote on the day of the election.
        </p>
        <p>
          If you are voting early, you will go to a different place to vote than if you are going to vote on the day of the election.
        </p>
      `
    };
  });
