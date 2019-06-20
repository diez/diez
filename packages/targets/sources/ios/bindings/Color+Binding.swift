import UIKit

extension Color {
    /**
     A `UIColor` representation of the `Color`.
     */
    @objc
    public var uiColor: UIColor {
        return UIColor(self)
    }
}

extension UIColor {
    /**
     Initializes a `UIColor` from the provided `Color`.
     */
    public convenience init(_ color: Color) {
        let brightness = color.l + color.s * min(color.l, 1 - color.l)
        let saturation = (brightness == 0) ? 0 : 2 - 2 * color.l / brightness
        self.init(hue: color.h, saturation: saturation, brightness: brightness, alpha: color.a)
    }
}
