//
//  Report.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

protocol DayPartDescribable {
    var value: String { get }
    var time: String { get }
}

protocol ForecastDescribable {
    associatedtype DayPart: DayPartDescribable

    var early: DayPart { get }
    var middle: DayPart { get }
    var late: DayPart { get }
}

struct ReportModel {
    struct Location {
        let region: String
        let place: String
        let mapImage: URL
        let bannerImage: URL
    }

    struct Temperature {
        let formattedValue: String
        let recommendedGear: String
    }

    struct WindForecast: ForecastDescribable {
        struct DayPart: DayPartDescribable {
            let directionImage: URL
            let value: String
            let time: String
        }

        let early: DayPart
        let middle: DayPart
        let late: DayPart
    }

    struct Forecast: ForecastDescribable {
        struct DayPart: DayPartDescribable {
            let value: String
            let time: String
        }

        let early: DayPart
        let middle: DayPart
        let late: DayPart
    }

    let location: Location
    let temperature: Temperature
    let wind: WindForecast
    let swell: Forecast
    let tide: Forecast
}
