//
//  LoadingViewController.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import Diez
import Lottie

class LoadingViewController: UIViewController {
    private let diezDesignSystem = Diez<DesignSystem>()

    init() {
        super.init(nibName: nil, bundle: nil)
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        applyFallbackStyle(to: loadingView)

        diezDesignSystem.attach(self) { [weak self] system in
            self?.apply(system)
        }
    }

    private func apply(_ system: DesignSystem){
        apply(system.loading, to: loadingView)
    }

    private var loadingView: LoadingView {
        return view as! LoadingView
    }

    override func loadView() {
        view = LoadingView()
    }

    @available(*, unavailable)
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) { fatalError("\(#function) not implemented.") }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}

// MARK: - Diez Styling

extension LoadingViewController {
}
