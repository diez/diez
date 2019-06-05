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
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let designSystem = DesignSystem()
        designSystem.typographs.fontRegistry.registerFonts()

        guard let view = self.view as? View else {
            fatalError("Unexpected view type: \(String(describing: self.view))")
        }
        
        guard let mastheadImage = designSystem.images.masthead.image else {
            fatalError("Failed to load masthead image.")
        }
        
        view.backgroundColor = designSystem.colors.darkBackground.color
        
        view.headerView.backgroundColor = UIColor(patternImage: mastheadImage)
        
        view.iconView.image = designSystem.images.logo.image
        
        view.contentBackgroundView.backgroundColor = designSystem.colors.lightBackground.color
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
