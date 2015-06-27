import json
import re
from pprint import pprint

with open('data-from-scraper.json') as scraped_data:
	data = json.load(scraped_data)

with open('locations.json') as location_data:
	geodata = json.load(location_data)

counter = 0

# test to see if zip code will identify polling places
geo_zips = []
n_polling_places = 0

# before doing all this stuff, we should condense each location to a single line

for county in data:
	# pprint('COUNTY:')
	# pprint(county["name"])
	# pprint(county["value"])
	for location in county["locations"]:
		n_polling_places += 1
		location_coordinates = []

		location_info = location["text"]
		location_dates = location_info[0:23]
		location_info = location_info[24:]
		location_time = location_info.split(',', 1)[0]
		location_info = location_info.split(',', 1)[1][7:]
		location_weekdays = location_info.split(' ', 1)[0]
		location_info = location_info.split(' ', 1)[1]
		print location_info
		# if this location_info = another location_info, they're the same place
		# condense data to have just one location_info and county and one dictionary of dates, times, and weekdays
		# then once that is done, break location_info out into name, address, zip, and then geocode
		location_name = re.sub(r'[0-9]+.*', '', location_info).rstrip()
		match_address = re.search(r'[0-9]+.*', location_info)
		location_full_address = match_address.group(0)
		location_zip = location_full_address[-5:]

		found = False
		for geo in geodata:
			geo_zip = geo["City"][-5:]
			if geo["County"] == county["name"]:
				if location_name == "":
					if geo_zip == location_zip:
						location_coordinates = geo["coordinates"]
						counter += 1
						found = True #hopefully
						break
				elif geo["Location"][0:20] == location_name[0:20]:
					location_coordinates = geo["coordinates"]
					counter += 1
					found = True
					break
		if found == False:
			print "ERROR: Polling place geography not found!"
			pprint(geo["Location"])
			pprint(location_name)
			pprint(location_info)
			pprint(location)
		print location_coordinates
print "Number of matches:", counter
print "Number of polling places:", n_polling_places