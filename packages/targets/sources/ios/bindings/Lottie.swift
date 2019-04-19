public final class Lottie: NSObject, Decodable {
    public var url: URL? {
        return file.url
    }

    var file: File

    init(file: File) {
        self.file = file
        super.init()
    }
}

extension Lottie: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        file = try container.decode(File.self, forKey: .file)
    }
}
