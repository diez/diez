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

        title = "PoodleSurf"
    }

    override func loadView() {
        view = ReportView(frame: UIScreen.main.bounds)
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        // XXX:
        reportView.backgroundColor = .white
        reportView.contentLayoutMargins = UIEdgeInsets(top: 20, left: 20, bottom: 20, right: 20)
        let header = reportView.headerView
        header.bannerImageView.backgroundColor = .green
        header.locationImageView.backgroundColor = .red
        header.placeLabel.text = "Natural Bridges State Park"
        header.regionLabel.text = "Santa Cruz, CA"
        header.locationImageView.borderColor = .purple
        header.locationImageView.borderWidth = 5
        let temperature = reportView.temperatureCardView
        temperature.backgroundColor = .red
        temperature.horizontalSpacing = 40
        temperature.verticalSpacing = 20
        temperature.titleLabel.text = "Water temperature"
        temperature.temperatureView.label.text = "55°F"
        temperature.wetsuitView.topLabel.text = "Recommended"
        temperature.wetsuitView.bottomLabel.text = "4mm Wetsuit"
        temperature.layoutMargins = UIEdgeInsets(top: 20, left: 20, bottom: 20, right: 20)
        temperature.cornerRadius = 5
    }

    private var reportView: ReportView {
        return view as! ReportView
    }

    @available(*, unavailable)
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) { fatalError("\(#function) not implemented.") }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}

