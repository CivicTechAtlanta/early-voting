//
//  PollingPlaceVC.swift
//  Early Voting
//
//  Created by Mollie on 7/12/15.
//  Copyright (c) 2015 Code for Atlanta. All rights reserved.
//

import UIKit

class PollingPlaceVC: UIViewController, UITableViewDelegate, UITableViewDataSource {

    @IBOutlet weak var tableView: UITableView!
    
    var openDates = [String]()
    var pollingPlace = [String:AnyObject]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        openDates = Data.openDates
        
        println("test")
        println(pollingPlace)
        
        tableView.delegate = self
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return openDates.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCellWithIdentifier("cell", forIndexPath: indexPath) as! UITableViewCell
        
        let date = openDates[indexPath.row]
        cell.textLabel?.text = date
        if let dates = pollingPlace["dates"] as? [String:AnyObject] {
            if let time = dates[date] as? String {
                cell.detailTextLabel?.text = time
            } else if let times = dates[date] as? [String:AnyObject] {
                // convert time format
                let startTime = times["startTime"] as! String
                let endTime = times["endTime"] as! String
                let formatAsDate = NSDateFormatter()
                formatAsDate.dateFormat = "HH:mm:ss"
                let startTimeDate = formatAsDate.dateFromString(startTime)
                let endTimeDate = formatAsDate.dateFromString(endTime)
                let formatter = NSDateFormatter()
                formatter.timeStyle = NSDateFormatterStyle.ShortStyle
                let startTimeString = formatter.stringFromDate(startTimeDate!)
                let endTimeString = formatter.stringFromDate(endTimeDate!)
                cell.detailTextLabel?.text = startTimeString + " - " + endTimeString
            } else {
                cell.detailTextLabel?.text = "Closed"
            }
        }
        
        return cell
    }

}
