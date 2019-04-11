//
//  NSLayoutConstraint+Named.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/11/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

extension NSLayoutConstraint {
    func named(_ name: String) -> NSLayoutConstraint {
        identifier = name
        return self
    }
}
