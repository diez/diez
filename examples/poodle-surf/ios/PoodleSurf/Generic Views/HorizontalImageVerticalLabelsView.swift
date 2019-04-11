//
//  HorizontalImageVerticalLabelsView.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

class HorizontalImageVerticalLabelsView: UIView {
    let imageView = UIImageView()
    let topLabel = UILabel()
    let bottomLabel = UILabel()

    override init(frame: CGRect) {
        verticalStackView = UIStackView(arrangedSubviews: [
            topLabel,
            bottomLabel,
        ])

        horizontalStackView = UIStackView(arrangedSubviews: [
            imageView,
            verticalStackView,
        ])

        super.init(frame: frame)

        setupLayout()
        configureViews()
    }

    var horizontalSpacing: CGFloat {
        get { return horizontalStackView.spacing }
        set { horizontalStackView.spacing = newValue }
    }

    var verticalSpacing: CGFloat {
        get { return verticalStackView.spacing }
        set { verticalStackView.spacing = newValue }
    }

    override var layoutMargins: UIEdgeInsets {
        get { return horizontalStackView.layoutMargins }
        set { horizontalStackView.layoutMargins = newValue }
    }

    override class var requiresConstraintBasedLayout: Bool { return true }

    private let horizontalStackView: UIStackView
    private let verticalStackView: UIStackView

    private func setupLayout() {
        embed(horizontalStackView)
    }

    private func configureViews() {
        horizontalStackView.isLayoutMarginsRelativeArrangement = true
        horizontalStackView.axis = .horizontal
        verticalStackView.axis = .vertical
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
