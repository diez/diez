//
//  DirectionImage.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/11/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

extension UIImage {
    static func iconName(for direction: CardinalDirection) -> String {
        switch direction {
        case .north:        return "Direction - North"
        case .northEast:    return "Direction - North East"
        case .east:         return "Direction - East"
        case .southEast:    return "Direction - South East"
        case .south:        return "Direction - South"
        case .southWest:    return "Direction - South West"
        case .west:         return "Direction - West"
        case .northWest:    return "Direction - North West"
        }
    }
}
