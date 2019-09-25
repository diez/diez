import UIKit

extension Color {
    /**
     A `UIColor` representation of the `Color`.
     */
    @objc
    public var uiColor: UIColor {
        return UIColor(color: self)
    }
}

extension UIColor {
    /**
     - Tag: UIColor.init

     Initializes a `UIColor` from the provided `Color`.
     */
    @objc(dez_initWithDEZColor:)
    public convenience init(color: Color) {
        let brightness = color.l + color.s * min(color.l, 1 - color.l)
        let saturation = (brightness == 0) ? 0 : 2 - 2 * color.l / brightness
        self.init(hue: color.h, saturation: saturation, brightness: brightness, alpha: color.a)
    }

    /**
     - See [UIColor(color: Color)](x-source-tag://UIColor.init)
      */
    @objc(dez_colorWithDEZColor:)
    public static func from(color: Color) -> UIColor {
        return UIColor(color: color)
    }
}

public protocol ColorAppliable {
    func apply(_ color: Color)
}

extension UIView: ColorAppliable {
    @objc(dez_applyColor:)
    open func apply(_ color: Color) {
        backgroundColor = UIColor(color: color)
    }
}
