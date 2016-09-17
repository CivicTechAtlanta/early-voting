var test = require('tape');
var processHTML = require('../process-html'); // my actual package

// // it should throw an error if the second date listed for a polling place is chronologically before the first

test('parseLocation should handle missing place names', function(t) {
    t.plan(2);
  	var input = { text: '<span id="ctl00_ContentPlaceHolder2_rptVotingInformation_ctl02_lblLocationDetail" class="standardfont">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>05/16/2016 - 05/20/2016</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8:30 AM - 5:00 PM, Days: M,Tu,W,Th,F<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;125 Pine Ave<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Albany, GA&nbsp;&nbsp;31701<br><br></span>',
		  county: 'Dougherty',
		  countyID: '47' };
	var output = processHTML.parseLocation(input);
    t.equal(output.name, '');
    t.equal(output.address1, '125 Pine Ave');
});

test('getDatesBetween should be able to get dates between 12/30/2015 and 01/04/2016', function(t) {
    t.plan(1);
    t.deepEqual(processHTML.getDatesBetween('12/30/2015', '01/04/2016'), [ '12/30/2015', '12/31/2015', '01/01/2016', '01/02/2016', '01/03/2016', '01/04/2016' ]);
});

test('findZip should handle 9-digit zips', function(t) {
    t.plan(2);
    var input = { text: 'Wilkes County Courthouse<br>23 Court Street, Room 113<br>Washington, GA30673-1570<br><br>' };
    var output = processHTML.findZip(input);
    t.equal(output.zip, '30673-1570');
    t.equal(output.text, 'Wilkes County Courthouse<br>23 Court Street, Room 113<br>Washington');
});

// TODO: make a passing (t.doesNotThrow) version of this test
test('findZip should throw error if there\'s no \'GA\'', function(t) {
    t.plan(1);
    var input = { text: 'Wilkes County Courthouse<br>23 Court Street, Room 113<br>Washington, 30673-1570<br><br>' };
    // TODO: Test error text: "No state found, therefore no zip code identified"
    t.throws(function() {
        processHTML.findZip(input);
    }, Error);
});

test('findZip should throw error if there are two \' GA\'s', function(t) {
    t.plan(1);
    // TODO: Test error text: "No state found, therefore no zip code identified"    
    var input = { text: 'Wilkes County Courthouse<br>23 Court Street, Room 113, GA<br>Washington, GA30673-1570<br><br>' };
    t.throws(function() {
        processHTML.findZip(input);
    }, Error);
});

test('findCity should find the city', function(t) {
    t.plan(1);
    var input = { text: 'Cherokee County Elections & Registration<br>400 East Main Street<br>Canton' };
    t.equal(processHTML.findCity(input).city, 'Canton');
});

test('findCity should find two-word cities', function(t) {
    t.plan(1);
    var input = { text: 'Ball Ground Public Library<br>435 Old Canton Road<br>Ball Ground' };
    t.equal(processHTML.findCity(input).city, 'Ball Ground');
});

test('findCity should find hyphenated cities', function(t) {
    t.plan(1);
    var input = { text: 'Ball Ground Public Library<br>435 Old Canton Road<br>Fake-City' };
    t.equal(processHTML.findCity(input).city, 'Fake-City');
});

test('mergeWithKnownData should return location with coordinates', function(t) {
    t.plan(3);
    var location = { county: 'Taliaferro', countyID: '131', firstDate: '05/14/2016', secondDate: '05/14/2016', timeRange: '9:00 AM - 4:00 PM', firstTime: '9:00 AM', secondTime: '4:00 PM', days: 'Sa', zip: '', city: 'Crawfordville', name: 'Taliaferro County Courthouse', address1: '113 Monument Street' };
    var knownData = [{"name":"Taliaferro","id":"131","locations":[{"name":"Taliaferro County Courthouse","address1":"113 Monument Street","city":"Crawfordville","zip":"","coordinates":[-82.8966592,33.5546265]}]}];
    var output = processHTML.mergeWithKnownData(location, knownData);
    t.ok(output.coordinates); // similar to expect(output.coordinates).not.toBeUndefined();
    t.equal(output.coordinates[0], -82.8966592);
    t.equal(output.coordinates[1], 33.5546265);
});

test('mergeWithKnownData should throw an error if polling-places.json is missing a coordinate for a polling place of interest', function(t) {
    t.plan(1);
    // TODO: Test error text: "Polling place missing coordinates in polling-places.json"  
    var location = { county: 'Talbot', countyID: '130', firstDate: '05/16/2016', secondDate: '05/20/2016', timeRange: '9:00 AM - 4:00 PM', firstTime: '9:00 AM', secondTime: '4:00 PM', days: 'M,Tu,W,Th,F', zip: '31827', city: 'Talbotton', name: 'Talbot County  Board of Elections and Reg.', address1: '141 N. Jefferson Av' };
    var knownData = [{"name":"Talbot","id":"130","locations":[{"name":"Talbot County  Board of Elections and Reg.","address1":"141 N. Jefferson Av","city":"Talbotton","zip":"31827","coordinates":[]}]}];
    t.throws(function() {
        processHTML.mergeWithKnownData(location, knownData);
    }, Error);
});

// // test mergeWithKnownData
// // pass it location = 
// // pass it knownData = 
// // should fail because knownData is missing coordinates

// // test that warns work properly (in SpecRunner, import tracer)


// write tests for simplifyDates
test('simplifyDates should return sensible output', function(t) {
    t.plan(5); // number of tests to run
        var sylvester = {"name":"Worth County Courthouse","address1":"Voter Registration & Board of Elections","address2":"201 North Main Street, Room 10","city":"Sylvester","zip":"31791","coordinates":[-83.8361921,31.5279619],"dates":[{"date":"2016-10-17","time":"8:00 AM - 5:00 PM"},{"date":"2016-10-18","time":"8:00 AM - 5:00 PM"},{"date":"2016-10-19","time":"8:00 AM - 5:00 PM"},{"date":"2016-10-20","time":"8:00 AM - 5:00 PM"},{"date":"2016-10-21","time":"8:00 AM - 5:00 PM"},{"date":"2016-10-24","time":"8:00 AM - 5:00 PM"},{"date":"2016-10-25","time":"8:00 AM - 5:00 PM"},{"date":"2016-10-26","time":"8:00 AM - 5:00 PM"},{"date":"2016-10-27","time":"8:00 AM - 5:00 PM"},{"date":"2016-10-28","time":"8:00 AM - 5:00 PM"},{"date":"2016-10-29","time":"9:00 AM - 4:00 PM"},{"date":"2016-10-31","time":"8:00 AM - 5:00 PM"},{"date":"2016-11-01","time":"8:00 AM - 5:00 PM"},{"date":"2016-11-02","time":"8:00 AM - 5:00 PM"},{"date":"2016-11-03","time":"8:00 AM - 5:00 PM"},{"date":"2016-11-04","time":"8:00 AM - 5:00 PM"}]};
        var sylvesterExpected = "10/17-11/04 M-F 8am - 5pm<br>10/29 Sa 9am - 4pm";
        var mcDonough = {"name":"Elections and Registration","address1":"40 Atlanta St","city":"McDonough","zip":"30253","coordinates":[-84.14831,33.4487898],"dates":[{"date":"2015-10-12","time":"8:00 AM - 5:00 PM"},{"date":"2015-10-13","time":"8:00 AM - 5:00 PM"},{"date":"2015-10-14","time":"8:00 AM - 5:00 PM"},{"date":"2015-10-15","time":"8:00 AM - 5:00 PM"},{"date":"2015-10-16","time":"8:00 AM - 5:00 PM"},{"date":"2015-10-19","time":"7:00 AM - 7:00 PM"},{"date":"2015-10-20","time":"7:00 AM - 7:00 PM"},{"date":"2015-10-21","time":"7:00 AM - 7:00 PM"},{"date":"2015-10-22","time":"7:00 AM - 7:00 PM"},{"date":"2015-10-23","time":"7:00 AM - 7:00 PM"},{"date":"2015-10-24","time":"7:00 AM - 4:00 PM"},{"date":"2015-10-25","time":"Closed"},{"date":"2015-10-26","time":"7:00 AM - 7:00 PM"},{"date":"2015-10-27","time":"7:00 AM - 7:00 PM"},{"date":"2015-10-28","time":"7:00 AM - 7:00 PM"},{"date":"2015-10-29","time":"7:00 AM - 7:00 PM"},{"date":"2015-10-30","time":"7:00 AM - 7:00 PM"}]};
        var mcDonoughExpected = "10/12-10/26 M-F 8am - 5pm<br>10/19-10/24 M-F 7am - 7pm Sa 7am - 4pm<br>10/26-10/30 M-F 7am - 7pm";
        var lunch = {"name":"Registrar's Office","address1":"408 Thomaston Street","city":"Barnesville","zip":"30204","coordinates":[-84.15761,33.0519465],"dates":[{"date":"2015-10-12","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-13","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-14","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-15","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-16","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-19","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-20","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-21","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-22","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-23","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-24","time":"Closed"},{"date":"2015-10-25","time":"Closed"},{"date":"2015-10-26","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-27","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-28","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-29","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"},{"date":"2015-10-30","time":"8:00 AM - 12:30 PM, 1:30 PM - 5:00 PM"}]};
        var lunchExpected = "10/12-10/30 M-F 8am - 12:30pm, 1:30pm - 5pm";
        var twoDays = {"name":"Georgia Institute Technology","address1":"William C. Wardlaw Jr. Center-The Poole Board Room","address2":"177 North Ave. ","city":"Atlanta","zip":"30332","coordinates":[-84.3929338,33.7716014],"dates":[{"date":"2016-10-18","time":"8:30 AM - 4:00 PM"},{"date":"2016-10-19","time":"8:30 AM - 4:00 PM"}]};
        var twoDaysExpected = "10/18-10/19 Tu-W 8:30am - 4pm";
    var weekendOnly = {"name":"Helene S. Mills Senior Multi-Purpose","address1":"515 John Wesley Dobbs Ave., NE","city":"Atlanta","zip":"30312","coordinates":[-84.3711505,33.7587541],"dates":[{"date":"2016-10-22","time":"7:00 AM - 7:00 PM"},{"date":"2016-10-23","time":"12:00 PM - 5:00 PM"}]};
    var weekendOnlyExpected = "10/22-10/23 Sa 7am - 7pm Su 12pm - 5pm";
    t.equal(processHTML.simplifyDates(sylvester), sylvesterExpected);
    t.equal(processHTML.simplifyDates(mcDonough), mcDonoughExpected);
    t.equal(processHTML.simplifyDates(lunch), lunchExpected);
    t.equal(processHTML.simplifyDates(twoDays), twoDaysExpected);
    t.equal(processHTML.simplifyDates(weekendOnly), weekendOnlyExpected);
});

// TODO: test getDaysOfWeekString
test('getDaysOfWeekString should handle M-F', function(t) {
    t.plan(1);
    var input = { Mo: true, Tu: true, We: true, Th: true, Fr: true, Sa: false, Su: false };
    t.equal(processHTML.getDaysOfWeekString(input), 'M-F');
});

test('getDaysOfWeekString should handle Sa-Su', function(t) {
    t.plan(1);
    var input = { Mo: false, Tu: false, We: false, Th: false, Fr: false, Sa: true, Su: true };
    t.equal(processHTML.getDaysOfWeekString(input), 'Sa-Su');
});

test('getDaysOfWeekString should handle Su-M', function(t) {
    t.plan(1);
    var input = { Mo: true, Tu: false, We: false, Th: false, Fr: false, Sa: false, Su: true };
    t.equal(processHTML.getDaysOfWeekString(input), 'Su-M');
});

