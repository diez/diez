//
//  ReportView+State.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/12/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

class ReportViewStateBinder {
    let view: ReportView

    init(view: ReportView) {
        self.view = view
    }

    func update(with state: ReportState) {
        update(with: state.location)
        update(with: state.temperature)
        update(with: state.wind)
        update(view.swellCardView, with: state.swell)
        update(view.tideCardView, with: state.tide)
    }

    private func update(with state: ReportState.Location) {
        let header = view.headerView
        header.placeLabel.text = state.place
        header.regionLabel.text = state.region
        header.bannerImageView.image = UIImage(named: state.bannerImageName)
        header.locationImageView.image = UIImage(named: state.mapImageName)
    }

    private func update(with state: ReportState.Temperature) {
        let card = view.temperatureCardView
        card.temperatureView.label.text = state.formattedValue
        card.wetsuitView.bottomLabel.text = state.recommendedGear
    }

    private func update(with state: ReportState.WindForecast) {
        let card = view.windCardView
        update(card.earlyPart, withState: state.early, iconImageName: UIImage.iconName(for: state.early.direction))
        update(card.middlePart, withState: state.middle, iconImageName: UIImage.iconName(for: state.middle.direction))
        update(card.latePart, withState: state.late, iconImageName: UIImage.iconName(for: state.late.direction))
    }

    private func update<T: ForecastDescribable>(_ card: ForecastCardView, with state: T) {
        update(card.earlyPart, withState: state.early)
        update(card.middlePart, withState: state.middle)
        update(card.latePart, withState: state.late)
    }

    private func update(_ view: DayPartView, withState state: DayPartDescribable, iconImageName iconName: String? = nil){
        view.timeLabel.text = state.time
        view.valueLabel.text = state.value

        guard
            let iconName = iconName,
            let icon = UIImage(named: iconName) else {
                view.iconView.isHidden = true
                return
        }

        view.iconView.isHidden = false
        view.iconView.image = icon

    }
}
