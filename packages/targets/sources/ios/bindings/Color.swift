public class Color: NSObject, Decodable, Updatable {
    var h: CGFloat
    var s: CGFloat
    var l: CGFloat
    var a: CGFloat

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        h = try container.decode(CGFloat.self, forKey: .h)
        s = try container.decode(CGFloat.self, forKey: .s)
        l = try container.decode(CGFloat.self, forKey: .l)
        a = try container.decode(CGFloat.self, forKey: .a)
    }

    public var color: UIColor {
        let brightness = l + s * min(l, 1 - l)
        let saturation = (brightness == 0) ? 0 : 2 - 2 * l / brightness
        return UIColor(hue: h, saturation: saturation, brightness: brightness, alpha: a)
    }

    public init(hue: CGFloat, saturation: CGFloat, lightness: CGFloat, alpha: CGFloat) {
        self.h = hue
        self.s = saturation
        self.l = lightness
        self.a = alpha
    }
}
