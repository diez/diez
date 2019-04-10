//
//  Report.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/9/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

struct ReportState {
    struct Location {
        let region: String
        let place: String
        let mapImage: UIImage
        let bannerImage: UIImage
    }

    struct Temperature {
        let formattedValue: String
        let recommendedGear: String
    }

    let location: Location
    let temperature: Temperature
}

extension ReportState {
    static func makeExample() -> ReportState {
        let mapImage = UIImage(named: "Santa Cruz Map")!
        let bannerImage = UIImage(named: "Santa Cruz Banner")!

        let location = Location(
            region: "Santa Cruz, CA",
            place: "Natural Bridges State Park",
            mapImage: mapImage,
            bannerImage: bannerImage)

        let temperature = Temperature(
            formattedValue: "55°F",
            recommendedGear: "4mm Wetsuit")

        return ReportState(
            location: location,
            temperature: temperature)
    }
}
