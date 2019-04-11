//
//  Gradient.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/11/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

struct Gradient {
    struct ColorPosition {
        let color: UIColor
        /// A value from 0-1 that represents the gradient color's position.
        let location: Double
    }

    /// A point in a coordinate space that starts at the top left (0,0) and ends at the bottom right (1, 1).
    typealias GradientPoint = CGPoint

    let colors: [ColorPosition]
    let startPoint: GradientPoint
    let endPoint: GradientPoint

    init(colors: [ColorPosition], startPoint: GradientPoint, endPoint: GradientPoint) {
        self.colors = colors
        self.startPoint = startPoint
        self.endPoint = endPoint
    }

    init(startColor: UIColor, endColor: UIColor, startPoint: GradientPoint, endPoint: GradientPoint) {
        let colors = [
            ColorPosition(color: startColor, location: 0),
            ColorPosition(color: endColor, location: 1),
        ]

        self.init(colors: colors, startPoint: startPoint, endPoint: endPoint)
    }
}
