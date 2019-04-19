//
//  ReportModel+Diez.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/12/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import Diez

extension ReportModel {
    init?(mock: ReportModelMock) {
        guard
            let location = Location(mock: mock.location),
            let wind = WindForecast(mock: mock.wind) else {
                return nil
        }

        self.init(
            location: location,
            temperature: Temperature(mock: mock.temperature),
            wind: wind,
            swell: Forecast(mock: mock.swell),
            tide: Forecast(mock: mock.tide))
    }
}

extension ReportModel.Location {
    init?(mock: LocationMock) {
        guard
            let mapImageURL = mock.mapImage.url,
            let bannerImageURL = mock.bannerImage.url else {
                return nil
        }

        self.init(
            region: mock.region,
            place: mock.place,
            mapImage: mapImageURL,
            bannerImage: bannerImageURL)
    }
}

extension ReportModel.Temperature {
    init(mock: TemperatureMock) {
        self.init(
            formattedValue: mock.value,
            recommendedGear: mock.gear)
    }
}

extension ReportModel.WindForecast {
    init?(mock: WindMock) {
        guard
            let early = DayPart(mock: mock.early),
            let middle = DayPart(mock: mock.middle),
            let late = DayPart(mock: mock.late) else {
                return nil
        }

        self.init(
            early: early,
            middle: middle,
            late: late)
    }
}

extension ReportModel.WindForecast.DayPart {
    init?(mock: WindDayPartMock) {
        guard let directionImageURL = mock.direction.url else {
            return nil
        }

        self.init(
            directionImage: directionImageURL,
            value: mock.value,
            time: mock.dayPart)
    }
}

extension ReportModel.Forecast {
    init(mock: ForecastMock) {
        self.init(
            early: DayPart(mock: mock.early),
            middle: DayPart(mock: mock.middle),
            late: DayPart(mock: mock.late))
    }
}

extension ReportModel.Forecast.DayPart {
    init(mock: ForecastDayPartMock) {
        self.init(
            value: mock.value,
            time: mock.dayPart)
    }
}
