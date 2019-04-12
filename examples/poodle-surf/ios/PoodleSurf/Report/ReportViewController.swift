//
//  ReportViewController.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

class ReportViewController: UIViewController {
    init() {
        super.init(nibName: nil, bundle: nil)
    }

    override func loadView() {
        view = ReportView(frame: UIScreen.main.bounds)
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        navigationItem.titleView = titleView

        let exampleState = ReportState.makeExample()
        configure(with: exampleState)

        applyReportStyle(to: reportView)
        applyTitleStyle(to: titleView)
    }

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

    private var reportView: ReportView {
        return view as! ReportView
    }

    private func configure(with state: ReportState) {
        configure(with: state.location)
        configure(with: state.temperature)
        configure(with: state.wind)
        configure(reportView.swellCardView, with: state.swell)
        configure(reportView.tideCardView, with: state.tide)
    }

    private func configure(with state: ReportState.Location) {
        let header = reportView.headerView
        header.placeLabel.text = state.place
        header.regionLabel.text = state.region
        header.bannerImageView.image = UIImage(named: state.bannerImageName)
        header.locationImageView.image = UIImage(named: state.mapImageName)
    }

    private func configure(with state: ReportState.Temperature) {
        let card = reportView.temperatureCardView
        card.temperatureView.label.text = state.formattedValue
        card.wetsuitView.bottomLabel.text = state.recommendedGear
    }

    private func configure(with state: ReportState.WindForecast) {
        let card = reportView.windCardView
        configure(card.earlyPart, withState: state.early, iconImageName: UIImage.iconName(for: state.early.direction))
        configure(card.middlePart, withState: state.middle, iconImageName: UIImage.iconName(for: state.middle.direction))
        configure(card.latePart, withState: state.late, iconImageName: UIImage.iconName(for: state.late.direction))
    }

    private func configure<T: ForecastDescribable>(_ card: ForecastCardView, with state: T) {
        configure(card.earlyPart, withState: state.early)
        configure(card.middlePart, withState: state.middle)
        configure(card.latePart, withState: state.late)
    }

    private func configure(_ view: DayPartView, withState state: DayPartDescribable, iconImageName iconName: String? = nil){
        view.timeLabel.text = state.time
        view.valueLabel.text = state.value

        guard
            let iconName = iconName,
            let icon = UIImage(named: iconName) else {
                view.iconView.isHidden = true
                return
        }

        view.iconView.isHidden = false
        view.iconView.image = icon

    }

    private func configure(_ view: DayPartView, withIconNamed iconName: String?) {

    }

    private let titleView = HorizontalImageLabelView()

    @available(*, unavailable)
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) { fatalError("\(#function) not implemented.") }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
