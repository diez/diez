//
//  CardViewDescribable.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/11/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

protocol CardViewDescribable: UIView {
    var titleLabel: UILabel { get }
    var layoutMargins: UIEdgeInsets { get }
    var titleContentSpacing: CGFloat { get set }
    var gradient: Gradient? { get set }
}

extension ForecastCardView: CardViewDescribable { }

extension TemperatureCardView: CardViewDescribable { }
