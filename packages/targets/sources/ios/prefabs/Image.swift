public class Image : NSObject, Decodable, Updatable {
    var file: File
    var width: CGFloat
    var height: CGFloat
    var scale: CGFloat

    init(withFile file: File, withWidth width: CGFloat, withHeight height: CGFloat, withScale scale: CGFloat) {
        self.file = file
        self.width = width
        self.height = height
        self.scale = scale
        super.init()
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        file = try container.decode(File.self, forKey: .file)
        width = try container.decode(CGFloat.self, forKey: .width)
        height = try container.decode(CGFloat.self, forKey: .height)
        scale = try container.decode(CGFloat.self, forKey: .scale)
    }

    public func image() throws -> UIImage? {
        guard let url = file.url() else {
            return nil
        }

        return UIImage(data: try Data(contentsOf: url), scale: scale)
    }

    public func imageView() throws -> UIImageView? {
        let view = UIImageView(image: try image())
        view.frame.size.width = width
        view.frame.size.height = height
        return view
    }

    public func setBackground(forView view: UIView) {
        do {
            if let image = try image() {
                view.backgroundColor = UIColor(patternImage: image)
            }
        } catch {
            print("unable to set background")
        }
    }
}
