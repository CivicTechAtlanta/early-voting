//
//  CountiesTVC.swift
//  Early Voting
//
//  Created by Mollie on 6/27/15.
//  Copyright (c) 2015 Code for Atlanta. All rights reserved.
//

import UIKit

class CountiesTVC: UITableViewController, UISearchResultsUpdating {
    
    var filteredCounties = [String]()
    var resultSearchController = UISearchController()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.title = "Select Your County"
        
        self.resultSearchController = ({
            let controller = UISearchController(searchResultsController: nil)
            controller.searchResultsUpdater = self
            controller.dimsBackgroundDuringPresentation = false
            controller.searchBar.sizeToFit()
            
            self.tableView.tableHeaderView = controller.searchBar
            
            return controller
        })()
        
        self.tableView.reloadData()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if self.resultSearchController.active {
            return self.filteredCounties.count
        } else {
            return gaCounties.count
        }
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("cell", forIndexPath: indexPath) as! UITableViewCell
        
        
        var county = ""
        if self.resultSearchController.active {
            county = filteredCounties[indexPath.row]
        } else {
            county = gaCounties[indexPath.row]
        }

        cell.textLabel?.text = county
        
        // add disclosure indicator programmatically if there is an election in the county
        // otherwise add a subtitle "no election"
        if countiesWithElection.contains(county) {
            cell.accessoryType = UITableViewCellAccessoryType.DisclosureIndicator
            cell.detailTextLabel?.text = " "
        } else {
            cell.accessoryType = UITableViewCellAccessoryType.None
            cell.detailTextLabel?.text = "No election"
        }
        
        // maybe sort by whether or not there is an election

        return cell
    }
    
    func updateSearchResultsForSearchController(searchController: UISearchController) {
        filteredCounties.removeAll(keepCapacity: false)
        
        let searchPredicate = NSPredicate(format: "SELF CONTAINS[c] %@", searchController.searchBar.text)
        let array = (gaCounties as NSArray).filteredArrayUsingPredicate(searchPredicate)
        filteredCounties = array as! [String]
        
        self.tableView.reloadData()
    }

}
