import Foundation
import CoreGraphics

extension Size2D {
    @objc
    public var cgSize: CGSize {
        return CGSize(width: width, height: height)
    }
}
