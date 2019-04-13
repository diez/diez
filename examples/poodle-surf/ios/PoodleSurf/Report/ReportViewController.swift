//
//  ReportViewController.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import Diez

class ReportViewController: UIViewController {
    private let diezDesignSystem = Diez<PoodleSurfDesignSystem>()
    private let diezModelMock = Diez<PoodleSurfReportModelMock>()

    override func viewDidLoad() {
        super.viewDidLoad()

        navigationItem.titleView = titleView

        let state = ReportState.makeExample()
        let binder = ReportViewStateBinder(view: reportView)
        binder.update(with: state)

        applyReportStyle(to: reportView)
        applyTitleStyle(to: titleView)

        diezDesignSystem.attach(self) { [weak self] system in
            self?.apply(system)
        }

        diezModelMock.attach(self) { mock in
            guard let state = ReportState(mock: mock) else {
                print("Failed to create state from Diez mock.")
                return
            }

            binder.update(with: state)
        }
    }

    // MARK: - Diez Styling

    private func apply(_ system: PoodleSurfDesignSystem) {
        UIView.animate(withDuration: 0.5) {
            self.apply(system.report, to: self.reportView)
            self.view.layoutIfNeeded()
        }
    }

    private func apply(_ design: ReportDesign, to view: ReportView) {
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
        design.regionLabel.setTextStyle(forLabel: view.regionLabel)
        design.placeLabel.setTextStyle(forLabel: view.placeLabel)
        view.pinIconImageView.image = try? design.mapPinIcon.image()
        view.locationImageView.strokeWidth = design.locationImage.strokeWidth
        view.locationImageView.strokeGradient = Gradient(design.locationImage.strokeGradient)
        view.locationImageWidthAndHeight = design.locationImage.widthAndHeight
        view.bannerHeight = design.bannerHeight
        view.labelsStackViewLayoutMargins = UIEdgeInsets(design.labelsLayoutMargin)
        view.regionLabelToPinIconSpacing = design.pinIconToLabelSpacing
        view.labelsVerticalSpacing = design.labelsSpacing
    }

    private func apply(_ design: WaterTemperatureCardDesign, to view: TemperatureCardView) {
        view.horizontalSpacing = design.horizontalSpacing
        view.titleLabel.text = design.title
        design.titleTextStyle.setTextStyle(forLabel: view.titleLabel)
        view.gradient = Gradient(design.gradient)
        apply(design.temperature, to: view.temperatureView)
        apply(design.wetsuit, to: view.wetsuitView)
    }

    private func apply(_ design: TemperatureDesign, to view: HorizontalImageLabelView) {
        design.textStyle.setTextStyle(forLabel: view.label)
        view.imageView.image = try? design.icon.image()
        view.spacing = design.iconSpacing
    }

    private func apply(_ design: WetsuitDesign, to view: HorizontalImageVerticalLabelsView) {
        view.topLabel.text = design.headerText
        design.headerTextStyle.setTextStyle(forLabel: view.topLabel)
        design.valueTextStyle.setTextStyle(forLabel: view.bottomLabel)
        view.verticalSpacing = design.labelSpacing
        view.horizontalSpacing = design.iconSpacing
    }

    private func apply(_ design: ForecastCardDesign, to view: ForecastCardView) {
        view.titleLabel.text = design.title
        design.titleTextStyle.setTextStyle(forLabel: view.titleLabel)
        view.gradient = Gradient(design.gradient)
        view.dayPartsHorizontalSpacing = design.dayPartSpacing
        view.separatorWidth = design.separatorWidth
        view.separators.forEach { $0.backgroundColor = design.separatorColor.color }
        view.dayParts.forEach { dayPart in
            dayPart.unitLabel.text = design.unit
            dayPart.valueUnitLayoutMargins = UIEdgeInsets(design.valueUnitMargins)
            apply(design.dayPart, to: dayPart)
        }
    }

    private func apply(_ design: SharedDayPartDesign, to view: DayPartView) {
        design.valueTextStyle.setTextStyle(forLabel: view.valueLabel)
        design.unitTextStyle.setTextStyle(forLabel: view.unitLabel)
        design.timeTextStyle.setTextStyle(forLabel: view.timeLabel)
        view.valueUnitSpacing = design.valueUnitSpacing
        view.layoutMargins = UIEdgeInsets(design.layoutMargins)
    }

    // MARK: - Default Styling

    private func applyReportStyle(to view: ReportView) {
        view.backgroundColor = .white
        view.contentLayoutMargins = UIEdgeInsets(top: 20, left: 20, bottom: 20, right: 20)
        view.contentSpacing = 20

        applyHeaderStyle(to: view.headerView)
        applyTemperatureStyle(to: view.temperatureCardView)
        applyWindStyle(to: view.windCardView)
        applySwellStyle(to: view.swellCardView)
        applyTideStyle(to: view.tideCardView)
    }

    private func applyHeaderStyle(to view: ReportHeaderView) {
        view.regionLabel.font = UIFont.systemFont(ofSize: 20, weight: .bold)
        view.placeLabel.font = UIFont.systemFont(ofSize: 12)
        view.pinIconImageView.image = UIImage(named: "Map Pin")
        view.locationImageView.strokeGradient = Gradient.makeExample()
        view.locationImageView.strokeWidth = 3
        view.locationImageWidthAndHeight = 106
        view.bannerHeight = 149
        view.labelsStackViewLayoutMargins = UIEdgeInsets(top: 15, left: 20, bottom: 15, right: 20)
        view.regionLabelToPinIconSpacing = 10
        view.labelsVerticalSpacing = 5
    }

    private func applyTemperatureStyle(to view: TemperatureCardView) {
        applyCardStyle(to: view)
        view.horizontalSpacing = 20
        view.titleLabel.text = "Water temperature"
        view.temperatureView.label.font = .systemFont(ofSize: 30)
        view.temperatureView.label.textColor = .white
        view.temperatureView.imageView.image = UIImage(named: "Thermometer")
        view.temperatureView.spacing = 10
        view.wetsuitView.topLabel.font = .systemFont(ofSize: 12, weight: .bold)
        view.wetsuitView.topLabel.textColor = .white
        view.wetsuitView.topLabel.text = "Recommended"
        view.wetsuitView.imageView.image = UIImage(named: "Gear")
        view.wetsuitView.bottomLabel.font = .systemFont(ofSize: 12)
        view.wetsuitView.bottomLabel.textColor = UIColor(white: 1, alpha: 0.6)
        view.wetsuitView.horizontalSpacing = 10
        view.wetsuitView.verticalSpacing = 5
    }

    private func applyWindStyle(to view: ForecastCardView) {
        applyForecastStyle(to: view)
        view.titleLabel.text = "Wind"
        view.dayParts.forEach { part in
            part.unitLabel.text = "mph"
            part.verticalSpacing = 10
            part.valueUnitLayoutMargins = UIEdgeInsets(top: 20, left: 0, bottom: 0, right: 0)
        }
    }

    private func applySwellStyle(to view: ForecastCardView) {
        applyForecastStyle(to: view)
        view.titleLabel.text = "Swell"
        view.dayParts.forEach { $0.unitLabel.text = "ft" }
        view.dayParts.forEach { $0.verticalSpacing = 30 }
    }

    private func applyTideStyle(to view: ForecastCardView) {
        applyForecastStyle(to: view)
        view.titleLabel.text = "Tide"
        view.dayParts.forEach { $0.unitLabel.text = "ft" }
        view.dayParts.forEach { $0.verticalSpacing = 30 }
    }

    private func applyForecastStyle(to view: ForecastCardView) {
        applyCardStyle(to: view)
        view.dayPartsHorizontalSpacing = 20
        view.dayParts.forEach(applyDayPartStyle)
        view.separators.forEach { $0.backgroundColor = .white }
        view.separatorWidth = 1
    }

    private func applyDayPartStyle(to view: DayPartView) {
        view.valueLabel.font = .systemFont(ofSize: 30)
        view.valueLabel.textColor = .white
        view.unitLabel.font = .systemFont(ofSize: 16)
        view.unitLabel.textColor = .white
        view.timeLabel.font = .systemFont(ofSize: 12)
        view.timeLabel.textColor = .white
        view.valueUnitSpacing = 5
        view.layoutMargins = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
    }

    private func applyCardStyle(to view: CardViewDescribable) {
        view.titleLabel.font = .systemFont(ofSize: 20)
        view.titleLabel.textColor = .white
        view.layoutMargins = UIEdgeInsets(top: 20, left: 20, bottom: 30, right: 20)
        view.cornerRadius = 5
        view.titleContentSpacing = 20
        view.gradient = Gradient.makeExample()
    }

    private func applyTitleStyle(to view: HorizontalImageLabelView) {
        titleView.label.text = "PITTED"
        titleView.label.font = UIFont.systemFont(ofSize: 20, weight: .bold)
        titleView.imageView.image = UIImage(named: "Icon")
        titleView.spacing = 10
    }

    init() {
        super.init(nibName: nil, bundle: nil)
    }

    override func loadView() {
        view = ReportView(frame: UIScreen.main.bounds)
    }

    private var reportView: ReportView {
        return view as! ReportView
    }

    private let titleView = HorizontalImageLabelView()

    @available(*, unavailable)
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) { fatalError("\(#function) not implemented.") }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
