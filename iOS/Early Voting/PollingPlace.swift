//
//  PollingPlace.swift
//  Early Voting
//
//  Created by Mollie on 7/12/15.
//  Copyright (c) 2015 Code for Atlanta. All rights reserved.
//

import UIKit
import MapKit

class PollingPlace: NSObject, MKAnnotation {
    let title: String
    let subtitle: String
    let coordinate: CLLocationCoordinate2D
    let data: [String:AnyObject]

    init(data: [String:AnyObject]) {
        self.title = data["location"] as! String
        self.subtitle = data["address"] as! String
        self.coordinate = CLLocationCoordinate2DMake(data["latitude"] as! Double, data["longitude"] as! Double)
        self.data = data
        
        super.init()
    }
    
}
