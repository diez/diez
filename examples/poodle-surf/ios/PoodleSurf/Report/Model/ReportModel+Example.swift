//
//  ReportModel+Example.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/11/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

extension ReportModel {
    static func makeExample() -> ReportModel {
        let location = Location(
            region: "Santa Cruz, CA",
            place: "Natural Bridges State Park",
            mapImage: UIImage.getURLForImage(named: "Santa Cruz Map")!,
            bannerImage: UIImage.getURLForImage(named: "Santa Cruz Banner")!)

        let temperature = Temperature(
            formattedValue: "55°F",
            recommendedGear: "4mm Wetsuit")

        let earlyTime = "6am"
        let middleTime = "Noon"
        let lateTime = "6pm"

        let wind = ReportModel.WindForecast.makeExample(earlyTime: earlyTime, middleTime: middleTime, lateTime: lateTime)
        let swell = ReportModel.Forecast.makeSwellExample(earlyTime: earlyTime, middleTime: middleTime, lateTime: lateTime)
        let tide = ReportModel.Forecast.makeTideExample(earlyTime: earlyTime, middleTime: middleTime, lateTime: lateTime)

        return ReportModel(location: location, temperature: temperature, wind: wind, swell: swell, tide: tide)
    }
}

extension ReportModel.WindForecast {
    static func makeExample(earlyTime: String, middleTime: String, lateTime: String) -> ReportModel.WindForecast {
        let early = DayPart(
            directionImage: UIImage.getURLForImage(named: "Direction - South West")!,
            value: "4",
            time: earlyTime)

        let middle = DayPart(
            directionImage: UIImage.getURLForImage(named: "Direction - South")!,
            value: "12",
            time:  middleTime)

        let late = DayPart(
            directionImage: UIImage.getURLForImage(named: "Direction - North East")!,
            value: "17",
            time: lateTime)

        return ReportModel.WindForecast(early: early, middle: middle, late: late)
    }
}

extension ReportModel.Forecast {
    static func makeSwellExample(earlyTime: String, middleTime: String, lateTime: String) -> ReportModel.Forecast {
        let early = DayPart(
            value: "6.3",
            time: earlyTime)

        let middle = DayPart(
            value: "6",
            time: middleTime)

        let late = DayPart(
            value: "6.5",
            time: lateTime)

        return ReportModel.Forecast(early: early, middle: middle, late: late)
    }

    static func makeTideExample(earlyTime: String, middleTime: String, lateTime: String) -> ReportModel.Forecast {
        let early = DayPart(
            value: "5",
            time: earlyTime)

        let middle = DayPart(
            value: "0.5",
            time: middleTime)

        let late = DayPart(
            value: "4",
            time: lateTime)

        return ReportModel.Forecast(early: early, middle: middle, late: late)
    }
}
