//
//  MapVC.swift
//  Early Voting
//
//  Created by Mollie on 6/27/15.
//  Copyright (c) 2015 Code for Atlanta. All rights reserved.
//

import UIKit
import MapKit

class MapVC: UIViewController, MKMapViewDelegate, MBXRasterTileOverlayDelegate {
    
    @IBOutlet weak var mapView: MKMapView!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let countyLocations = Data.getLocationsForCounty(selectedCounty)
        println(countyLocations)
        
        title = selectedCounty
        
        mapView.delegate = self
        
        MBXMapKit.setAccessToken("pk.eyJ1IjoibW9sbGllIiwiYSI6IjdoX1Z4d0EifQ.hXHw5tonOOCDlvh3oKQNXA")
        
        let bbox = Data.getBBoxForCounty(selectedCounty)
        
        let mapSpan = MKCoordinateSpanMake((bbox[3] - bbox[1]) * 2, (bbox[2] - bbox[0]) * 2)
        let centerPoint = CLLocationCoordinate2DMake(bbox[1] + ((bbox[3] - bbox[1]) / 2), bbox[0] + ((bbox[2] - bbox[0]) / 2))
        var newRegion = MKCoordinateRegion(center: centerPoint, span: mapSpan)
        mapView.setRegion(newRegion, animated: false)
        
        let rasterOverlay = MBXRasterTileOverlay(mapID: "mollie.mimp4fgk")
        rasterOverlay.delegate = self
        mapView.addOverlay(rasterOverlay)
        
        for location in countyLocations {
            
            let annotation = PollingPlace(data: location as! [String : AnyObject])
            
            mapView.addAnnotation(annotation)
            
        }
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: MKMapViewDelegate
    func mapView(mapView: MKMapView!, rendererForOverlay overlay: MKOverlay!) -> MKOverlayRenderer! {
        
        if overlay.isKindOfClass(MBXRasterTileOverlay) {
            let mbxOverlay = overlay as! MBXRasterTileOverlay
            let renderer = MBXRasterTileRenderer(tileOverlay: mbxOverlay)
            return renderer
        } else if overlay is MKPolyline {
            let lineView = MKPolylineRenderer(overlay: overlay)
            lineView.strokeColor = UIColor.greenColor()
            
            return lineView
        }
        return nil
    }
    
    func mapView(mapView: MKMapView!, viewForAnnotation annotation: MKAnnotation!) -> MKAnnotationView! {
        
        var rightArrowButton = ArrowButton(frame: CGRectMake(0, 0, 22, 22))
        rightArrowButton.strokeColor = UIColor(red:0.93, green:0.21, blue:0.41, alpha:1)
        rightArrowButton.strokeSize = 1.2
        
        var pinView = MKPinAnnotationView(annotation: annotation, reuseIdentifier: "pin")
        pinView.rightCalloutAccessoryView = rightArrowButton
        pinView.canShowCallout = true
        
        return pinView
    }
    
    func mapView(mapView: MKMapView!, annotationView view: MKAnnotationView!, calloutAccessoryControlTapped control: UIControl!) {
        
        let annotation = view.annotation as! PollingPlace
        
        performSegueWithIdentifier("pollingPlaceSegue", sender: view)
        
        
    }
    
    func tileOverlay(overlay: MBXRasterTileOverlay!, didLoadMarkers markers: [AnyObject]!, withError error: NSError!) {
        
        if error == nil {
            mapView.addAnnotations(markers)
        } else {
            println("Failed to load markers for map ID " + overlay.mapID + " .")
        }
        
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        
        let destination = segue.destinationViewController as! PollingPlaceVC
        let annotation = sender?.annotation as! PollingPlace
        destination.pollingPlace = annotation.data
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }

}
