//
//  Gradient.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/11/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import CoreGraphics

class GradientView: UIView {
    var gradient: Gradient? {
        didSet {
            guard let gradient = gradient else {
                gradientLayer.removeFromSuperlayer()
                return
            }

            gradientLayer.colors = gradient.colors.map { $0.color.cgColor }
            gradientLayer.locations = gradient.colors.map { NSNumber(floatLiteral: $0.location) }
            gradientLayer.startPoint = gradient.startPoint
            gradientLayer.endPoint = gradient.endPoint

            if gradientLayer.superlayer == nil {
                layer.addSublayer(gradientLayer)
            }
        }
    }

    override init(frame: CGRect) {
        super.init(frame: frame)

        gradientLayer.frame = layer.bounds
    }

    override func layoutSubviews() {
        super.layoutSubviews()

        gradientLayer.frame = layer.bounds
    }

    private let gradientLayer = CAGradientLayer()

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
