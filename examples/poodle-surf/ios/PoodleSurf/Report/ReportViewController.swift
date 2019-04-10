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

        applyHeaderStyle(to: view.headerView)
        applyTemperatureStyle(to: view.temperatureCardView)
    }

    private func applyHeaderStyle(to view: ReportHeaderView) {
        view.regionLabel.font = UIFont.systemFont(ofSize: 20, weight: .bold)
        view.placeLabel.font = UIFont.systemFont(ofSize: 12)
        view.locationImageView.borderColor = UIColor(red: 0.98, green: 0.35, blue: 0.4, alpha: 1)
        view.locationImageView.borderWidth = 3
        view.locationImageWidthAndHeight = 110
        view.labelsStackViewLayoutMargins = UIEdgeInsets(top: 15, left: 20, bottom: 15, right: 20)
        view.regionLabelToPinIconSpacing = 10
        view.labelsVerticalSpacing = 5
    }

    private func applyTemperatureStyle(to view: TemperatureCardView) {
        view.backgroundColor = UIColor(red: 0.98, green: 0.35, blue: 0.4, alpha: 1)
        view.horizontalSpacing = 40
        view.verticalSpacing = 20
        view.titleLabel.font = .systemFont(ofSize: 20)
        view.titleLabel.textColor = .white
        view.titleLabel.text = "Water temperature"
        view.wetsuitView.topLabel.font = .systemFont(ofSize: 12, weight: .bold)
        view.wetsuitView.topLabel.textColor = .white
        view.wetsuitView.topLabel.text = "Recommended"
        view.wetsuitView.bottomLabel.font = .systemFont(ofSize: 12)
        view.wetsuitView.bottomLabel.textColor = UIColor(white: 1, alpha: 0.6)
        view.temperatureView.label.font = .systemFont(ofSize: 30)
        view.temperatureView.label.textColor = .white
        view.layoutMargins = UIEdgeInsets(top: 20, left: 20, bottom: 20, right: 20)
        view.cornerRadius = 5
    }

    private func applyTitleStyle(to view: HorizontalImageLabelView) {
        titleView.label.text = "P o o d l e S u r f"
    }

    private var reportView: ReportView {
        return view as! ReportView
    }

    private func configure(with state: ReportState) {
        configure(with: state.location)
        configure(with: state.temperature)
    }

    private func configure(with state: ReportState.Location) {
        let header = reportView.headerView
        header.placeLabel.text = state.place
        header.regionLabel.text = state.region
        header.bannerImageView.image = state.bannerImage
        header.locationImageView.image = state.mapImage
    }

    private func configure(with state: ReportState.Temperature) {
        let temperature = reportView.temperatureCardView
        temperature.temperatureView.label.text = state.formattedValue
        temperature.wetsuitView.bottomLabel.text = state.recommendedGear
    }

    private let titleView = HorizontalImageLabelView()

    @available(*, unavailable)
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) { fatalError("\(#function) not implemented.") }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}

