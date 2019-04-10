//
//  LoadingView.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import Lottie

class LoadingView: UIView {
    let animationView = LOTAnimationView()

    override init(frame: CGRect) {
        super.init(frame: frame)

        setupLayout()
        configureViews()
    }

    override class var requiresConstraintBasedLayout: Bool {
        return true
    }

    private func setupLayout() {
        animationView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(animationView)
        NSLayoutConstraint.activate([
            animationView.centerXAnchor.constraint(equalTo: centerXAnchor),
            animationView.centerYAnchor.constraint(equalTo: centerYAnchor),
        ])
    }

    private func configureViews() {
        animationView.loopAnimation = true
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
