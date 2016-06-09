// it should throw an error if the second date listed for a polling place is chronologically before the first

var parser = require('../process-html.js');

describe("parseLocation", function() {
  it("should handle missing place names", function() {
  	var input = { text: '<span id="ctl00_ContentPlaceHolder2_rptVotingInformation_ctl02_lblLocationDetail" class="standardfont">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>05/16/2016 - 05/20/2016</b><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8:30 AM - 5:00 PM, Days: M,Tu,W,Th,F<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;125 Pine Ave<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Albany, GA&nbsp;&nbsp;31701<br><br></span>',
		  county: 'Dougherty',
		  countyID: '47' };
	var output = parser.parseLocation(input);
	expect(output.name).toEqual('');
	expect(output.address1).toEqual('125 Pine Ave');
  });
});

describe("getDatesBetween", function() {
  it("should be able to get dates between 12/30/2015 and 01/04/2016", function() {
    expect(parser.getDatesBetween('12/30/2015', '01/04/2016')).toEqual(["12/30/2015", "12/31/2015", "01/01/2016", "01/02/2016", "01/03/2016", "01/04/2016"]);
  });
});

describe("findZip", function() {
	it("should handle 9-digit zips", function() {
		var input = { text: 'Wilkes County Courthouse<br>23 Court Street, Room 113<br>Washington, GA30673-1570<br><br>' };
		var output = parser.findZip(input);
		expect(output.zip).toEqual('30673-1570');
		expect(output.text).toEqual('Wilkes County Courthouse<br>23 Court Street, Room 113<br>Washington');
	});

	it("should throw error if there's no 'GA'", function() {
		var input = { text: 'Wilkes County Courthouse<br>23 Court Street, Room 113<br>Washington, 30673-1570<br><br>' };
		expect(function() {
			parser.findZip(input);
		}).toThrow(new Error("No state found, therefore no zip code identified"));
	});

	it("should throw error if there are two ', GA's", function() {
		var input = { text: 'Wilkes County Courthouse<br>23 Court Street, Room 113, GA<br>Washington, GA30673-1570<br><br>' };
		expect(function() {
			parser.findZip(input);
		}).toThrow(new Error("No state found, therefore no zip code identified"));
	});
});

describe("findCity", function() {
	it("should find the city", function() {
		var input = { text: 'Cherokee County Elections & Registration<br>400 East Main Street<br>Canton' };
		var output = parser.findCity(input);
		expect(output.city).toEqual('Canton');
	});

	it("should find two-word cities", function() {
		var input = { text: 'Ball Ground Public Library<br>435 Old Canton Road<br>Ball Ground' };
		var output = parser.findCity(input);
		expect(output.city).toEqual('Ball Ground');
	});

	it("should find hyphenated cities", function() {
		var input = { text: 'Ball Ground Public Library<br>435 Old Canton Road<br>Fake-City' };
		var output = parser.findCity(input);
		expect(output.city).toEqual('Fake-City');
	});
});

describe("mergeWithKnownData", function() {
	it("should return location with coordinates", function() {
		// remove dates
		var location = { county: 'Taliaferro', countyID: '131', firstDate: '05/14/2016', secondDate: '05/14/2016', timeRange: '9:00 AM - 4:00 PM', firstTime: '9:00 AM', secondTime: '4:00 PM', days: 'Sa', zip: '', city: 'Crawfordville', name: 'Taliaferro County Courthouse', address1: '113 Monument Street' }
		var knownData = [{"name":"Taliaferro","id":"131","locations":[{"name":"Taliaferro County Courthouse","address1":"113 Monument Street","city":"Crawfordville","zip":"","coordinates":[-82.8966592,33.5546265]}]}];
		// expect coords to be [-82.8966592,33.5546265]
		var output = parser.mergeWithKnownData(location, knownData);
		expect(output.coordinates).not.toBeUndefined();
		expect(output.coordinates[0]).toEqual(-82.8966592);
		expect(output.coordinates[1]).toEqual(33.5546265);
	});

	it("should throw an error if polling-places.json is missing a coordinate for a polling place of interest", function() {
	 var location = { county: 'Talbot', countyID: '130', firstDate: '05/16/2016', secondDate: '05/20/2016', timeRange: '9:00 AM - 4:00 PM', firstTime: '9:00 AM', secondTime: '4:00 PM', days: 'M,Tu,W,Th,F', zip: '31827', city: 'Talbotton', name: 'Talbot County  Board of Elections and Reg.', address1: '141 N. Jefferson Av' }
		var knownData = [{"name":"Talbot","id":"130","locations":[{"name":"Talbot County  Board of Elections and Reg.","address1":"141 N. Jefferson Av","city":"Talbotton","zip":"31827","coordinates":[]}]}];
		expect(function() {
			parser.mergeWithKnownData(location, knownData);
		}).toThrow(new Error("Polling place missing coordinates in polling-places.json"));
	});
});

// test mergeWithKnownData
// pass it location = 
// pass it knownData = 
// should fail because knownData is missing coordinates

// test that warns work properly (in SpecRunner, import tracer)
