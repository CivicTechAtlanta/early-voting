'use strict';

/**
 * @ngdoc function
 * @name earlyVotingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the earlyVotingApp
 */
angular.module('earlyVotingApp')
  .controller('MainCtrl', function ($scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var now = moment();
    this.nextElectionRegistrationDate = moment("20150926", "YYYYMMDD");
    // if it's in the past, say passed, otherwise say how far away it is
    if (this.nextElectionRegistrationDate.endOf('day').isBefore(now)) {
    	this.nextElectionRegistrationDateRelative = "The registration deadline has passed.";
    	$scope.nextElectionRegistrationColor = "red";
    } else if (this.nextElectionRegistrationDate.endOf('day').isSame(now, 'day')) {
    	this.nextElectionRegistrationDateRelative = "The registration deadline is today!";
    	$scope.nextElectionRegistrationColor = "green";
    } else {
    	this.nextElectionRegistrationDateRelative = "The registration deadline is " + this.nextElectionRegistrationDate.fromNow() + ".";
    	$scope.nextElectionRegistrationColor = "green";
    }
    this.nextElectionEarlyVotingDate = moment("20150925", "YYYYMMDD");
    if (moment.isDate(this.nextElectionEarlyVotingDate)) {
      this.nextElectionEarlyVotingText = "Early voting begins " + this.nextElectionEarlyVotingDate;
    } else {
      this.nextElectionEarlyVotingText = "We have no information about early voting for this election.";
    }
  });
