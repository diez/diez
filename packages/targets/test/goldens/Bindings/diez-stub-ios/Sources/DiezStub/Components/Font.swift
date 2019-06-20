import Foundation
import CoreGraphics

@objc(DEZFont)
public final class Font: NSObject, Decodable {
    @objc public internal(set) var file: File
    @objc public internal(set) var name: String

    convenience override init() {
        self.init(
            file: File(src: "assets/SomeFont.ttf", type: "font"),
            name: "SomeFont"
        )
    }

    init(
        file: File,
        name: String
    ) {
        self.file = file
        self.name = name
    }
}

extension Font: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}
