//
//  ReportState+Example.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/11/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

extension ReportState {
    static func makeExample() -> ReportState {
        let mapImageName = "Santa Cruz Map"
        let bannerImageName = "Santa Cruz Banner"

        let location = Location(
            region: "Santa Cruz, CA",
            place: "Natural Bridges State Park",
            mapImageName: mapImageName,
            bannerImageName: bannerImageName)

        let temperature = Temperature(
            formattedValue: "55°F",
            recommendedGear: "4mm Wetsuit")

        let earlyTime = "6am"
        let middleTime = "Noon"
        let lateTime = "6pm"

        let wind = ReportState.WindForecast.makeExample(earlyTime: earlyTime, middleTime: middleTime, lateTime: lateTime)
        let swell = ReportState.Forecast.makeSwellExample(earlyTime: earlyTime, middleTime: middleTime, lateTime: lateTime)
        let tide = ReportState.Forecast.makeTideExample(earlyTime: earlyTime, middleTime: middleTime, lateTime: lateTime)

        return ReportState(location: location, temperature: temperature, wind: wind, swell: swell, tide: tide)
    }
}

extension ReportState.WindForecast {
    static func makeExample(earlyTime: String, middleTime: String, lateTime: String) -> ReportState.WindForecast {
        let early = DayPart(
            direction: .southWest,
            value: "4",
            time: earlyTime)

        let middle = DayPart(
            direction: .south,
            value: "12",
            time:  middleTime)

        let late = DayPart(
            direction: .northEast,
            value: "17",
            time: lateTime)

        return ReportState.WindForecast(early: early, middle: middle, late: late)
    }
}

extension ReportState.Forecast {
    static func makeSwellExample(earlyTime: String, middleTime: String, lateTime: String) -> ReportState.Forecast {
        let early = DayPart(
            value: "6.3",
            time: earlyTime)

        let middle = DayPart(
            value: "6",
            time: middleTime)

        let late = DayPart(
            value: "6.5",
            time: lateTime)

        return ReportState.Forecast(early: early, middle: middle, late: late)
    }

    static func makeTideExample(earlyTime: String, middleTime: String, lateTime: String) -> ReportState.Forecast {
        let early = DayPart(
            value: "5",
            time: earlyTime)

        let middle = DayPart(
            value: "0.5",
            time: middleTime)

        let late = DayPart(
            value: "4",
            time: lateTime)

        return ReportState.Forecast(early: early, middle: middle, late: late)
    }
}
