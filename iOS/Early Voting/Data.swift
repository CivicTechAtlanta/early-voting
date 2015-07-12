//
//  Data.swift
//  Early Voting
//
//  Created by Mollie on 6/27/15.
//  Copyright (c) 2015 Code for Atlanta. All rights reserved.
//

import UIKit

let currentElectionData = "https://raw.githubusercontent.com/codeforatlanta/early-voting/master/20150714-locations.geojson"
//let currentElectionData = "http://10.0.0.2:8000/20150714-locations.geojson"

let gaCounties: [String] = ["Atkinson", "Bacon", "Baker", "Baldwin", "Banks", "Barrow", "Bartow", "Ben Hill", "Berrien", "Bibb", "Bleckley", "Brantley", "Brooks", "Bryan", "Bulloch", "Burke", "Butts", "Calhoun", "Camden", "Candler", "Carroll", "Catoosa", "Charlton", "Chatham", "Chattahoochee", "Chattooga", "Cherokee", "Clarke", "Clay", "Clayton", "Clinch", "Cobb", "Coffee", "Colquitt", "Columbia", "Cook", "Coweta", "Crawford", "Crisp", "Dade", "Dawson", "Decatur", "DeKalb", "Dodge", "Dooly", "Dougherty", "Douglas", "Early", "Echols", "Effingham", "Elbert", "Emanuel", "Evans", "Fannin", "Fayette", "Floyd", "Forsyth", "Franklin", "Fulton", "Gilmer", "Glascock", "Glynn", "Gordon", "Grady", "Greene", "Gwinnett", "Habersham", "Hall", "Hancock", "Haralson", "Harris", "Hart", "Heard", "Henry", "Houston", "Irwin", "Jackson", "Jasper", "Jeff Davis", "Jefferson", "Jenkins", "Johnson", "Jones", "Lamar", "Lanier", "Laurens", "Lee", "Liberty", "Lincoln", "Long", "Lowndes", "Lumpkin", "Macon", "Madison", "Marion", "McDuffie", "McIntosh", "Meriwether", "Miller", "Mitchell", "Monroe", "Montgomery", "Morgan", "Murray", "Muscogee", "Newton", "Oconee", "Oglethorpe", "Paulding", "Peach", "Pickens", "Pierce", "Pike", "Polk", "Pulaski", "Putnam", "Quitman", "Rabun", "Randolph", "Richmond", "Rockdale", "Schley", "Screven", "Seminole", "Spalding", "Stephens", "Stewart", "Sumter", "Talbot", "Taliaferro", "Tattnall", "Taylor", "Telfair", "Terrell", "Thomas", "Tift", "Toombs", "Towns", "Treutlen", "Troup", "Turner", "Twiggs", "Union", "Upson", "Walker", "Walton", "Ware", "Warren", "Washington", "Wayne", "Webster", "Wheeler", "White", "Whitfield", "Wilcox", "Wilkes", "Wilkinson", "Worth"]

let bBoxes = NSArray(contentsOfFile: NSBundle.mainBundle().pathForResource("Counties", ofType: "plist")!)

class Data: NSObject {
    
    // cache this
    static var earlyVotingData = NSData()
    static var importantDates = [String:NSDate]()
    static var countiesWithElection = Set<String>()
    static var pollingPlaceData = [AnyObject]()
    
    class func getLocationInfo(location: [String:AnyObject]) -> Dictionary<String, AnyObject> {
        
        var locationInfo = Dictionary<String, AnyObject>()
    
        if let geometry = location["geometry"] as? [String:AnyObject] {
            if let coordinates = geometry["coordinates"] as? [Double] {
                locationInfo["latitude"] = coordinates[1]
                locationInfo["longitude"] = coordinates[0]
            }
        }
        
        if let properties = location["properties"] as? [String:AnyObject] {
            locationInfo["county"] = properties["county"]
            locationInfo["location"] = properties["location"]
            locationInfo["address"] = properties["address"]
            locationInfo["city"] = properties["city"]
            locationInfo["address"] = properties["address"]
            locationInfo["zip"] = properties["zip"]
//            if let dates = properties["dates"] as? [String:AnyObject] {
//                println(dates)
//            }
            locationInfo["dates"] = properties["dates"]
        }
        
        return locationInfo
    }
    
    class func getLocationsForCounty(selectedCounty: String) -> [AnyObject] {
        
        var countyLocations = [AnyObject]()
        
        for place in pollingPlaceData {
            if let properties = place["properties"] as? [String:AnyObject] {
                if let county = properties["county"] as? String {
                    if county == selectedCounty {
                        let location = getLocationInfo(place as! [String : AnyObject])
                        countyLocations.append(location)
                    }
                }
            }
        }
        
        return countyLocations
    }

    class func getDates() {
        
        let formatToDate = NSDateFormatter()
        formatToDate.dateFormat = "yyyy-MM-dd"
        let formatToString = NSDateFormatter()
        formatToString.dateStyle = NSDateFormatterStyle.LongStyle
        
        
        let json : AnyObject? = NSJSONSerialization.JSONObjectWithData(earlyVotingData, options: nil, error: nil)
        if let jsonObject = json as? [String: AnyObject] {
            if let electionDate = jsonObject["electionDate"] as? String { Data.importantDates["electionDate"] = formatToDate.dateFromString(electionDate) }
            if let votingStartDate = jsonObject["votingStartDate"] as? String { Data.importantDates["votingStartDate"] = formatToDate.dateFromString(votingStartDate) }
            if let votingEndDate = jsonObject["votingEndDate"] as? String { Data.importantDates["votingEndDate"] = formatToDate.dateFromString(votingEndDate) }
            if let registerThisElection = jsonObject["registerThisElection"] as? String { Data.importantDates["registerThisElection"] = formatToDate.dateFromString(registerThisElection) }
            if let nextElectionDate = jsonObject["nextElectionDate"] as? String { Data.importantDates["nextElectionDate"] = formatToDate.dateFromString(nextElectionDate) }
            if let registerNextElection = jsonObject["registerNextElection"] as? String { Data.importantDates["registerNextElection"] = formatToDate.dateFromString(registerNextElection) }
            if let lastUpdate = jsonObject["lastUpdate"] as? String { Data.importantDates["lastUpdate"] = formatToDate.dateFromString(lastUpdate) }
            
            if let features = jsonObject["features"] as? [AnyObject] {
                Data.pollingPlaceData = features
                for feature in features {
                    if let properties = feature["properties"] as? [String: AnyObject] {
                        if let county = properties["county"] as? String {
                            Data.countiesWithElection.insert(county)
                        }
                    }
                }
            }
        }
    }
    
    class func getBBoxForCounty(county: String) -> [Double] {
        for countyData in bBoxes! {
            if let name = countyData["Name"] as? String {
                if name == county {
                    if let bBox = countyData["bbox"] as? [Double] {
                        return bBox
                    }
                    break
                }
            }
        }
        return []
    }
    
    class func getCurrentElectionDataWithSuccess(success: ((completeData: NSData!) -> Void)) {
        
        loadDataFromURL(NSURL(string: currentElectionData)!, completion:{ (data, error) -> Void in
            
            if let urlData = data {
                
                Data.earlyVotingData = urlData
                
                Data.getDates() // if lastUpdate is new
                
                success(completeData: urlData)
                
            }
        })
    }
    
    class func loadDataFromURL(url: NSURL, completion:(data: NSData?, error: NSError?) -> Void) {
        var session = NSURLSession.sharedSession()
        
        // Use NSURLSession to get data from an NSURL
        let loadDataTask = session.dataTaskWithURL(url, completionHandler: { (data: NSData!, response: NSURLResponse!, error: NSError!) -> Void in
            if let responseError = error {
                completion(data: nil, error: responseError)
            } else if let httpResponse = response as? NSHTTPURLResponse {
                if httpResponse.statusCode != 200 {
                    var statusError = NSError(domain:"org.codeforatlanta", code:httpResponse.statusCode, userInfo:[NSLocalizedDescriptionKey : "HTTP status code has unexpected value."])
                    completion(data: nil, error: statusError)
                } else {
                    completion(data: data, error: nil)
                }
            }
        })
        
        loadDataTask.resume()
    }
   
}
