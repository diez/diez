//
//  View.swift
//  LoremIpsum
//
//  Created by Westin Newell on 5/28/19.
//  Copyright © 2019 Westin Newell. All rights reserved.
//

import UIKit
import Lottie
import DiezLoremIpsum

class View: UIView {
    let headerView = UIView()
    let contentBackgroundView = UIView()
    let contentStackView = UIStackView()
    let iconView = UIImageView()
    let titleLabel = UILabel()
    let captionLabel = UILabel()
    let animationView = LOTAnimationView()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        setupLayout()
    }
    
    override class var requiresConstraintBasedLayout: Bool {
        return true
    }
    
    private let stackView = UIStackView()
    
    private func setupLayout() {
        setupStackView()
        addHeaderView()
        addContentStackView()
        addIconView()
    }
    
    private func setupStackView() {
        stackView.axis = .vertical
        stackView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(stackView)
        stackView.leadingAnchor.constraint(equalTo: leadingAnchor).isActive = true
        stackView.trailingAnchor.constraint(equalTo: trailingAnchor).isActive = true
        stackView.topAnchor.constraint(equalTo: safeAreaLayoutGuide.topAnchor).isActive = true
        stackView.bottomAnchor.constraint(equalTo: bottomAnchor).isActive = true
    }
    
    private func addHeaderView() {
        stackView.addArrangedSubview(headerView)
        headerView.heightAnchor.constraint(equalToConstant: 112).isActive = true
    }
    
    private func addContentStackView() {
        contentStackView.axis = .vertical
        contentStackView.isLayoutMarginsRelativeArrangement = true
        stackView.addArrangedSubview(contentStackView)
        
        captionLabel.numberOfLines = 0
        contentStackView.addArrangedSubview(titleLabel)
        
        captionLabel.numberOfLines = 0
        contentStackView.addArrangedSubview(captionLabel)
        
        let animationContainerView = makeAnimationContainerView()
        contentStackView.addArrangedSubview(animationContainerView)
        
        contentBackgroundView.translatesAutoresizingMaskIntoConstraints = false
        contentStackView.insertSubview(contentBackgroundView, at: 0)
        contentBackgroundView.leadingAnchor.constraint(equalTo: contentStackView.leadingAnchor).isActive = true
        contentBackgroundView.trailingAnchor.constraint(equalTo: contentStackView.trailingAnchor).isActive = true
        contentBackgroundView.topAnchor.constraint(equalTo: contentStackView.topAnchor).isActive = true
        contentBackgroundView.bottomAnchor.constraint(equalTo: contentStackView.bottomAnchor).isActive = true
    }
    
    private func makeAnimationContainerView() -> UIView {
        let animationContainerView = UIView()
        animationView.translatesAutoresizingMaskIntoConstraints = false
        animationContainerView.addSubview(animationView)
        animationView.centerXAnchor.constraint(equalTo: animationContainerView.centerXAnchor).isActive = true
        animationView.centerYAnchor.constraint(equalTo: animationContainerView.centerYAnchor).isActive = true
        animationView.widthAnchor.constraint(equalToConstant: 174).isActive = true
        animationView.heightAnchor.constraint(equalToConstant: 165).isActive = true
        return animationContainerView
    }
    
    private func addIconView() {
        iconView.translatesAutoresizingMaskIntoConstraints = false
        stackView.addSubview(iconView)
        iconView.centerYAnchor.constraint(equalTo: headerView.bottomAnchor).isActive = true
        iconView.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor).isActive = true
    }
    
    @available(*, unavailable)
    required init(coder aDecoder: NSCoder) { fatalError("\(#function) not implemented.") }
}
