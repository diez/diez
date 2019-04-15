fileprivate let fallbackFont = "Helvetica"

public class TextStyle : NSObject, Decodable, Updatable {
    var font: String
    var fontSize: CGFloat
    var color: Color

    init(withFont font: String, withFontSize fontSize: CGFloat, withColor color: Color) {
        self.font = font
        self.fontSize = fontSize
        self.color = color
        super.init()
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        font = try container.decode(String.self, forKey: .font)
        fontSize = try container.decode(CGFloat.self, forKey: .fontSize)
        color = try container.decode(Color.self, forKey: .color)
    }

    public func fontWithSize() -> UIFont {
        guard let font = UIFont(name: font, size: fontSize) else {
            return UIFont(name: fallbackFont, size: fontSize)!
        }

        return font
    }

    public func setTextStyle(forLabel label: UILabel) {
        label.font = fontWithSize()
        label.textColor = color.color
    }
}
