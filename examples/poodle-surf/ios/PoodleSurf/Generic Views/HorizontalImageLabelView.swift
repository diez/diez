//
//  HorizontalImageLabelView.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

class HorizontalImageLabelView: UIView {
    let imageView = UIImageView()
    let label = UILabel()

    override init(frame: CGRect) {
        stackView = UIStackView(arrangedSubviews: [
            imageView,
            label,
        ])

        super.init(frame: frame)

        setupLayout()
        configureViews()
    }

    var spacing: CGFloat {
        get { return stackView.spacing }
        set { stackView.spacing = newValue }
    }

    override var layoutMargins: UIEdgeInsets {
        get { return stackView.layoutMargins }
        set { stackView.layoutMargins = newValue }
    }

    override class var requiresConstraintBasedLayout: Bool {
        return true
    }

    private let stackView: UIStackView

    private func setupLayout() {
        embed(stackView)
    }

    private func configureViews() {
        stackView.axis = .horizontal
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
