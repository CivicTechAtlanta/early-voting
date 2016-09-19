'use strict';

/**
 * @ngdoc directive
 * @name earlyVotingApp.directive:todaysHours
 * @description
 * # todaysHours
 */
angular.module('earlyVotingApp')
  .directive('todaysHours', function (electionProperties) {

    var currentDate = moment().format('YYYYMMDD');
    // var currentDate = moment('20161019', 'YYYYMMDD');
    var currentHour = moment().format('H');
    var tomorrowsDate = moment(currentDate, 'YYYYMMDD').add(1, 'days'); // moment() here prevents mutation
    var earlyVotingBegins = moment(electionProperties.earlyVotingDate, 'YYYYMMDD');
    var electionDate = moment(electionProperties.date, 'YYYYMMDD');
    
    function getTodaysHours(allHours) {

      for (var i = allHours.length - 1; i >= 0; i--) {
        var date = allHours[i].date;
        var time = allHours[i].time;

        if (moment(date, 'YYYY-MM-DD').isSame(currentDate)) {
          return "Open " + time + ' today (' + currentDate.format('MMM Do') + ')';
        }

      }

      return "Closed today";
    }

    function getTomorrowsHours(allHours) {

      for (var i = allHours.length - 1; i >= 0; i--) {
        var date = allHours[i].date;
        var time = allHours[i].time;

        if (moment(date, 'YYYY-MM-DD').isSame(tomorrowsDate)) {
          return "Open " + time + ' tomorrow (' + tomorrowsDate.format('MMM Do') + ')';
        }

      }

      return "Closed tomorrow";
    }

    function getRelevantHours(allHours) {

      if (electionDate.isSameOrBefore(currentDate)) { // if election has passed
        return undefined;
      } else if (earlyVotingBegins.isSame(tomorrowsDate)) { // if today is the day before early voting
        // return the time tomorrow;
        return getTomorrowsHours(allHours);
      } else if (earlyVotingBegins.isAfter(tomorrowsDate)) { // if today is before the day before early voting
        return "Early voting begins " + earlyVotingBegins.format('MMM Do');
      } else if (currentHour >= 21) { // after 9pm, display tomorrow's hours
        return getTomorrowsHours(allHours);
      } else {
        return getTodaysHours(allHours);
      }
    }

    return {
      scope: true,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.allHours = attrs.allHours;
        scope.relevantHours = getRelevantHours(JSON.parse(scope.allHours));
      },
      template: '<div ng-if="relevantHours">{{relevantHours}}</div><br>'
    };
  });
