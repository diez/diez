//
//  ReportView.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

class ReportView: UIView {
    let headerView = ReportHeaderView()
    let temperatureCardView = TemperatureCardView()

    override init(frame: CGRect) {
        contentStackView = UIStackView(arrangedSubviews: [
            temperatureCardView
        ])

        outterStackView = UIStackView(arrangedSubviews: [
            headerView,
            contentStackView,
        ])

        super.init(frame: frame)

        setupLayout()
        configureViews()
    }

    private func setupLayout() {
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(scrollView)
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: topAnchor),
            scrollView.leftAnchor.constraint(equalTo: leftAnchor),
            scrollView.rightAnchor.constraint(equalTo: rightAnchor),
            scrollView.bottomAnchor.constraint(equalTo: bottomAnchor),
        ])

        outterStackView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(outterStackView)
        NSLayoutConstraint.activate([
            outterStackView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            outterStackView.leftAnchor.constraint(equalTo: scrollView.leftAnchor),
            outterStackView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            outterStackView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
        ])
    }

    private func configureViews() {
        scrollView.contentInsetAdjustmentBehavior = .always

        contentStackView.axis = .vertical
        contentStackView.isLayoutMarginsRelativeArrangement = true

        outterStackView.axis = .vertical
    }

    var contentLayoutMargins: UIEdgeInsets {
        get { return contentStackView.layoutMargins }
        set { contentStackView.layoutMargins = newValue }
    }

    var contentSpacing: CGFloat {
        get { return contentStackView.spacing }
        set { contentStackView.spacing = newValue }
    }

    override class var requiresConstraintBasedLayout: Bool {
        return true
    }

    private let scrollView = UIScrollView()
    private let outterStackView: UIStackView
    private let contentStackView: UIStackView

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
