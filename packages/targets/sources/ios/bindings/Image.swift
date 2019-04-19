public final class Image: NSObject, Decodable {
    public var url: URL? {
        return file.url
    }
    public var image: UIImage? {
        guard let url = url else {
            return nil
        }

        do {
            let data = try Data(contentsOf: url)
            return UIImage(data: data, scale: scale) 
        } catch {
            print("Failed to get image data: \(error)")
            return nil
        }
    }

    var file: File
    var width: CGFloat
    var height: CGFloat
    var scale: CGFloat

    init(file: File, width: CGFloat, height: CGFloat, scale: CGFloat) {
        self.file = file
        self.width = width
        self.height = height
        self.scale = scale
        super.init()
    }
}

extension Image: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        file = try container.decode(File.self, forKey: .file)
        width = try container.decode(CGFloat.self, forKey: .width)
        height = try container.decode(CGFloat.self, forKey: .height)
        scale = try container.decode(CGFloat.self, forKey: .scale)
    }
}
