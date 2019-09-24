//
//  ReportViewController+Diez.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/13/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import DiezPoodleSurf

// MARK: - Report View

extension ReportViewController {
    func apply(_ design: ReportDesign, to view: ReportView) {
        view.backgroundColor = design.backgroundColor.uiColor
        view.contentLayoutMargins = UIEdgeInsets(design.contentLayoutMargins)
        view.contentSpacing = design.contentSpacing

        apply(design.header, to: view.headerView)
        apply(design.waterTemperature, to: view.temperatureCardView)
        apply(design.wind, to: view.windCardView)
        apply(design.swell, to: view.swellCardView)
        apply(design.tide, to: view.tideCardView)
    }

    private func apply(_ design: HeaderDesign, to view: ReportHeaderView) {
        view.regionLabel.apply(design.regionLabel)
        view.placeLabel.apply(design.placeLabel)
        view.pinIconImageView.image = design.mapPinIcon.uiImage
        view.locationImageView.strokeWidth = design.locationImage.strokeWidth
        view.locationImageView.strokeView.apply(design.locationImage.strokeGradient)
        view.locationImageWidthAndHeight = design.locationImage.widthAndHeight
        view.bannerHeight = design.bannerHeight
        view.labelsStackViewLayoutMargins = UIEdgeInsets(design.labelsLayoutMargin)
        view.regionLabelToPinIconSpacing = design.pinIconToLabelSpacing
        view.labelsVerticalSpacing = design.labelsSpacing
    }

    private func apply(_ design: WaterTemperatureCardDesign, to view: TemperatureCardView) {
        apply(design.shared, to: view)
        view.horizontalSpacing = design.horizontalSpacing
        apply(design.temperature, to: view.temperatureView)
        apply(design.wetsuit, to: view.wetsuitView)
    }

    private func apply(_ design: TemperatureDesign, to view: HorizontalImageLabelView) {
        view.label.apply(design.typograph)
        view.imageView.image = design.icon.uiImage
        view.spacing = design.iconSpacing
    }

    private func apply(_ design: WetsuitDesign, to view: HorizontalImageVerticalLabelsView) {
        view.topLabel.text = design.headerText
        view.topLabel.apply(design.headerTypograph)
        view.bottomLabel.apply(design.valueTypograph)
        view.verticalSpacing = design.labelSpacing
        view.horizontalSpacing = design.iconSpacing
        view.imageView.image = design.icon.uiImage
    }

    private func apply(_ design: ForecastCardDesign, to view: ForecastCardView) {
        apply(design.shared, to: view)
        view.dayPartsHorizontalSpacing = design.dayPartsHorizontalSpacing
        view.separatorWidth = design.separatorWidth
        view.separators.forEach { $0.backgroundColor = design.separatorColor.uiColor }
        view.dayParts.forEach { dayPart in
            dayPart.unitLabel.text = design.unit
            dayPart.valueUnitLayoutMargins = UIEdgeInsets(design.valueUnitMargins)
            dayPart.verticalSpacing = design.dayPartVerticalSpacing
            apply(design.dayPart, to: dayPart)
        }
    }

    private func apply(_ design: SharedCardDesign, to view: CardViewDescribable) {
        view.titleLabel.attributedText = design.titleTypograph.attributedString(decorating: design.title)
        view.titleLabel.adjustsFontForContentSizeCategory = design.titleTypograph.shouldScale
        view.titleContentSpacing = design.titleContentSpacing
        view.layoutMargins = UIEdgeInsets(design.layoutMargins)
        view.apply(design.panel)
    }

    private func apply(_ design: DayPartDesign, to view: DayPartView) {
        view.valueLabel.apply(design.valueTypograph)
        view.unitLabel.apply(design.unitTypograph)
        view.timeLabel.apply(design.timeTypograph)
        view.valueUnitSpacing = design.valueUnitSpacing
        view.layoutMargins = UIEdgeInsets(design.layoutMargins)
        view.iconSize = design.iconSize.cgSize
    }
}

// MARK: - Navigation Title View

extension ReportViewController {
    func apply(_ design: NavigationTitleDesign, toView view: HorizontalImageLabelView, navigationBar: UINavigationBar) {
        view.label.text = design.title
        view.spacing = design.iconToTitleSpacing

        // Using the UIKit class initializers for test coverage.
        navigationBar.barTintColor = UIColor(design.barTintColor)
        view.imageView.image = UIImage(design.icon)

        // Applying the typograph manually to add test coverage for the .uiFont getter.
        view.label.font = design.typograph.uiFont
        view.label.textColor = design.typograph.color.uiColor
    }
}
