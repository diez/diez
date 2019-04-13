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
        header.locationImageView.image = UIImage(url: state.mapImage)
        header.bannerImageView.image = UIImage(url: state.bannerImage)
    }

    private func update(with state: ReportState.Temperature) {
        let card = view.temperatureCardView
        card.temperatureView.label.text = state.formattedValue
        card.wetsuitView.bottomLabel.text = state.recommendedGear
    }

    private func update(with state: ReportState.WindForecast) {
        let card = view.windCardView
        update(card.earlyPart, withState: state.early, icon: UIImage(url: state.early.directionImage))
        update(card.middlePart, withState: state.middle, icon: UIImage(url: state.middle.directionImage))
        update(card.latePart, withState: state.late, icon: UIImage(url: state.late.directionImage))
    }

    private func update<T: ForecastDescribable>(_ card: ForecastCardView, with state: T) {
        update(card.earlyPart, withState: state.early)
        update(card.middlePart, withState: state.middle)
        update(card.latePart, withState: state.late)
    }

    private func update(_ view: DayPartView, withState state: DayPartDescribable, icon: UIImage? = nil){
        view.timeLabel.text = state.time
        view.valueLabel.text = state.value
        view.iconView.image = icon
        view.iconView.isHidden = (icon == nil)

    }
}
