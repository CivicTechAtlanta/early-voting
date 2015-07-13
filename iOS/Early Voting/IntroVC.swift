//
//  IntroVC.swift
//  Early Voting
//
//  Created by Mollie on 6/27/15.
//  Copyright (c) 2015 Code for Atlanta. All rights reserved.
//

import UIKit

class IntroVC: UIViewController {
    
    @IBOutlet weak var countiesListLabel: UILabel!
    @IBOutlet weak var nextElectionDateLabel: UILabel!
    @IBOutlet weak var earlyVotingDateLabel: UILabel!
    @IBOutlet weak var registerToVoteLabel: UILabel!
    @IBOutlet weak var findPollingPlaceButton: UIButton!
    @IBOutlet weak var earlyVotingInfoLabel: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        Data.getCurrentElectionDataWithSuccess { (earlyVotingData) -> Void in
            
            Data.getLocationsForCounty("Forsyth")
            
            let formatToDate = NSDateFormatter()
            formatToDate.dateFormat = "yyyy-MM-dd"
            let formatToString = NSDateFormatter()
            formatToString.dateStyle = NSDateFormatterStyle.LongStyle
            let importantDates = Data.importantDates
            
            let today = NSDate()
            if today.compare(importantDates["electionDate"]!) == NSComparisonResult.OrderedAscending {
                let dateString = formatToString.stringFromDate(importantDates["electionDate"]!)
                let earlyString = formatToString.stringFromDate(importantDates["votingStartDate"]!)
                dispatch_async(dispatch_get_main_queue()) {
                    self.earlyVotingInfoLabel.text = "You can vote early at any location in your county"
                    self.nextElectionDateLabel.text = "The next Georgia election is " + dateString
                    self.findPollingPlaceButton.hidden = false
                    self.earlyVotingDateLabel.text = "Early voting begins " + earlyString
                }
            } else {
                // election has passed
                // display next election date
                let dateString = formatToString.stringFromDate(importantDates["nextElectionDate"]!)
                dispatch_async(dispatch_get_main_queue()) {
                    self.nextElectionDateLabel.text = "The next Georgia election is " + dateString
                    self.earlyVotingDateLabel.text = ""
                }
            }
            
            if today.compare(importantDates["registerThisElection"]!) == NSComparisonResult.OrderedDescending {
                // registration has passed
                let dateString = formatToString.stringFromDate(importantDates["registerNextElection"]!)
                if today.compare(importantDates["electionDate"]!) == NSComparisonResult.OrderedAscending {
                    dispatch_async(dispatch_get_main_queue()) {
                        self.registerToVoteLabel.text = "Register to vote for the next election by " + dateString
                    }
                } else {
                    // election has passed
                    dispatch_async(dispatch_get_main_queue()) {
                        self.registerToVoteLabel.text = "Register to vote by " + dateString
                    }
                }
            } else {
                let dateString = formatToString.stringFromDate(importantDates["registerThisElection"]!)
                dispatch_async(dispatch_get_main_queue()) {
                    self.registerToVoteLabel.text = "Register to vote by " + dateString
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
