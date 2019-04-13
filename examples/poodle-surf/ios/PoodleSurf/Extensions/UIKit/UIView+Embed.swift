//
//  UIView+Embed.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

extension UIView {
    /// Adds the provided view as a subview and constrains all edges to the receiver using autolayout.
    @discardableResult
    func embed(_ view: UIView, shouldActivateConstraints: Bool = true) -> [NSLayoutConstraint] {
        view.translatesAutoresizingMaskIntoConstraints = false
        addSubview(view)

        let constraints = [
            view.topAnchor.constraint(equalTo: topAnchor),
            view.leadingAnchor.constraint(equalTo: leadingAnchor),
            view.trailingAnchor.constraint(equalTo: trailingAnchor),
            view.bottomAnchor.constraint(equalTo: bottomAnchor),
        ]

        if shouldActivateConstraints {
            NSLayoutConstraint.activate(constraints)
        }

        return constraints
    }

    /// Adds the provided view as a subview and constrains all edges to the receiver's layoutMarginsGuide using
    /// autolayout.
    @discardableResult
    func embedToMargins(_ view: UIView, shouldActivateConstraints: Bool = true) -> [NSLayoutConstraint] {
        view.translatesAutoresizingMaskIntoConstraints = false
        addSubview(view)

        let margins = view.layoutMarginsGuide

        let constraints = [
            view.topAnchor.constraint(equalTo: margins.topAnchor),
            view.leadingAnchor.constraint(equalTo: margins.leadingAnchor),
            view.trailingAnchor.constraint(equalTo: margins.trailingAnchor),
            view.bottomAnchor.constraint(equalTo: margins.bottomAnchor),
        ]

        if shouldActivateConstraints {
            NSLayoutConstraint.activate(constraints)
        }

        return constraints
    }
}
