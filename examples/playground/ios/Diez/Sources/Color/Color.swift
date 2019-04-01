import UIKit

final public class Color : UIColor {}

extension Color : Decodable {
    public convenience init(hue: CGFloat, hslSaturation: CGFloat, lightness: CGFloat, alpha: CGFloat) {
        let brightness = lightness + hslSaturation * min(lightness, 1 - lightness)
        let saturation = (brightness == 0) ? 0 : 2 - 2 * lightness / brightness
        self.init(hue: hue, saturation: saturation, brightness: brightness, alpha: alpha)
    }

    public convenience init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let result = try container.decode([CGFloat].self)
        self.init(hue: result[0], hslSaturation: result[1], lightness: result[2], alpha: result[3])
    }
}
