angular.module('earlyVotingApp')

  .factory('Filter', function() {

    var openSunday = true,
      openSaturday = true,
      openLate     = true,
      county       = '';

    function getCounty() {
      return county;
    }

    function setCounty(name) {
      county = name;
      return true;
    }

    function toggleOpenLate() {
      openLate != openLate;
      return true;
    }

    function toggleOpenSunday() {
      openSunday != openSunday;
      return true;
    }

    function toggleOpenSaturday() {
      openSaturday != openSaturday;
      return true;
    }

    return {
      getCounty: getCounty,
      setCounty: setCounty,
      toggleOpenLate: toggleOpenLate,
      toggleOpenSunday: toggleOpenSunday,
      toggleOpenSaturday: toggleOpenSaturday
    }
  });