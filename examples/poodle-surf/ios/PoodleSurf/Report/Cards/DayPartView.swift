//
//  DayPartView.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/11/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

class DayPartView: UIView {
    let iconView = UIImageView()
    let valueLabel = UILabel()
    let unitLabel = UILabel()
    let timeLabel = UILabel()

    override init(frame: CGRect) {
        valueStackView = UIStackView(arrangedSubviews: [
            valueLabel,
            unitLabel,
        ])

        outterStackView = UIStackView(arrangedSubviews: [
            iconView,
            valueStackView,
            timeLabel,
        ])

        super.init(frame: frame)

        setupLayout()
        configureViews()
    }

    var verticalSpacing: CGFloat {
        get { return outterStackView.spacing }
        set { outterStackView.spacing = newValue }
    }

    override var layoutMargins: UIEdgeInsets {
        get { return outterStackView.layoutMargins }
        set { outterStackView.layoutMargins = newValue }
    }

    var valueUnitSpacing: CGFloat {
        get { return valueStackView.spacing }
        set { valueStackView.spacing = newValue }
    }

    var valueUnitLayoutMargins: UIEdgeInsets {
        get { return valueStackView.layoutMargins }
        set { valueStackView.layoutMargins = newValue }
    }

    override class var requiresConstraintBasedLayout: Bool { return true }

    private let outterStackView: UIStackView
    private let valueStackView: UIStackView

    private func setupLayout() {
        embed(outterStackView)
    }

    private func configureViews() {
        outterStackView.isLayoutMarginsRelativeArrangement = true
        outterStackView.axis = .vertical
        outterStackView.alignment = .center

        valueStackView.isLayoutMarginsRelativeArrangement = true
        valueStackView.axis = .horizontal
        valueStackView.alignment = .firstBaseline

        timeLabel.textAlignment = .center

        valueLabel.setContentCompressionResistancePriority(.defaultHigh, for: .horizontal)

        unitLabel.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
