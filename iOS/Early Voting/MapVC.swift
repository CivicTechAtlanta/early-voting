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
        
        mapView.delegate = self
        
    MBXMapKit.setAccessToken("pk.eyJ1IjoibW9sbGllIiwiYSI6IjdoX1Z4d0EifQ.hXHw5tonOOCDlvh3oKQNXA")

        let bbox = [-84.850713, 33.502412, -84.097692, 34.186289]
        
        let mapSpan = MKCoordinateSpanMake((bbox[3] - bbox[1]) / 2, (bbox[2] - bbox[0]) / 2)
        let centerPoint = CLLocationCoordinate2DMake(bbox[1] + ((bbox[3] - bbox[1]) / 2), bbox[0] + ((bbox[2] - bbox[0]) / 2))
        var newRegion = MKCoordinateRegion(center: centerPoint, span: mapSpan)
        mapView.setRegion(newRegion, animated: false)
        
        
//        geometry = [MKPolygon polygonWithCoordinates:coordsExt count:numberOfCoords];
        
        // mapbox stuff
//        mapView.showsBuildings = false
//        mapView.rotateEnabled = false
//        mapView.pitchEnabled = false
        let rasterOverlay = MBXRasterTileOverlay(mapID: "mollie.mimp4fgk")
        rasterOverlay.delegate = self
        mapView.addOverlay(rasterOverlay)
        
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
        }
        return nil
    }
    
//    func mapView(mapView: MKMapView!, viewForAnnotation annotation: MKAnnotation!) -> MKAnnotationView! {
//        
//        if annotation.isKindOfClass(MBXPointAnnotation) {
//            let view = mapView.dequeueReusableAnnotationViewWithIdentifier("MBXSimpleStyleReuseIdentifier")
//            if (view == nil) {
//                let view = MKAnnotationView(annotation: annotation, reuseIdentifier: "MBXSimpleStyleReuseIdentifier")
//            }
//            let mbxAnnotation = annotation as! MBXPointAnnotation
//            if let annotationImage = mbxAnnotation.image {
//                view.image = annotationImage
//            }
////            view.image = mbxAnnotation.image
//            view.canShowCallout = true
//            return view
//        }
//        return nil
//    }
    
    func mapView(mapView: MKMapView!, viewForOverlay overlay: MKOverlay!) -> MKOverlayView! {
//        if ([overlay isKindOfClass:[MKPolygon class]])
//        {
//            MKPolygonView* aView = [[MKPolygonView alloc]initWithPolygon:(MKPolygon*)overlay];
//            aView.fillColor = [[UIColor cyanColor] colorWithAlphaComponent:0.2];
//            aView.strokeColor = [[UIColor blueColor] colorWithAlphaComponent:0.7];
//            aView.lineWidth = 3;
//            return aView;
//        }
//        return nil;
        println(overlay)
        
        // check class
        var view = MKPolygonView(overlay: overlay)
//        view.fillColor = UIColor.cyanColor().colorWithAlphaComponent(0.2)
//        view.strokeColor = UIColor.blueColor().colorWithAlphaComponent(0.7)
//        view.lineWidth = 3
        return view
        
    }
    
    func tileOverlay(overlay: MBXRasterTileOverlay!, didLoadMarkers markers: [AnyObject]!, withError error: NSError!) {
        
        if error == nil {
            mapView.addAnnotations(markers)
        } else {
            println("Failed to load markers for map ID " + overlay.mapID + " .")
        }
        
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
