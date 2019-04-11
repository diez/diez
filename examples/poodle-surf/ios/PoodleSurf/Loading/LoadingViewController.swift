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

        applyStyle(to: loadingView)
    }

    private func applyStyle(to view: LoadingView) {
        view.backgroundColor = UIColor(red: 120/255, green: 207/255, blue: 253/255, alpha: 1)
        view.animationView.setAnimation(named: "hang10")
        view.animationView.play()
    }

    private var loadingView: LoadingView {
        return view as! LoadingView
    }

    @available(*, unavailable)
    override init(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) { fatalError("\(#function) not implemented.") }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
