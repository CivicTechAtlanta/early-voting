    npm install phantomjs-prebuilt
    npm install moment
    npm install tracer
    sudo gem install capybara
    sudo gem install poltergeist
    ruby election-scraper.rb
    # save the scraped data to scraped/html-from-scraper-[ELECTION_DATE].json
    # change line 1 of process-html.js to match ELECTION_DATE
    node process-html.js
    # if you get error 'Polling place is unknown: not available in polling-places.json', add the polling place to the json (make sure the polling place isn't already in there under another name)


# To run tests of parser:
    cd early-voting/scraper
    npm install
    npm test

View http://localhost:8001/ in browser
