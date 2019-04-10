//
//  LoadingViewController.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

class LoadingViewController: UIViewController {
    init() {
        super.init(nibName: nil, bundle: nil)
    }

    override func loadView() {
        view = LoadingView()
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        // XXX:
        loadingView.backgroundColor = .white
        loadingView.animationView.setAnimation(named: "loading-pizza")
        loadingView.animationView.play()
    }

    private var loadingView: LoadingView {
        return view as! LoadingView
    }

    @available(*, unavailable)
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) { fatalError("\(#function) not implemented.") }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
