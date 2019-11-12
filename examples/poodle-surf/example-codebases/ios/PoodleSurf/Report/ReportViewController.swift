//
//  ReportViewController.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import DiezPoodleSurf

class ReportViewController: UIViewController {
    private lazy var diez = Diez<DesignLanguage>(view: view)
    private var binder: ReportViewModelBinder?

    override func viewDidLoad() {
        super.viewDidLoad()

        navigationItem.titleView = titleView

        binder = ReportViewModelBinder(view: reportView)

        diez.attach { [weak self] result in
            switch result {
            case .success(let lang):
                self?.apply(lang)
            case .failure(let error):
                print(error)
            }
        }
    }

    private func apply(_ lang: DesignLanguage) {
        self.view.layoutIfNeeded()
        
        UIView.animate(withDuration: 0.5) {
            defer {
                self.view.layoutIfNeeded()
            }

            self.apply(lang.designs.report, to: self.reportView)

            guard let navigationBar = self.navigationController?.navigationBar else {
                print("Failed to get navigation bar.")
                return
            }

            self.apply(lang.designs.navigationTitle, toView: self.titleView, navigationBar: navigationBar)
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
