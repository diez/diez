//
//  ReportViewController+Diez.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/13/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import Diez

// MARK: - Report View

extension ReportViewController {
    func apply(_ design: ReportDesign, to view: ReportView) {
        view.backgroundColor = design.backgroundColor.color
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
        view.pinIconImageView.image = design.mapPinIcon.image
        view.locationImageView.strokeWidth = design.locationImage.strokeWidth
        view.locationImageView.strokeGradient = Gradient(design.locationImage.strokeGradient)
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
        view.label.apply(design.textStyle)
        view.imageView.image = design.icon.image
        view.spacing = design.iconSpacing
    }

    private func apply(_ design: WetsuitDesign, to view: HorizontalImageVerticalLabelsView) {
        view.topLabel.text = design.headerText
        view.topLabel.apply(design.headerTextStyle)
        view.bottomLabel.apply(design.valueTextStyle)
        view.verticalSpacing = design.labelSpacing
        view.horizontalSpacing = design.iconSpacing
        view.imageView.image = design.icon.image
    }

    private func apply(_ design: ForecastCardDesign, to view: ForecastCardView) {
        apply(design.shared, to: view)
        view.dayPartsHorizontalSpacing = design.dayPartsHorizontalSpacing
        view.separatorWidth = design.separatorWidth
        view.separators.forEach { $0.backgroundColor = design.separatorColor.color }
        view.dayParts.forEach { dayPart in
            dayPart.unitLabel.text = design.unit
            dayPart.valueUnitLayoutMargins = UIEdgeInsets(design.valueUnitMargins)
            dayPart.verticalSpacing = design.dayPartVerticalSpacing
            apply(design.dayPart, to: dayPart)
        }
    }

    private func apply(_ design: SharedCardDesign, to view: CardViewDescribable) {
        view.titleLabel.text = design.title
        view.titleLabel.apply(design.titleTextStyle)
        view.titleContentSpacing = design.titleContentSpacing
        view.gradient = Gradient(design.gradient)
        view.layoutMargins = UIEdgeInsets(design.layoutMargins)
        view.cornerRadius = design.cornerRadius
    }

    private func apply(_ design: DayPartDesign, to view: DayPartView) {
        view.valueLabel.apply(design.valueTextStyle)
        view.unitLabel.apply(design.unitTextStyle)
        view.timeLabel.apply(design.timeTextStyle)
        view.valueUnitSpacing = design.valueUnitSpacing
        view.layoutMargins = UIEdgeInsets(design.layoutMargins)
        view.iconWidth = design.iconWidth
        view.iconHeight = design.iconHeight
    }
}

// MARK: - Navigation Title View

extension ReportViewController {
    func apply(_ design: NavigationTitleDesign, toView view: HorizontalImageLabelView, navigationBar: UINavigationBar) {
        navigationBar.barTintColor = design.barTintColor.color
        view.label.text = design.title
        view.label.apply(design.textStyle)
        view.imageView.image = design.icon.image
        view.spacing = design.iconToTitleSpacing
    }
}
