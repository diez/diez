//
//  LoadingViewController+FallbackStyle.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/13/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import Lottie

extension LoadingViewController {
    func applyFallbackStyle(to view: LoadingView) {
        view.backgroundColor = UIColor(red: 120/255, green: 207/255, blue: 253/255, alpha: 1)
        view.animationView.setAnimation(named: "hang10")
        view.animationView.loopAnimation = true
        view.animationView.play()
    }
}
