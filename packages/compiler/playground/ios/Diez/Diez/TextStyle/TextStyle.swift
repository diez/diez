import UIKit

fileprivate let fallbackFont = "Helvetica"

public class FontRegistry : NSObject, Decodable, Updatable {
    var files: [File]

    init(withFiles files: [File]) {
        self.files = files
        super.init()
        self.registerFonts(withFiles: files)
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        files = try container.decode([File].self, forKey: .files)
        // TODO: diff files, only register the new ones
        self.registerFonts(withFiles: files)
    }

    private func registerFonts(withFiles files: [File]) {
        files.forEach{
            guard let url = $0.url() else {
                return
            }

            do {
                let data = try Data(contentsOf: url)

                guard let cfData = (data.withUnsafeBytes {(bytes: UnsafePointer<UInt8>) in
                    return CFDataCreate(kCFAllocatorDefault, bytes, data.count)
                }) else {
                    return
                }

                guard let dataProvider = CGDataProvider(data: cfData) else {
                    return
                }

                guard let cgFont = CGFont(dataProvider) else {
                    return
                }

                var error: Unmanaged<CFError>?
                guard CTFontManagerRegisterGraphicsFont(cgFont, &error) else {
                    print("unable to register font")
                    return
                }
            } catch {
                print("unable to load font data")
                print(error)
                return
            }
        }
    }
}

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
        label.textColor = color
    }
}
