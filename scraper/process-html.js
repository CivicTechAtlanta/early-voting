var logger = require('tracer').colorConsole({
  format: '<{{title}}> (in {{file}}:{{line}}) {{message}}'
});
var moment = require('moment');
var fs = require('fs');
var counties = fs.readFileSync('html-from-scraper-20160301.json');
counties = JSON.parse(counties);
var parsedCounties = [];
var votingStartDate;
var votingEndDate;
var votingDates = [];
var uniqueLocations = [];

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function getDatesBetween(startDate, endDate) {
  var currentDate = moment(startDate, "MM/DD/YYYY");
  var dates = [];
  while (currentDate <= moment(endDate, "MM/DD/YYYY")) {
    dates.push(currentDate.format("MM/DD/YYYY")); // might want to format these differently
    currentDate.add(1, 'days');
  }
  return dates;
}

counties.forEach(function(county) {
  var countyName = county.name;
  var countyID = county.value;
  var locations = county.locations;
  parsedCounties = processCounty(parsedCounties, countyName, countyID, locations);
});
// once we've processed the counties, we can find all the dates
votingDates = getDatesBetween(votingStartDate, votingEndDate);

for (var i = 0; i < parsedCounties.length; i++) {
  var county = parsedCounties[i];
  logger.warn(county);

  county.locations = matchLocations(county);
  parseLocations(county.locations);
  // logger.log(county);
  delete county.locationTimes;
  parsedCounties[i] = county;
}

logger.warn(parsedCounties);





// make a db of known polling places
// copy object
var pollingPlaces = JSON.parse(JSON.stringify(parsedCounties));
pollingPlaces.forEach(function(county) {
  county.locations.forEach(function(location) {
    delete location.dates;
  });
});
fs.writeFile('processed-20160301.json', JSON.stringify(pollingPlaces));

// if one doesn't match exactly, error and ask if it is new
// if it is new, write the polling place to the DB












































// add countyName and ID to each location
// pass location along to parseLocation()
function processCounty(parsedCounties, name, id, locations) {
  var parsedCounty = {name: name, id: id, locationTimes: []};
  locations.forEach(function(location) {
    location.county = name;
    location.countyID = id;
    location = parseLocation(location);
    parsedCounty.locationTimes.push(location);
  });
  parsedCounties.push(parsedCounty);
  return parsedCounties;
}

// the location passed in here is actually a location-datespan
// the same polling place can be included multiple times
function parseLocation(location) {
  location.originalText = location.text;
  location = cleanLocation(location);
  location = findFirstDate(location);
  location = findSecondDate(location);
  location = findTimeRange(location);
  location = findFirstTime(location);
  location = findSecondTime(location);
  location = findDays(location);
  location = findZip(location);
  location = findCity(location);
  location = findAddress(location);
  // logger.log(location);
  return location;
}

function cleanLocation(location) {
  // remove nbsps first
  location.text = replaceAll(location.text, '&nbsp;', '');
  location.text = replaceAll(location.text, '<b>', '');
  location.text = replaceAll(location.text, '</b><br>', ' ');
  location.text = replaceAll(location.text, '</span>', '');
  location.text = replaceAll(location.text, '&amp;', '&');

  location.text = location.text.substring(103);
  if (location.text.substring(0, 1) === '>') {
    location.text = location.text.substring(1);
  }

  return location;
}

// test: what happens if there's no date at all
// test for weird characters
// display errors for weird stuff
function findFirstDate(location) {
  // todo: it would probably be better here to go ahead and test all first 10 characters
  if (typeof(parseInt(location.text[0])) === 'number') {
    location.firstDate = location.text.substring(0, 10);
    location.text = location.text.substring(10);
    // TODO: check that whole substring only contains numbers and "/"s

    // while we're here, see if this firstDate is before our first known early voting date
    if (typeof(votingStartDate) === 'undefined') {
      votingStartDate = location.firstDate;
    } else if (moment(location.firstDate, "MM/DD/YYYY").isBefore(moment(votingStartDate, "MM/DD/YYYY"))) {
      votingStartDate = location.firstDate;
    }
  } else {
    // error
    logger.log(location);
    throw new Error('First character of location text was not a number');
    // and find the first number in location
  }
  return location;
}

function findSecondDate(location) {
  // check that the first three remaining characters aren't numbers
  if (location.text.substring(0, 3) === ' - ') {
    // test numbers and "/"s like above
    location.text = location.text.substring(3);
    location.secondDate = location.text.substring(0, 10);
    location.text = location.text.substring(10);

    // while we're here, see if this secondDate is after our latest known early voting date
    if (typeof(votingEndDate) === 'undefined') {
      votingEndDate = location.secondDate;
    } else if (moment(location.secondDate, "MM/DD/YYYY").isAfter(moment(votingEndDate, "MM/DD/YYYY"))) {
      votingEndDate = location.secondDate;
    }
  } else {
    throw new Error('Separator between first date and second date was not where expected');
  }

  // then do the same stuff as findFirstDate()

  return location;
}

function findTimeRange(location) {
  if (location.text.substring(0, 1) === ' ') {
    location.text = location.text.substring(1);
  }
  var split = location.text.split(', Days: ');
  location.timeRange = split[0];
  return location;
}

// what to do if there's a lunch break?
function findFirstTime(location) {
  var split = location.text.split(' - ');
  location.firstTime = split[0];
  location.text = location.text.substring(location.firstTime.length + 3);
  return location;
}

function findSecondTime(location) {
  var split = location.text.split(', Days: ');
  location.secondTime = split[0];
  location.text = location.text.substring(location.secondTime.length + 8);
  return location;
}

function findDays(location) {
  var split = location.text.split('<br>');
  location.days = split[0]; // named wrong
  location.text = location.text.substring(location.days.length + 4);
  // location.text = split[1]; // these aren't right. it should only remove the "secondTime" part



  return location;
}

// test that isNaN(10-12) === true
// otherwise 9-digit zips will slip through

// here's a 9 digit example, in our data:
// <span id="ctl00_ContentPlaceHolder2_rptVotingInformation_ctl01_lblLocationDetail" class="standardfont"><b>02/20/2016 - 02/20/2016</b><br>9:00 AM - 4:00 PM, Days: Sa<br>Wilkes County Courthouse<br>23 Court Street, Room 113<br>Washington, GA30673-1570<br><br>
function findZip(location) {

  // if there's a ", GA", assume that what's after it is the zip, excluding any <br>s
  var split = location.text.split(', GA');
  if (split[1] && !split[2]) { // make sure there's one and only one ", GA"
    split[1] = replaceAll(split[1], '<br>', '');
    location.zip = split[1];
    location.text = split[0];
  } else {
    logger.log(location);
    throw new Error('No state found, therefore no zip code identified');
  }

  return location;
}


// trickiest, because cities can have multiple words
function findCity(location) {
  var index = location.text.lastIndexOf('<br>');
  location.city = location.text.substring(index + 4);
  location.text = location.text.substring(0, index);

  return location;
}


// do some testing in here for ones that are missing a place name
function findAddress(location) {
  // location.address = replaceAll(location.text, '<br>', ' ');
  var split = location.text.split('<br>');
  var missingPlaceName = false;
  if (!isNaN(split[0].substring(0, 1))) {
    logger.log(location.text);
    logger.warn('WARN: Seems to be missing a place name');
    location.name = "";
    missingPlaceName = true;
  } else {
    location.name = split[0];
  }
  if (split[1]) {
    location.address1 = missingPlaceName ? split[0] : split[1];
  }
  if (split[2]) {
    location.address2 = missingPlaceName ? split[1] : split[2];
  }
  if (split[3]) {
    logger.log(location);
    throw new Error('Too many address lines');
  }

  delete location.text;
  delete location.originalText;

  if (missingPlaceName) {
    logger.log(location);
  }

  return location;
}


























// see if the location is unique (within the county)
// if it is, create that new location and add the times to it
// if it's not unique, add the times to the existing location
function matchLocations(county) {
  var locationsInCounty = [];
  for (var i = 0; i < county.locationTimes.length; i++) {
    var locationTime = county.locationTimes[i];
    locationsInCounty = compareLocationToLocations(locationTime, locationsInCounty);
  }
  return locationsInCounty;
}

// locations is the list of all so-far-known unique locations
// we're seeing if location should be added there
// if "location" is unique, add it to the locations
// if not, add its information to the relevant location
function compareLocationToLocations(location, locations) {
  var unique = true;
  if (locations.length === 0) {
    unique = true;
  } else {
    for (var i = 0; i < locations.length; i++) {
      var uniqueLocation = locations[i];
      if (location.name === uniqueLocation.name) { // TODO: add &&s here and fuzzy matching
        unique = false;
        // save i so we'll know which location to add to
        // or just save it up here
        var locationTime = {
          'firstDate': location.firstDate,
          'secondDate': location.secondDate,
          'firstTime': location.firstTime,
          'secondTime': location.secondTime,
          'timeRange': location.timeRange,
          'days': location.days
        };
        uniqueLocation.times.push(locationTime);
        break;
      }
    }
  }
  if (unique) {
    var locationInfo = {
      'name': location.name,
      'address1': location.address1,
      'address2': location.address2, // only add if there is an address2?
      'city': location.city,
      'zip': location.zip,
      'times': [{
        'firstDate': location.firstDate,
        'secondDate': location.secondDate,
        'firstTime': location.firstTime,
        'secondTime': location.secondTime,
        'timeRange': location.timeRange,
        'days': location.days
      }]
    };
    locations.push(locationInfo);
  }
  return locations;
}

function parseLocations(county) {
  // logger.log(county);
  county.forEach(function(location) {
    parseTimes(location);
  });
}

// move this up
function parseDays(days) {
  var daysObject = [];
  daysObject.push(days.indexOf('Su') > -1 ? true : false);
  daysObject.push(days.indexOf('M') > -1 ? true : false);
  daysObject.push(days.indexOf('Tu') > -1 ? true : false);
  daysObject.push(days.indexOf('W') > -1 ? true : false);
  daysObject.push(days.indexOf('Th') > -1 ? true : false);
  daysObject.push(days.indexOf('F') > -1 ? true : false);
  daysObject.push(days.indexOf('Sa') > -1 ? true : false);
  return daysObject;
}

function compareDates(a, b) {
  if (a.date < b.date)
    return -1;
  else if (a.date > b.date)
    return 1;
  else 
    return 0;
}

function parseTimes(location) {
  // add each relevant date and time to location.dates
  // if it tries to add a date multiple times, it should error
  location.dates = [];
  location.times.forEach(function(time) {
    var dateRange = getDatesBetween(time.firstDate, time.secondDate);
    var daysObject = parseDays(time.days);
    dateRange.forEach(function(date) {
      // if location.time.days includes the weekday of the date in the range between location.times.firstDate
      // and location.times.secondDate, then the polling place is open on that date
      if (daysObject[moment(date, "MM-DD-YYYY").day()]) {
        location.dates.push({
          "date": moment(date, "MM-DD-YYYY").format("YYYY-MM-DD"),
          "time": time.timeRange
        });
      }
    });
  });
  location.dates.sort(compareDates);
  delete location.times;
}