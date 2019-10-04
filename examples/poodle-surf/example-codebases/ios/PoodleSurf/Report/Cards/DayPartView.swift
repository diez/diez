//
//  DayPartView.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/11/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import DiezPoodleSurf

class DayPartView: UIView {
    let iconView = UIImageView()
    let valueLabel = Label()
    let unitLabel = Label()
    let timeLabel = Label()

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

    var iconSize: CGSize? {
        get {
            guard
                let iconWidth = iconWidth,
                let iconHeight = iconHeight else {
                    return nil
            }

            return CGSize(width: iconWidth, height: iconHeight)
        }
        set {
            iconWidth = newValue?.width
            iconHeight = newValue?.height
        }
    }

    override class var requiresConstraintBasedLayout: Bool { return true }

    private let outterStackView: UIStackView
    private let valueStackView: UIStackView
    private var iconWidthConstraint: NSLayoutConstraint!
    private var iconHeightConstraint: NSLayoutConstraint!

    private func setupLayout() {
        embed(outterStackView)

        // Do not activate this constraint yet. Only activate if a value is set by a consumer.
        iconWidthConstraint = iconView.widthAnchor.constraint(equalToConstant: 0)
        iconWidthConstraint.priority = .defaultHigh
        iconHeightConstraint = iconView.heightAnchor.constraint(equalToConstant: 0)
        iconHeightConstraint.priority = .defaultHigh
    }

    private func configureViews() {
        outterStackView.isLayoutMarginsRelativeArrangement = true
        outterStackView.axis = .vertical
        outterStackView.alignment = .center

        valueStackView.isLayoutMarginsRelativeArrangement = true
        valueStackView.axis = .horizontal
        valueStackView.alignment = .firstBaseline

        valueLabel.setContentCompressionResistancePriority(.defaultHigh, for: .horizontal)

        unitLabel.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
    }

    /// If the newValue > 0, then the constraint will be made active and have its constant set to the new value.
    /// If the newValue <= 0, then the constraint will be made inactive and its constant will be set to 0.
    private func update(_ constraint: NSLayoutConstraint, with newValue: CGFloat?) {
        guard
            let newValue = newValue,
            newValue > 0 else {
                constraint.constant = 0
                constraint.isActive = false
                return
        }

        constraint.constant = newValue
        constraint.isActive = true
    }

    private var iconWidth: CGFloat? {
        get { return iconWidthConstraint.isActive ? iconWidthConstraint.constant : iconView.image?.size.width }
        set { update(iconWidthConstraint, with: newValue) }
    }

    private var iconHeight: CGFloat? {
        get { return iconHeightConstraint.isActive ? iconHeightConstraint.constant : iconView.image?.size.height }
        set { update(iconHeightConstraint, with: newValue) }
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
