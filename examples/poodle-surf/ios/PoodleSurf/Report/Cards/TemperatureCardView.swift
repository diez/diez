//
//  TemperatureCardView.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

class TemperatureCardView: UIView {
    let titleLabel = UILabel()
    let temperatureView = HorizontalImageLabelView()
    let wetsuitView = HorizontalImageVerticalLabelsView()

    override init(frame: CGRect) {
        innerStackView = UIStackView(arrangedSubviews: [
            temperatureView,
            wetsuitView,
        ])

        outterStackView = UIStackView(arrangedSubviews: [
            titleLabel,
            innerStackView,
        ])

        super.init(frame: frame)

        setupLayout()
        configureViews()
    }

    var titleContentSpacing: CGFloat {
        get { return outterStackView.spacing }
        set { outterStackView.spacing = newValue }
    }

    var horizontalSpacing: CGFloat {
        get { return innerStackView.spacing }
        set { innerStackView.spacing = newValue }
    }

    override var layoutMargins: UIEdgeInsets {
        get { return outterStackView.layoutMargins }
        set { outterStackView.layoutMargins = newValue }
    }

    override class var requiresConstraintBasedLayout: Bool { return true }

    private let outterStackView: UIStackView
    private let innerStackView: UIStackView

    private func setupLayout() {
        embed(outterStackView)
    }

    private func configureViews() {
        outterStackView.axis = .vertical
        outterStackView.isLayoutMarginsRelativeArrangement = true

        innerStackView.axis = .horizontal
        innerStackView.distribution = .fillEqually
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
