import Foundation
import UIKit
import WebKit
import Lottie
import UIKit.UIView

public final class File: NSObject, Decodable, Updatable {
    public var src: String

    private enum CodingKeys: String, CodingKey {
        case src
    }


    init(
        src: String
    ) {
        self.src = src
    }


    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        src = try container.decode(String.self, forKey: .src)
    }
}

extension File {
    public var url: URL? {
        return URL(string: fullyQualifiedURLString)
    }
    public var request: URLRequest? {
        guard let url = url else {
            return nil
        }

        return URLRequest(url: url)
    }

    private var fullyQualifiedURLString: String {
        // TODO: when we are not in development, we should load the file from a local bundle URL.
        // This will look something like: Bundle.main.url(forResource: "index", withExtension: "html")
        // except we will be loading from the framework bundle (not main). Probably this should be handled
        // inside class Environment {...}.
        return environment.isDevelopment
            ? "\(environment.serverUrl)\(src)"
            : "TODO"
    }
}

// MARK: File<Equatable>

extension File {
    public override func isEqual(_ other: Any?) -> Bool {
        guard let other = other as? File else {
            return false
        }
        // TODO: Update to also consider contents of the underlying file.
        return src == other.src
    }
}

// MARK: File<Hashable>

extension File {
    public override var hash: Int {
        // TODO: Update to also consider contents of the underlying file.
        var hasher = Hasher()
        hasher.combine(src)
        return hasher.finalize()
    }
}

public final class Image: NSObject, Decodable, Updatable {
    public var file: File
    public var width: Int
    public var height: Int
    public var scale: CGFloat

    private enum CodingKeys: String, CodingKey {
        case file
        case width
        case height
        case scale
    }


    init(
        file: File,
        width: Int,
        height: Int,
        scale: CGFloat
    ) {
        self.file = file
        self.width = width
        self.height = height
        self.scale = scale
    }


    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        try container.update(&file, forKey: .file)
        width = try container.decode(Int.self, forKey: .width)
        height = try container.decode(Int.self, forKey: .height)
        scale = try container.decode(CGFloat.self, forKey: .scale)
    }
}

extension Image {
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
}

public final class SVG: NSObject, Decodable, Updatable {
    public var src: String

    private enum CodingKeys: String, CodingKey {
        case src
    }


    init(
        src: String
    ) {
        self.src = src
    }


    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        src = try container.decode(String.self, forKey: .src)
    }
}

extension SVG {
    public var url: URL? {
        return file.url
    }

    var file: File {
      return File(src: "\(src).html")
    }
}

public final class SVGView: UIView {
    public override init(frame: CGRect) {
        super.init(frame: frame)

        setup()
    }

    public required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)

        setup()
    }

    public func load(_ svg: SVG) {
        guard let request = svg.file.request else {
            print("unable to load SVG URL")
            return
        }

        // TODO: Warn user if NSAppTransportSecurity.NSAllowsLocalNetworking is not set to true in their Info.plist.

        webView.scrollView.isScrollEnabled = false
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.load(request)
    }

    private let webView = WKWebView()

    private func setup() {
        webView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(webView)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: trailingAnchor),
            webView.topAnchor.constraint(equalTo: topAnchor),
            webView.bottomAnchor.constraint(equalTo: bottomAnchor),
        ])
    }

    public override class var requiresConstraintBasedLayout: Bool { return true }
}

public final class Lottie: NSObject, Decodable, Updatable {
    public var file: File

    private enum CodingKeys: String, CodingKey {
        case file
    }


    init(
        file: File
    ) {
        self.file = file
    }


    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        try container.update(&file, forKey: .file)
    }
}

extension Lottie {
    public var url: URL? {
        return file.url
    }
}

public enum LottieError: Error, CustomDebugStringConvertible {
    case invalidURL
    case requestFailed(Error?)
    case deserializationError(Data, Error)
    case invalidType(json: Any)

    public var debugDescription: String {
        switch self {
        case .invalidURL:
            return "Lottie URL is invalid."
        case .requestFailed(let error):
            return "Request failed: \(String(describing: error))"
        case .deserializationError(let data, let error):
            let dataAsString = String(data: data, encoding: String.Encoding.utf8)
            return "Lottie file failed to be deserialized: \(error)\n\(String(describing: dataAsString))"
        case .invalidType(let json):
            return "JSON was not in the correct format ([AnyHashable: Any]): \(json)"
        }
    }
}

extension LOTAnimationView {
    public typealias LoadCompletion = (Result<Void, LottieError>) -> Void

    // TODO: Should this be synchronous when resource is local?
    @discardableResult
    public func load(_ lottie: Lottie, session: URLSession = .shared, completion: LoadCompletion? = nil) -> URLSessionDataTask? {
        // TODO: Remove debug logging?
        let completion: LoadCompletion? = { result in
            switch result {
            case .failure(let error):
                print(error.debugDescription)
            default: break
            }

            completion?(result)
        }

        guard let url = lottie.url else {
            completion?(.failure(.invalidURL))
            return nil
        }

        print(url)

        let task = session.dataTask(with: url) { [weak self] (data, response, error) in
            self?.loadWith(data: data, response: response, error: error, completion: completion)
        }

        task.resume()

        return task
    }

    private func loadWith(data: Data?, response: URLResponse?, error: Error?, completion: LoadCompletion?) {
        guard let data = data else {
            DispatchQueue.main.async { completion?(.failure(.requestFailed(error))) }
            return
        }

        do {
            let jsonObject = try JSONSerialization.jsonObject(with: data, options: .allowFragments)

            guard let json = jsonObject as? [AnyHashable: Any] else {
                DispatchQueue.main.async { completion?(.failure(.invalidType(json: jsonObject))) }
                return
            }

            DispatchQueue.main.async {
                // TODO: Use bundle for referenced assets?
                self.setAnimation(json: json)

                // TODO: Use configuration.
                self.loopAnimation = true
                self.play { _ in
                    completion?(.success(()))
                }
            }
        } catch {
            DispatchQueue.main.async { completion?(.failure(.deserializationError(data, error)))}
        }
    }
}

// TODO: Make internal
public final class FontRegistry: NSObject, Decodable {
    var files: [File]
    var registeredFiles: Set<File> = []

    init(files: [File]) {
        self.files = files
        super.init()
        self.registerFonts(with: files)
    }

    private enum CodingKeys: String, CodingKey {
        case files
    }

    private func registerFonts(with files: [File]) {
        files.forEach { file in
            if registeredFiles.contains(file) {
                return
            }

            registeredFiles.insert(file)

            guard let url = file.url else {
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

extension FontRegistry: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        files = try container.decode([File].self, forKey: .files)
        // TODO: diff files, only register the new ones
        self.registerFonts(with: files)
    }
}

public final class Color: NSObject, Decodable, Updatable {
    public var h: CGFloat
    public var s: CGFloat
    public var l: CGFloat
    public var a: CGFloat

    private enum CodingKeys: String, CodingKey {
        case h
        case s
        case l
        case a
    }


    init(
        h: CGFloat,
        s: CGFloat,
        l: CGFloat,
        a: CGFloat
    ) {
        self.h = h
        self.s = s
        self.l = l
        self.a = a
    }


    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        h = try container.decode(CGFloat.self, forKey: .h)
        s = try container.decode(CGFloat.self, forKey: .s)
        l = try container.decode(CGFloat.self, forKey: .l)
        a = try container.decode(CGFloat.self, forKey: .a)
    }
}

extension Color {
    public var color: UIColor {
        let brightness = l + s * min(l, 1 - l)
        let saturation = (brightness == 0) ? 0 : 2 - 2 * l / brightness
        return UIColor(hue: h, saturation: saturation, brightness: brightness, alpha: a)
    }
}

public final class TextStyle: NSObject, Decodable, Updatable {
    public var fontName: String
    public var fontSize: CGFloat
    public var color: Color

    private enum CodingKeys: String, CodingKey {
        case fontName
        case fontSize
        case color
    }


    init(
        fontName: String,
        fontSize: CGFloat,
        color: Color
    ) {
        self.fontName = fontName
        self.fontSize = fontSize
        self.color = color
    }


    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        fontName = try container.decode(String.self, forKey: .fontName)
        fontSize = try container.decode(CGFloat.self, forKey: .fontSize)
        try container.update(&color, forKey: .color)
    }
}

extension TextStyle {
    public var font: UIFont {
        guard let font = UIFont(name: fontName, size: fontSize) else {
            return UIFont.systemFont(ofSize: fontSize)
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

public final class Haiku: NSObject, Decodable, Updatable {
    public var component: String

    private enum CodingKeys: String, CodingKey {
        case component
    }


    init(
        component: String
    ) {
        self.component = component
    }


    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        component = try container.decode(String.self, forKey: .component)
    }
}

// TODO: this should also accept options.
extension Haiku {
    public var url: URL? {
        return file.url
    }

    var file: File {
      return File(src: "haiku/\(component).html")
    }
}

public final class HaikuView: UIView {
    public override init(frame: CGRect) {
        super.init(frame: frame)

        setup()
    }

    public required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)

        setup()
    }

    public func load(_ haiku: Haiku) {
        guard let request = haiku.file.request else {
            print("unable to load Haiku URL")
            return
        }

        // TODO: Warn user if NSAppTransportSecurity.NSAllowsLocalNetworking is not set to true in their Info.plist.

        webView.scrollView.isScrollEnabled = false
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.load(request)
    }

    private let webView = WKWebView()

    private func setup() {
        webView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(webView)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: trailingAnchor),
            webView.topAnchor.constraint(equalTo: topAnchor),
            webView.bottomAnchor.constraint(equalTo: bottomAnchor),
        ])
    }

    public override class var requiresConstraintBasedLayout: Bool { return true }
}

public final class Bindings: NSObject, StateBag {
    public var image: Image
    public var svg: SVG
    public var lottie: Lottie
    public var fontRegistry: FontRegistry
    public var textStyle: TextStyle
    public var haiku: Haiku

    private enum CodingKeys: String, CodingKey {
        case image
        case svg
        case lottie
        case fontRegistry
        case textStyle
        case haiku
    }

    public override init() {
        image = Image(file: File(src: "assets/image%20with%20spaces.jpg"), width: 246, height: 246, scale: 3)
        svg = SVG(src: "assets/image.svg")
        lottie = Lottie(file: File(src: "assets/lottie.json"))
        fontRegistry = FontRegistry(files: [File(src: "assets/SomeFont.ttf")])
        textStyle = TextStyle(fontName: "Helvetica", fontSize: 50, color: Color(h: 0.16666666666666666, s: 1, l: 0.5, a: 1))
        haiku = Haiku(component: "haiku-component")
    }

    init(
        image: Image,
        svg: SVG,
        lottie: Lottie,
        fontRegistry: FontRegistry,
        textStyle: TextStyle,
        haiku: Haiku
    ) {
        self.image = image
        self.svg = svg
        self.lottie = lottie
        self.fontRegistry = fontRegistry
        self.textStyle = textStyle
        self.haiku = haiku
    }

    public static let name = "Bindings"

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        try container.update(&image, forKey: .image)
        try container.update(&svg, forKey: .svg)
        try container.update(&lottie, forKey: .lottie)
        try container.update(&fontRegistry, forKey: .fontRegistry)
        try container.update(&textStyle, forKey: .textStyle)
        try container.update(&haiku, forKey: .haiku)
    }
}
