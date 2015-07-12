//
//  IntroVC.swift
//  Early Voting
//
//  Created by Mollie on 6/27/15.
//  Copyright (c) 2015 Code for Atlanta. All rights reserved.
//

import UIKit

var countiesWithElection = Set<String>()

class IntroVC: UIViewController {
    
    @IBOutlet weak var countiesListLabel: UILabel!
    @IBOutlet weak var nextElectionDateLabel: UILabel!
    @IBOutlet weak var registerToVoteLabel: UILabel!
    @IBOutlet weak var findPollingPlaceButton: UIButton!
    @IBOutlet weak var earlyVotingInfoLabel: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        var newLabel = ""
        
        Data.getCurrentElectionDataWithSuccess { (earlyVotingData) -> Void in
            
            let formatToDate = NSDateFormatter()
            formatToDate.dateFormat = "yyyy-MM-dd"
            let formatToString = NSDateFormatter()
            formatToString.dateStyle = NSDateFormatterStyle.LongStyle
            
            
            let json : AnyObject? = NSJSONSerialization.JSONObjectWithData(earlyVotingData, options: nil, error: nil)
            if let jsonObject = json as? [String: AnyObject] {
                if let electionDate = jsonObject["electionDate"] as? String {
                    println(electionDate)
                    // format date
                    let formattedDate = formatToDate.dateFromString(electionDate)
                    let today = NSDate()
                    if today.compare(formattedDate!) == NSComparisonResult.OrderedAscending {
                        // election is upcoming
                        let dateString = formatToString.stringFromDate(formattedDate!)
                        dispatch_async(dispatch_get_main_queue()) {
                            self.earlyVotingInfoLabel.text = "You can vote early at any location in your county"
                            self.nextElectionDateLabel.text = dateString
                            self.findPollingPlaceButton.hidden = false
                        }
                    } else {
                        // election has passed
                        // display next election date
                        if let nextElectionDate = jsonObject["nextElectionDate"] as? String {
                            let formattedNextDate = formatToDate.dateFromString(nextElectionDate)
                            let dateString = formatToString.stringFromDate(formattedNextDate!)
                            dispatch_async(dispatch_get_main_queue()) {
                                self.nextElectionDateLabel.text = dateString
                            }
                        }
                    }
                }
                if let registrationDate = jsonObject["registerThisElection"] as? String {
                    println(registrationDate)
                    // format date
                    let formattedDate = formatToDate.dateFromString(registrationDate)
                    // see if registration has passed
                    let today = NSDate()
                    if today.compare(formattedDate!) == NSComparisonResult.OrderedDescending {
                        // registration has passed
                        if let nextRegistrationDate = jsonObject["registerNextElection"] as? String {
                            let formattedNextDate = formatToDate.dateFromString(nextRegistrationDate)
                            let dateString = formatToString.stringFromDate(formattedNextDate!)
                            dispatch_async(dispatch_get_main_queue()) {
                                self.registerToVoteLabel.text = "Register to vote by " + dateString
                            }
                        }
                    } else {
                        let dateString = formatToString.stringFromDate(formattedDate!)
                        dispatch_async(dispatch_get_main_queue()) {
                            self.registerToVoteLabel.text = "Register to vote by " + dateString
                        }
                    }
                }
                if let features = jsonObject["features"] as? [AnyObject] {
                    for feature in features {
                        if let properties = feature["properties"] as? [String: AnyObject] {
                            if let county = properties["county"] as? String {
                                countiesWithElection.insert(county)
                            }
                        }
                    }
                    
                    println(countiesWithElection)
                }
            }
            
        }

        // Do any additional setup after loading the view.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

}
