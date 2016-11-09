#Contributors:

* Want to help out? [Look at the issues](https://github.com/codeforatlanta/early-voting/issues) or just find something you can improve and submit a pull request. You can also join [Code for Atlanta's Slack](http://slack.codeforatlanta.org/), then join channel #early-voting to collaborate with others working on the project.. Thanks!

#To run the angular app:

    cd angular
    bower install
    npm install
    gem install compass
    grunt serve

#To deploy the app (if you have the AWS token):

Uncomment line 442 of `/angular/Gruntfile.js`

    grunt build
    grunt upload

#About the directories:

* `angular` is the current version of the webapp.
* `scraper` is a scraper for getting the data from the Secretary of State's website and a script to wrangle that data into something useable.
* `old data` contains some very early data from elections, kept for posterity. More old data is in `scraper/scraped`.
