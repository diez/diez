import Foundation
import CoreGraphics

@objc(DEZImage)
public final class Image: NSObject, Decodable {
    @objc public internal(set) var file: File
    @objc public internal(set) var file2x: File
    @objc public internal(set) var file3x: File
    @objc public internal(set) var width: Int
    @objc public internal(set) var height: Int

    init(
        file: File,
        file2x: File,
        file3x: File,
        width: Int,
        height: Int
    ) {
        self.file = file
        self.file2x = file2x
        self.file3x = file3x
        self.width = width
        self.height = height
    }
}

extension Image: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}
