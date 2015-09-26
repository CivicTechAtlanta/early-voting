'use strict';

describe('Controller: CountyListCtrl', function () {

  // load the controller's module
  beforeEach(module('earlyVotingApp'));

  var CountyListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CountyListCtrl = $controller('CountyListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CountyListCtrl.awesomeThings.length).toBe(3);
  });
});
