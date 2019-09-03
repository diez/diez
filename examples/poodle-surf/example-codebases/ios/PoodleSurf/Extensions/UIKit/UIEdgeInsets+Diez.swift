//
//  UIEdgeInsets+Diez.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/12/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import DiezPoodleSurf

extension UIEdgeInsets {
    init(_ insets: EdgeInsets) {
        self.init(top: insets.top, left: insets.left, bottom: insets.bottom, right: insets.right)
    }
}
