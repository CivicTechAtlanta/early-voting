    npm install phantomjs -g
    npm install moment
    npm install tracer
    gem install capybara
    gem install poltergeist

    ruby election-scraper.rb
    # save the scraped data to scraped/html-from-scraper-[ELECTION_DATE].json
    # change line 1 of process-html.js to match ELECTION_DATE
    node process-html.js
    # if you get error 'Polling place is unknown: not available in polling-places.json', add the polling place to the json (make sure the polling place isn't already in there under another name)
    cp -f scraped/processed-[yyyymmdd].geojson ../angular/app/data/elections/[yyyymmdd]-locations.geojson

# To serve and deploy the app
    cd ../angular
    grunt serve
    grunt build
    grunt upload [you will need the AWS tokens]

# To run tests of parser:
    cd early-voting/scraper
    npm install
    npm test

View http://localhost:8001/ in browser
