# run election-scraper.rb
# run the results through http://konklone.io/json/ and save as data-from-scraper.csv
# then run this file

library(reshape2)
library(plyr) # am i using this?
library(dplyr)
library(data.table)

# import data
scraped <- read.csv("data-from-scraper.csv", header = TRUE)
geo <- read.csv("locations.csv", header = TRUE)

colnames(scraped)

names(scraped) <- sub(".text", "", names(scraped))

scraped <- reshape(scraped,
                        varying   = c("locations.0", "locations.1", "locations.2", "locations.3", "locations.4", "locations.5", "locations.6", "locations.7", "locations.8", "locations.9", "locations.10", "locations.11", "locations.12"),
                        direction = "long",
                        idvar     = "value",
                        sep       = ".")
scraped <- scraped[scraped$locations != "",] # remove blank rows
names(scraped)[names(scraped) == "name"] <- "county"

# create variables (dates, time, weekdays, and zip) for scraped data
# NOTE TO SELF: i'm adding more vars here; be sure to document ^
scraped$start.date <- as.Date(substr(scraped$locations, 1, 10), format = "%m/%d/%Y")
scraped$end.date <- as.Date(substr(scraped$locations, 14, 23), format = "%m/%d/%Y")
scraped$locations <- substring(scraped$locations, 25)
scraped[, c("time", "locations")] <- colsplit(scraped$locations, ", Days: ", names = c("time", "locations"))
scraped[, c("weekdays", "locations")] <- colsplit(scraped$locations, " ", names = c("weekdays", "locations"))

# prepare to merge scraped data with locations.csv
scraped$match <- substr(scraped$locations, 0, 16)
geo$match <- substr(geo$location, 0, 16)
scraped$zip <- gsub(".* ", "", scraped$locations, perl = TRUE)
scraped$zip <- gsub("[A-Za-z]", "", scraped$zip)
geo$zip <- gsub(".* ", "", geo$city, perl = TRUE)
geo$zip <- gsub("[A-Za-z]", "", geo$zip)

# merge by county, zip, and first 16 characters of location
merged <- merge(scraped, geo, by = c("county", "zip", "match"), all.x = TRUE, all.y = FALSE)
missing <- merged[is.na(merged$longitude),]
if (nrow(missing) > 0 || nrow(scraped) != nrow(merged))
  stop("At least one location in data-from-scraper has no match in locations.csv.")

# make data wide again, with one variable per day
weekday.conversion <- data.frame(
  long = c("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"),
  short = c("M", "Tu", "W", "Th","F", "Sa", "Su") # double-check Sunday abbreviation in future data; no Sundays for this election
)

current.year <- format(Sys.Date(), "%Y")
first.date <- min(merged$start.date)
last.date <- max(merged$end.date)
voting.dates <- as.data.frame(seq(first.date, last.date, 1))
colnames(voting.dates) <- "date"
voting.dates[, "long"] <- format(voting.dates, "%A")
voting.dates <- merge(voting.dates, weekday.conversion, by = "long", all.x = TRUE, all.y = FALSE, sort = FALSE)
voting.dates <- voting.dates[order(voting.dates["date"]),]

# is there *any* way to use apply or plyr instead of a loop?

# for each date in voting.dates
merge.command <- "ddply(merged, .(match, county, zip), summarize, "
merge.variables <- NULL
for (index in 1:nrow(voting.dates)) {
  # create a new variable for that date
  var.name <- paste("v", gsub("-", ".", as.character(voting.dates$date[index])), sep = "")
  print(var.name)
  merge.variables <- c(merge.variables, var.name)
  # that variable is true for a specific row if
  # that date is between (inclusive) start.date and end.date
  # and that day of the week is in the weekdays (maybe remove the weekday columns)
  merged[, var.name] <- ifelse(voting.dates$date[index] >= merged$start.date &
                          voting.dates$date[index] <= merged$end.date &
                          grepl(voting.dates$short[index], merged$weekdays), 
                        merged$time, 
                        "")
  # we'll need this later
  ifelse(index == nrow(voting.dates),
    merge.command <- paste(merge.command, var.name, " = max(", var.name, "))", sep = ""),
    merge.command <- paste(merge.command, var.name, " = max(", var.name, "), ", sep = ""))
}

# make data short, with one row per polling place
RemoveEmpties <- function(x) x[x != '']
# drop columns that aren't the same for all rows for that polling place
merged <- subset(merged, select = -c(start.date, end.date, weekdays, time, match, locations))
flattened <- setDT(merged)[, lapply(.SD, RemoveEmpties), by = list(county, location, address, city, zip, value, longitude, latitude)]

write.csv(flattened, "data-from-scraper-with-coords.csv", row.names = FALSE)
