//
//  ViewController.swift
//  LoremIpsum
//
//  Created by Westin Newell on 5/28/19.
//  Copyright © 2019 Westin Newell. All rights reserved.
//

import UIKit
import DiezLoremIpsum

class ViewController: UIViewController {
    private lazy var diez = Diez<DesignSystem>(view: view)

    override func viewDidLoad() {
        super.viewDidLoad()

        diez.attach { [weak self] result in
            switch result {
            case .success(let designSystem):
                self?.apply(designSystem)
            case .failure(let error):
                print(error)
            }
        }
    }

    private func apply(_ designSystem: DesignSystem) {
        guard let view = self.view as? View else {
            fatalError("Unexpected view type: \(String(describing: self.view))")
        }

        view.backgroundColor = designSystem.colors.darkBackground.uiColor

        if let mastheadImage = designSystem.images.masthead.uiImage {
            view.headerView.backgroundColor = UIColor(patternImage: mastheadImage)
        }

        view.iconView.image = designSystem.images.logo.uiImage

        view.contentBackgroundView.backgroundColor = designSystem.colors.lightBackground.uiColor
        let margin = designSystem.layoutValues.contentMargin
        view.contentStackView.layoutMargins = UIEdgeInsets(
            top: margin.top,
            left: margin.left,
            bottom: margin.bottom,
            right: margin.right
        )
        view.contentStackView.spacing = designSystem.layoutValues.spacingSmall

        view.titleLabel.apply(designSystem.typographs.heading1)
        view.titleLabel.text = designSystem.strings.title

        view.captionLabel.apply(designSystem.typographs.caption)
        view.captionLabel.text = designSystem.strings.caption

        view.animationView.load(designSystem.loadingAnimation)
    }

    init() {
        super.init(nibName: nil, bundle: nil)
    }

    override func loadView() {
        view = View()
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }

    @available(*, unavailable)
    required init?(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
