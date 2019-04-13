//
//  LoadingViewController+Diez.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/13/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import Diez

extension LoadingViewController {
    func apply(_ design: LoadingDesign, to view: LoadingView) {
        view.backgroundColor = design.backgroundColor.color

        guard let animationView = design.animation.view() else {
            print("Failed to load lottie animation view.")
            return
        }

        view.setAnimationView(to: animationView)
    }
}
