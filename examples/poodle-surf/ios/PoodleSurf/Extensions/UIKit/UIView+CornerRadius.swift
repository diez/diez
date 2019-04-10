//
//  UIView+CornerRadius.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

extension UIView {
    /// - Note: Setting this value has the side effect of setting the backing layer's clipsToBounds to true if the value
    ///         is greater than 0.
    var cornerRadius: CGFloat {
        get {
            return layer.cornerRadius
        }
        set {
            if newValue > 0 {
                clipsToBounds = true
            }

            layer.cornerRadius = newValue
        }
    }

    var borderWidth: CGFloat {
        get {
            return layer.borderWidth
        }
        set {
            layer.borderWidth = newValue
        }
    }

    var borderColor: UIColor? {
        get {
            guard let color = layer.borderColor else {
                return nil
            }

            return UIColor(cgColor: color)
        }
        set {
            layer.borderColor = newValue?.cgColor
        }
    }
}
