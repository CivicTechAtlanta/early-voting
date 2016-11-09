# early-voting

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## To deploy the app (if you have the AWS token)

Uncomment line 442 of `/angular/Gruntfile.js`

    grunt build
    grunt upload

## Update site for a new election
1. Run the scraper (follow instructions in `scraper/README.md`.
2. Copy `scraper/scraped/processed-DATE.geojson` to `angular/app/data/elections/DATE-locations.geojson`.
3. Change the dates in `.constant` in `angular/app/scripts/app.js` to the relevant election dates. Verify that the election date matches the date in the filename from step 2.
4. Run `grunt serve` and the site will update with the new data.
5. Deploy.
