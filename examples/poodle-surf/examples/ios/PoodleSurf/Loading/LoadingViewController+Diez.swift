//
//  LoadingViewController+Diez.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/13/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import DiezPoodleSurf
import Lottie

extension LoadingViewController {
    func apply(_ design: LoadingDesign, to view: LoadingView) {
        view.backgroundColor = design.backgroundColor.uiColor
        view.animationView.load(design.animation)
    }
}
