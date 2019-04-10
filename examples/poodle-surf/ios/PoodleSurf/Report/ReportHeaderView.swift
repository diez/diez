//
//  ReportHeaderView.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

class ReportHeaderView: UIView {
    let bannerImageView = UIImageView()
    let locationImageView = StrokedCirularImageView()
    let pinIconImageView = UIImageView()
    let regionLabel = UILabel()
    let placeLabel = UILabel()

    override init(frame: CGRect) {
        placeImageLabelStackView = UIStackView(arrangedSubviews: [
            pinIconImageView,
            placeLabel,
        ])

        locationLabelsOutterStackView = UIStackView(arrangedSubviews: [
            regionLabel,
            placeImageLabelStackView,
        ])

        super.init(frame: frame)

        setupLayout()
        configureViews()
    }

    var bannerHeight: CGFloat {
        get { return bannerHeightConstraint.constant }
        set { bannerHeightConstraint.constant = newValue }
    }

    var labelsStackViewLayoutMargins: UIEdgeInsets {
        get { return locationLabelsOutterStackView.layoutMargins }
        set { locationLabelsOutterStackView.layoutMargins = newValue }
    }

    var regionLabelToPinIconSpacing: CGFloat {
        get { return placeImageLabelStackView.spacing }
        set { placeImageLabelStackView.spacing = newValue }
    }

    var locationImageWidthAndHeight: CGFloat {
        get { return locationImageWidthConstraint.constant }
        set {
            locationImageWidthConstraint.constant = newValue
            updateLocationImageCornerRadius(forImageWidthAndHeight: newValue)
        }
    }

    override class var requiresConstraintBasedLayout: Bool {
        return true
    }

    private let placeImageLabelStackView: UIStackView
    private let locationLabelsOutterStackView: UIStackView
    private var bannerHeightConstraint: NSLayoutConstraint!
    private var locationImageWidthConstraint: NSLayoutConstraint!

    private func setupLayout() {
        var constraints: [NSLayoutConstraint] = []

        bannerImageView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(bannerImageView)
        constraints += [
            bannerImageView.topAnchor.constraint(equalTo: safeAreaLayoutGuide.topAnchor),
            bannerImageView.leftAnchor.constraint(equalTo: leftAnchor),
            bannerImageView.rightAnchor.constraint(equalTo: rightAnchor),
        ]
        bannerHeightConstraint = bannerImageView.heightAnchor.constraint(equalToConstant: 200)
        constraints.append(bannerHeightConstraint)

        locationImageView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(locationImageView)
        constraints += [
            locationImageView.centerXAnchor.constraint(equalTo: centerXAnchor),
            locationImageView.centerYAnchor.constraint(equalTo: bannerImageView.bottomAnchor),
        ]

        locationImageWidthConstraint = locationImageView.widthAnchor.constraint(equalToConstant: 60)
        constraints.append(locationImageWidthConstraint)

        let stackView = locationLabelsOutterStackView
        stackView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(stackView)
        constraints += [
            stackView.topAnchor.constraint(equalTo: locationImageView.bottomAnchor),
            stackView.centerXAnchor.constraint(equalTo: centerXAnchor),
            stackView.leftAnchor.constraint(greaterThanOrEqualTo: safeAreaLayoutGuide.leftAnchor),
            stackView.rightAnchor.constraint(lessThanOrEqualTo: safeAreaLayoutGuide.rightAnchor),
            stackView.bottomAnchor.constraint(equalTo: safeAreaLayoutGuide.bottomAnchor),
        ]

        NSLayoutConstraint.activate(constraints)
    }

    private func configureViews() {
        regionLabel.textAlignment = .center

        placeImageLabelStackView.axis = .horizontal

        locationLabelsOutterStackView.axis = .vertical
        locationLabelsOutterStackView.isLayoutMarginsRelativeArrangement = true

        locationImageView.clipsToBounds = true

        updateLocationImageCornerRadius(forImageWidthAndHeight: locationImageWidthAndHeight)
    }

    private func updateLocationImageCornerRadius(forImageWidthAndHeight value: CGFloat) {
        locationImageView.layer.cornerRadius = value / 2
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
