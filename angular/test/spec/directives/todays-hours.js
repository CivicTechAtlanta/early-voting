'use strict';

describe('Directive: todaysHours', function () {

  // load the directive's module
  beforeEach(module('earlyVotingApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<todays-hours></todays-hours>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the todaysHours directive');
  }));
});
