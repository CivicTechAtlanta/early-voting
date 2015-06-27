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

    override func viewDidLoad() {
        super.viewDidLoad()
        
        var newLabel = ""
        
        Data.getTopAppsDataFromItunesWithSuccess { (earlyVotingData) -> Void in
            
            let json : AnyObject? = NSJSONSerialization.JSONObjectWithData(earlyVotingData, options: nil, error: nil)
            if let jsonObject = json as? [String: AnyObject] {
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
