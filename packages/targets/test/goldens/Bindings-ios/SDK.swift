import Foundation
import UIKit
import WebKit
import Lottie
import UIKit.UIView

extension Bundle {
    static let diezResources = Bundle(url: Bundle.diez.resourceURL!.appendingPathComponent("Static.bundle"))
}

public final class File: NSObject, Decodable {
    public var src: String

    private enum CodingKeys: String, CodingKey {
        case src
    }


    init(
        src: String
    ) {
        self.src = src
    }
}

extension File: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        src = try container.decode(String.self, forKey: .src)
    }
}

extension File: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

extension File {
    public var url: URL? {
        if environment.isDevelopment {
            return URL(string: "\(environment.serverUrl)\(src)")
        }

        return Bundle.diezResources?.url(forFile: self)
    }
    public var request: URLRequest? {
        guard let url = url else {
            return nil
        }

        return URLRequest(url: url)
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

extension Bundle {
    func url(forFile file: File) -> URL? {
        return url(forResource: file.src.removingPercentEncoding, withExtension: nil)
    }
}

public final class Image: NSObject, Decodable {
    public var file1x: File
    public var file2x: File
    public var file3x: File
    public var width: Int
    public var height: Int

    private enum CodingKeys: String, CodingKey {
        case file1x
        case file2x
        case file3x
        case width
        case height
    }

    init(
        file1x: File,
        file2x: File,
        file3x: File,
        width: Int,
        height: Int
    ) {
        self.file1x = file1x
        self.file2x = file2x
        self.file3x = file3x
        self.width = width
        self.height = height
    }
}

extension Image: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        try container.update(&file1x, forKey: .file1x)
        try container.update(&file2x, forKey: .file2x)
        try container.update(&file3x, forKey: .file3x)
        width = try container.decode(Int.self, forKey: .width)
        height = try container.decode(Int.self, forKey: .height)
    }
}

extension Image: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

extension Image {
    public var url: URL? {
        return url(forScale: UIScreen.main.scale)
    }
    public var urlAt1x: URL? {
        return file1x.url
    }
    public var urlAt2x: URL? {
        return file2x.url
    }
    public var urlAt3x: URL? {
        return file3x.url
    }
    public var image: UIImage? {
        return image(withScale: UIScreen.main.scale)
    }

    public func url(forScale scale: CGFloat) -> URL? {
        switch round(scale) {
        case 1: return file1x.url
        case 2: return file2x.url
        case 3: return file3x.url
        default: return nil
        }
    }

    public func image(withScale scale: CGFloat) -> UIImage? {
      guard let url = url(forScale: scale) else {
          return nil
      }

      do {
          let data = try Data(contentsOf: url)
          return UIImage(data: data, scale: scale) 
      } catch {
          print("Failed to get image data: \(url) -\(error)")
          return nil
      }
    }
}

public final class SVG: NSObject, Decodable {
    public var src: String

    private enum CodingKeys: String, CodingKey {
        case src
    }

    init(
        src: String
    ) {
        self.src = src
    }
}

extension SVG: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        src = try container.decode(String.self, forKey: .src)
    }
}

extension SVG: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
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

public final class Lottie: NSObject, Decodable {
    public var file: File

    private enum CodingKeys: String, CodingKey {
        case file
    }

    init(
        file: File
    ) {
        self.file = file
    }
}

extension Lottie: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        try container.update(&file, forKey: .file)
    }
}

extension Lottie: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
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
                let data = try Data(contentsOf: url) as CFData

                guard let dataProvider = CGDataProvider(data: data) else {
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

public final class Color: NSObject, Decodable {
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
}

extension Color: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        h = try container.decode(CGFloat.self, forKey: .h)
        s = try container.decode(CGFloat.self, forKey: .s)
        l = try container.decode(CGFloat.self, forKey: .l)
        a = try container.decode(CGFloat.self, forKey: .a)
    }
}

extension Color: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

extension Color {
    public var color: UIColor {
        let brightness = l + s * min(l, 1 - l)
        let saturation = (brightness == 0) ? 0 : 2 - 2 * l / brightness
        return UIColor(hue: h, saturation: saturation, brightness: brightness, alpha: a)
    }
}

public final class TextStyle: NSObject, Decodable {
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
}

extension TextStyle: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        fontName = try container.decode(String.self, forKey: .fontName)
        fontSize = try container.decode(CGFloat.self, forKey: .fontSize)
        try container.update(&color, forKey: .color)
    }
}

extension TextStyle: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
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

public final class Haiku: NSObject, Decodable {
    public var component: String

    private enum CodingKeys: String, CodingKey {
        case component
    }

    init(
        component: String
    ) {
        self.component = component
    }
}

extension Haiku: Updatable {
    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        component = try container.decode(String.self, forKey: .component)
    }
}

extension Haiku: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
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

@objc public final class Bindings: NSObject, StateBag {
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
        image = Image(file1x: File(src: "assets/image%20with%20spaces.jpg"), file2x: File(src: "assets/image%20with%20spaces@2x.jpg"), file3x: File(src: "assets/image%20with%20spaces@3x.jpg"), width: 246, height: 246)
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
}

extension Bindings: Updatable {
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

extension Bindings: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

/// This is only intended to be used by Objective-C consumers. 
/// In Swift use Diez<Bindings>.
@objc(DiezBindings)
public final class DiezBridgedBindings: NSObject {
    @objc public init(view: UIView) {
        diez = Diez(view: view)

        super.init()
    }

    @objc public func attach(_ subscriber: @escaping (Bindings) -> Void) {
        diez.attach(subscriber)
    }

    private let diez: Diez<Bindings>
}

