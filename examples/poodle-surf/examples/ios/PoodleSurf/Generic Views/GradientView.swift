//
//  GradientView.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/11/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

class GradientView: UIView {
    var gradientLayer: CAGradientLayer { return layer as! CAGradientLayer }
    override class var layerClass: AnyClass { return CAGradientLayer.self }
}
