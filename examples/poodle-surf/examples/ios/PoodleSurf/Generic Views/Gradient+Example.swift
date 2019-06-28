//
//  Gradient+Example.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/11/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

extension Gradient {
    static func makeExample() -> Gradient {
        return Gradient(
            startColor: UIColor(red: 255/255, green: 63/255, blue: 112/255, alpha: 1),
            endColor: UIColor(red: 255/255, green: 154/255, blue: 58/255, alpha: 1),
            startPoint: GradientPoint(x: 0, y: 0),
            endPoint: GradientPoint(x: 1, y: 1))
    }
}
