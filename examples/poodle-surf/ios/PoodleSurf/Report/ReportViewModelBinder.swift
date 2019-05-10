//
//  ReportViewModelBinder.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/12/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit
import Diez

class ReportViewModelBinder {
    let view: ReportView
    private let diez: Diez<ModelMocks>

    init(view: ReportView) {
        self.view = view
        diez = Diez(view: view)

        diez.attach { [weak self] result in
            switch result {
            case .success(let mocks):
                guard let model = ReportModel(mock: mocks.report) else {
                    print("Failed to create model from Diez mock.")
                    return
                }

                self?.update(with: model)
            case .failure(let error):
                print(error)
            }
        }
    }

    func update(with model: ReportModel) {
        update(with: model.location)
        update(with: model.temperature)
        update(with: model.wind)
        update(view.swellCardView, with: model.swell)
        update(view.tideCardView, with: model.tide)
    }

    private func update(with model: ReportModel.Location) {
        let header = view.headerView
        header.placeLabel.text = model.place
        header.regionLabel.text = model.region
        header.locationImageView.image = UIImage(url: model.mapImage)
        header.bannerImageView.image = UIImage(url: model.bannerImage)
    }

    private func update(with model: ReportModel.Temperature) {
        let card = view.temperatureCardView
        card.temperatureView.label.text = model.formattedValue
        card.wetsuitView.bottomLabel.text = model.recommendedGear
    }

    private func update(with model: ReportModel.WindForecast) {
        let card = view.windCardView
        update(card.earlyPart, withModel: model.early, icon: UIImage(url: model.early.directionImage))
        update(card.middlePart, withModel: model.middle, icon: UIImage(url: model.middle.directionImage))
        update(card.latePart, withModel: model.late, icon: UIImage(url: model.late.directionImage))
    }

    private func update<T: ForecastDescribable>(_ card: ForecastCardView, with model: T) {
        update(card.earlyPart, withModel: model.early)
        update(card.middlePart, withModel: model.middle)
        update(card.latePart, withModel: model.late)
    }

    private func update(_ view: DayPartView, withModel model: DayPartDescribable, icon: UIImage? = nil){
        view.timeLabel.text = model.time
        view.valueLabel.text = model.value
        view.iconView.image = icon
        view.iconView.isHidden = (icon == nil)
    }
}
