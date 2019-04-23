//
//  UIImage+URL.swift
//  PoodleSurf
//
//  Created by Westin Newell on 4/12/19.
//  Copyright © 2019 Haiku. All rights reserved.
//

import UIKit

extension UIImage {
    // TODO: Use asynchronous method instead.
    convenience init?(url: URL) {
        guard let data = try? Data(contentsOf: url) else {
            return nil
        }

        self.init(data: data)
    }
}
