fileprivate let fallbackFont = "Helvetica"

public class TextStyle : NSObject, Decodable, Updatable {
    enum CodingKeys: String, CodingKey {
        case fontName = "font"
        case fontSize
        case color
    }

    var fontName: String
    var fontSize: CGFloat
    var color: Color

    init(fontName: String, fontSize: CGFloat, color: Color) {
        self.fontName = fontName
        self.fontSize = fontSize
        self.color = color
        super.init()
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        fontName = try container.decode(String.self, forKey: .fontName)
        fontSize = try container.decode(CGFloat.self, forKey: .fontSize)
        color = try container.decode(Color.self, forKey: .color)
    }

    public var font: UIFont {
        guard let font = UIFont(name: fontName, size: fontSize) else {
            return UIFont(name: fallbackFont, size: fontSize)!
        }

        return font
    }
}

public extension UILabel {
    func apply(_ textStyle: TextStyle) {
      font = textStyle.font
      textColor = textStyle.color.color
    }
}

public extension UITextView {
    func apply(_ textStyle: TextStyle) {
      font = textStyle.font
      textColor = textStyle.color.color
    }
}

public extension UITextField {
    func apply(_ textStyle: TextStyle) {
      font = textStyle.font
      textColor = textStyle.color.color
    }
}
