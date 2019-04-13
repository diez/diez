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
    private let diezDesignSystem = Diez<DesignSystem>()
    private let diezModelMocks = Diez<ModelMocks>()

    override func viewDidLoad() {
        super.viewDidLoad()

        navigationItem.titleView = titleView

        let model = ReportModel.makeExample()
        let binder = ReportViewModelBinder(view: reportView)
        binder.update(with: model)

        applyFallbackStyleTo(reportView: reportView, titleView: titleView)

        diezDesignSystem.attach(self) { [weak self] system in
            self?.apply(system)
        }

        diezModelMocks.attach(self) { mocks in
            guard let model = ReportModel(mock: mocks.report) else {
                print("Failed to create model from Diez mock.")
                return
            }

            binder.update(with: model)
        }
    }

    private func apply(_ system: DesignSystem) {
        UIView.animate(withDuration: 0.5) {
            defer {
                self.view.layoutSubviews()
            }

            self.apply(system.designs.report, to: self.reportView)

            guard let navigationBar = self.navigationController?.navigationBar else {
                print("Failed to get navigation bar.")
                return
            }

            self.apply(system.designs.navigationTitle, toView: self.titleView, navigationBar: navigationBar)
        }
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
