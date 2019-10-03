//
//  ForecastCardView.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/11/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import DiezPoodleSurf

class ForecastCardView: PanelView {
    let titleLabel = Label()
    let earlyPart = DayPartView()
    let middlePart = DayPartView()
    let latePart = DayPartView()
    let dayParts: [DayPartView]
    private(set) var separators: [UIView] = []

    override init(frame: CGRect) {
        dayParts = [
            earlyPart,
            middlePart,
            latePart,
        ]

        partsStackView = UIStackView(arrangedSubviews: dayParts)

        outterStackView = UIStackView(arrangedSubviews: [
            titleLabel,
            partsStackView,
        ])

        super.init(frame: frame)

        setupLayout()
        configureViews()
    }

    var titleContentSpacing: CGFloat {
        get { return outterStackView.spacing }
        set { outterStackView.spacing = newValue }
    }

    var dayPartsHorizontalSpacing: CGFloat {
        get { return partsStackView.spacing }
        set { partsStackView.spacing = newValue }
    }

    var separatorWidth: CGFloat {
        get { return separatorWidthConstraints.first?.constant ?? 0 }
        set { separatorWidthConstraints.forEach { $0.constant = newValue } }
    }

    override class var requiresConstraintBasedLayout: Bool { return true }

    private let outterStackView: UIStackView
    private let partsStackView: UIStackView
    private var separatorWidthConstraints: [NSLayoutConstraint] = []

    private func setupLayout() {
        var constraints = contentView.embedToMargins(outterStackView, shouldActivateConstraints: false)

        constraints += addSeparators()

        NSLayoutConstraint.activate(constraints)
    }

    private func addSeparators() -> [NSLayoutConstraint] {
        var constraints: [NSLayoutConstraint] = []

        var previousPart: DayPartView? = nil
        for part in dayParts {
            defer {
                previousPart = part
            }

            guard let previousPart = previousPart else { continue }

            let separator = UIView()
            separators.append(separator)
            constraints += add(separator: separator, between: previousPart, and: part, in: partsStackView)

            let widthConstraint = separator.widthAnchor.constraint(equalToConstant: 1)
            constraints.append(widthConstraint)
            separatorWidthConstraints.append(widthConstraint)
        }

        return constraints
    }

    private func add(separator: UIView, between leftView: UIView, and rightView: UIView, in containerView: UIView) -> [NSLayoutConstraint] {
        let layoutGuide = UILayoutGuide()
        var constraints = addSeparator(layoutGuide: layoutGuide, between: leftView, and: rightView, in: containerView)

        separator.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(separator)

        constraints += [
            separator.topAnchor.constraint(equalTo: layoutGuide.topAnchor),
            separator.bottomAnchor.constraint(equalTo: layoutGuide.bottomAnchor),
            separator.centerXAnchor.constraint(equalTo: layoutGuide.centerXAnchor),
        ]

        return constraints
    }

    private func addSeparator(layoutGuide: UILayoutGuide, between leftView: UIView, and rightView: UIView, in containerView: UIView) -> [NSLayoutConstraint] {
        containerView.addLayoutGuide(layoutGuide)
        return [
            layoutGuide.leftAnchor.constraint(equalTo: leftView.rightAnchor),
            layoutGuide.rightAnchor.constraint(equalTo: rightView.leftAnchor),
            layoutGuide.topAnchor.constraint(equalTo: containerView.layoutMarginsGuide.topAnchor),
            layoutGuide.bottomAnchor.constraint(equalTo: containerView.layoutMarginsGuide.bottomAnchor),
        ]
    }

    private func configureViews() {
        outterStackView.axis = .vertical

        partsStackView.isLayoutMarginsRelativeArrangement = true
        partsStackView.axis = .horizontal
        partsStackView.distribution = .fillEqually
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
