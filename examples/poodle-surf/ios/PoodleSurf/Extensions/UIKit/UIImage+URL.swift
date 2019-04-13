//
//  UIImage+URL.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/12/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

extension UIImage {
    static func getURLForImage(named name: String) -> URL? {
        let fileManager = FileManager.default

        guard let cacheDirectory = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first else {
            return nil
        }

        let url = cacheDirectory.appendingPathComponent("\(name).png")

        guard fileManager.fileExists(atPath: url.path) else {
            guard
                let image = UIImage(named: name),
                let data = image.pngData() else {
                    return nil
            }

            fileManager.createFile(atPath: url.path, contents: data)

            return url
        }

        return url
    }

    /// TODO: Use asynchronous method instead. Possibly also rely on the suffix for image scale.
    /// - Note: Assumes the image was generated for the UIScreen.main's scale.
    convenience init?(url: URL) {
        guard let data = try? Data(contentsOf: url) else {
            return nil
        }

        self.init(data: data, scale: UIScreen.main.scale)
    }
}
