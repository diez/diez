//
//  StrokedCircularImageView.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

class StrokedCirularImageView: UIView {
    override init(frame: CGRect) {
        super.init(frame: frame)

        setupLayout()
        configureViews()
    }

    var image: UIImage? {
        get { return imageView.image }
        set { imageView.image = newValue }
    }

    override func layoutSubviews() {
        super.layoutSubviews()

        imageView.layer.cornerRadius = frame.size.width / 2
    }

    private func setupLayout() {
        var constraints = embed(imageView, shouldActivateConstraints: false)

        let aspectConstraint = imageView.widthAnchor.constraint(equalTo: imageView.heightAnchor)
        constraints.append(aspectConstraint)

        NSLayoutConstraint.activate(constraints)
    }

    private func configureViews() {
        imageView.contentMode = .scaleAspectFit
        imageView.clipsToBounds = true
    }

    override class var requiresConstraintBasedLayout: Bool {
        return true
    }

    private let imageView = UIImageView()

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
