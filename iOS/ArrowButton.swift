//
//  ArrowButton.swift
//  Sit Fit
//
//  Created by Mollie on 2/6/15.
//  Copyright (c) 2015 Proximity Viz LLC. All rights reserved.
//

import UIKit

@IBDesignable class ArrowButton: UIButton {
    
    @IBInspectable var strokeSize: CGFloat = 2
    @IBInspectable var strokeColor: UIColor = UIColor.darkGrayColor()
    @IBInspectable var isRounded: Bool = false
    @IBInspectable var isReversed: Bool = false
    
    @IBInspectable var topInset: CGFloat = 4
    @IBInspectable var bottomInset: CGFloat = 4
    @IBInspectable var leftInset: CGFloat = 8
    @IBInspectable var rightInset: CGFloat = 7

    override func drawRect(rect: CGRect) {
        
        // 22x22
        var context = UIGraphicsGetCurrentContext()
        
        strokeColor.set()
        
        CGContextSetLineWidth(context, strokeSize)
        
        if isRounded {
        
            CGContextSetLineJoin(context, kCGLineJoinRound)
            CGContextSetLineCap(context, kCGLineCapRound)
            
        } else {
            
            CGContextSetLineJoin(context, kCGLineJoinMiter)
            CGContextSetLineCap(context, kCGLineCapSquare)
            
        }
        
        if isReversed {
            
            CGContextMoveToPoint(context, rect.width - rightInset, 0 + topInset)
            CGContextAddLineToPoint(context, 0 + leftInset, (rect.height + topInset - bottomInset) / 2)
            CGContextAddLineToPoint(context, rect.width - rightInset, rect.height  - bottomInset)
            
            
        } else {
            
            CGContextMoveToPoint(context, 0 + leftInset, 0 + topInset)
            CGContextAddLineToPoint(context, rect.width - rightInset, (rect.height + topInset - bottomInset) / 2)
            CGContextAddLineToPoint(context, 0 + leftInset, rect.height - bottomInset)
            
        }
        
        CGContextStrokePath(context)
        
    }

}
