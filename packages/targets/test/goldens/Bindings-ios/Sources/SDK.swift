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
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
        try container.update(value: &src, forKey: .src)
    }
}

extension File: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

extension File {
    /**
     - Tag: File.url

     The `URL` of the resource the file is referencing.

     When in [development mode](x-source-tag://Diez), this will be a `URL` to resource on the Diez server.

     When not in [development mode](x-source-tag://Diez), this will be a `URL` pointing to the resource on the
     filesystem (within the SDK's asset bundle).

     - Note: This `URL` will only be `nil` if there is an issue parsing the `URL` when in 
       [development mode](x-source-tag://Diez). This should never be `nil` when not in 
       [development mode](x-source-tag://Diez).
     */
    public var url: URL? {
        if environment.isDevelopment {
            let relativeURLComponents = URLComponents(string: src)
            return relativeURLComponents?.url(relativeTo: environment.serverURL)
        }

        return Bundle.diezResources?.url(forFile: self)
    }

    /**
     A `URLRequest` to the provided file.

     Uses the [url](x-source-tag://File.url) to create the request.

     - See: [url](x-source-tag://File.url) 
     */
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

@objc(DEZImage)
public final class Image: NSObject, Decodable {
    @objc public var file1x: File
    @objc public var file2x: File
    @objc public var file3x: File
    @objc public var width: Int
    @objc public var height: Int

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
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
        try container.update(updatable: &file1x, forKey: .file1x)
        try container.update(updatable: &file2x, forKey: .file2x)
        try container.update(updatable: &file3x, forKey: .file3x)
        try container.update(value: &width, forKey: .width)
        try container.update(value: &height, forKey: .height)
    }
}

extension Image: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

extension Image {
    /**
     Calls [url(forScale:)](x-source-tag://Image.urlForScale) with `UIScreen.main.scale`.

     - See: [url(forScale:)](x-source-tag://Image.urlForScale)
     */ 
    @objc public var url: URL? {
        return url(forScale: UIScreen.main.scale)
    }

    /**
     The `URL` of the @1x image asset.

     The value may be `nil` if:
       - The @1x image asset does not exist
       - The `URL` failed to resolve
     */
    @objc public var urlAt1x: URL? {
        return file1x.url
    }

    /**
     The `URL` of the @2x image asset.

     The value may be `nil` if:
       - The @2x image asset does not exist
       - The `URL` failed to resolve
     */
    @objc public var urlAt2x: URL? {
        return file2x.url
    }

    /**
     The `URL` of the @3x image asset.

     The value may be `nil` if:
       - The @3x image asset does not exist
       - The `URL` failed to resolve
     */
    @objc public var urlAt3x: URL? {
        return file3x.url
    }

    /**
     Calls [image(withScale:)](x-source-tag://Image.imageWithScale) with `UIScreen.main.scale`.

     - See: [image(withScale:)](x-source-tag://Image.imageWithScale)
     */
    @objc public var image: UIImage? {
        return image(withScale: UIScreen.main.scale)
    }

    /**
     - Tag: Image.urlForScale

     Gets a `URL` to the provided `scale`.

     The returned `URL` will only be `nil` if:
       - The provided scale does not round to 1, 2, or 3
       - The `URL` for the image at the provided scale does not exist
       - Diez is in [development mode](x-source-tag://Diez) and the `URL` failed to resolve

     - Parameter scale: The scale of the image to request which is rounded to the nearest `Int` value before resolving
       the `URL`. This typically corresponds to the `UIScreen.main.scale`.

     - Returns: The `URL` of the image at the provided scale, or nil.
     */ 
    @objc(urlForScale:)
    public func url(forScale scale: CGFloat) -> URL? {
        switch round(scale) {
        case 1: return file1x.url
        case 2: return file2x.url
        case 3: return file3x.url
        default: return nil
        }
    }


    /**
     - Tag Image.imageWithScale

     Gets an appropriately scaled `UIImage` if it exists.

     - Note: This operation is performed synchronously using the [url(forScale:)](x-source-tag://Image.urlForScale) and
       will block the thread while the image is fetched. This should only be an issue in 
       [development mode](x-source-tag://Diez) when the image may not be resolved from the SDK's bundle.

     - See: [url(forScale:)](x-source-tag://Image.urlForScale)
     */
    @objc(imageForScale:)
    public func image(withScale scale: CGFloat) -> UIImage? {
        guard
            let url = url(forScale: scale),
            let data = try? Data(contentsOf: url) else {
                return nil
        }

        return UIImage(data: data, scale: scale)
    }
}

@objc(DEZSVG)
public final class SVG: NSObject, Decodable {
    @objc public var src: String

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
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
        try container.update(value: &src, forKey: .src)
    }
}

extension SVG: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

extension SVG {
    /**
     The `URL` of the resource, or `nil` if it could not be parsed.

     - See: [File.url](x-source-tag://File.url)
     */
    @objc public var url: URL? {
        return file.url
    }

    var file: File {
      return File(src: "\(src).html")
    }
}

/**
 A view responsible for rendering an SVG.
 */
@objc(DEZSVGView)
public final class SVGView: UIView {
    public override init(frame: CGRect) {
        super.init(frame: frame)

        setup()
    }

    public required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)

        setup()
    }


    /**
     Loads the provided `SVG`.
     */
    @objc(loadSVG:)
    public func load(_ svg: SVG) {
        // TODO: Add a parameter that allows a fade in animated and add a description of the parameter to doc comment.
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

@objc(DEZLottie)
public final class Lottie: NSObject, Decodable {
    @objc public var file: File
    @objc public var loop: Bool
    @objc public var autoplay: Bool

    private enum CodingKeys: String, CodingKey {
        case file
        case loop
        case autoplay
    }

    init(
        file: File,
        loop: Bool,
        autoplay: Bool
    ) {
        self.file = file
        self.loop = loop
        self.autoplay = autoplay
    }
}

extension Lottie: Updatable {
    public func update(from decoder: Decoder) throws {
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
        try container.update(updatable: &file, forKey: .file)
        try container.update(value: &loop, forKey: .loop)
        try container.update(value: &autoplay, forKey: .autoplay)
    }
}

extension Lottie: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

extension Lottie {
    /**
     - Tag: Lottie.url
     
     The `URL` of the resource, or `nil` if it could not be parsed.

     - See: [File.url](x-source-tag://File.url)
     */
    @objc public var url: URL? {
        return file.url
    }
}

/**
 An error that occurred when attempting to load a `Lottie` object in a `LOTAnimationView`.
 */
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
    /**
     A closure to be called when loading a `Lottie` animation has completed.
     */
    public typealias LoadCompletion = (Result<Void, LottieError>) -> Void

    /**
     - Tag: LOTAnimationView.loadLottieSessionCompletion

     Loads the provided `Lottie` animation.

     - Parameters:
       - lottie: The `Lottie` animation to be loaded.
       - session: The `URLSession` to be used when fetching the resource.
       - completion: A closure to be called when the load operation has completed.

     - Returns: The `URLSessionDataTask` used to fetch the asset, or `nil` if the 
       [Lottie.url](x-source-tag://Lottie.url) is `nil`.
     */
    @discardableResult
    public func load(_ lottie: Lottie, session: URLSession = .shared, completion: LoadCompletion? = nil) -> URLSessionDataTask? {
        // TODO: Add a parameter that allows a fade in animated and add a description of the parameter to doc comment.
        // TODO: Should this be synchronous when resource is local?
        guard let url = lottie.url else {
            completion?(.failure(.invalidURL))
            return nil
        }

        let task = session.dataTask(with: url) { [weak self] (data, response, error) in
            self?.loadWith(data: data, lottie: lottie, response: response, error: error, completion: completion)
        }

        task.resume()

        return task
    }

    private func loadWith(data: Data?, lottie: Lottie, response: URLResponse?, error: Error?, completion: LoadCompletion?) {
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

                self.loopAnimation = lottie.loop

                guard lottie.autoplay else {
                    completion?(.success(()))
                    return
                }

                self.play { _ in
                    completion?(.success(()))
                }
            }
        } catch {
            DispatchQueue.main.async { completion?(.failure(.deserializationError(data, error)))}
        }
    }

    /**
     The Objective-C equivalent of load(:session:completion:).

     - See: [load(:session:completion:)](x-source-tag://LOTAnimationView.loadLottieSessionCompletion)
     */
    @available(swift, obsoleted: 0.0.1)
    @discardableResult
    @objc(dez_loadLottie:withSession:completion:)
    public func load(_ lottie: Lottie, session: URLSession = .shared, completion: ((_ success: Bool, _ error: NSError?) -> Void)? = nil) -> URLSessionDataTask? {
        return load(lottie, session: session) { result in
            switch result {
            case .success:
                completion?(true, nil)
            case .failure(let error):
                completion?(false, error as NSError)
            }
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

            guard
                let url = file.url,
                let data = try? Data(contentsOf: url) as CFData,
                let dataProvider = CGDataProvider(data: data),
                let cgFont = CGFont(dataProvider) else {
                    return
            }

            CTFontManagerRegisterGraphicsFont(cgFont, nil)
        }
    }
}

extension FontRegistry: Updatable {
    public func update(from decoder: Decoder) throws {
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
        try container.update(value: &files, forKey: .files)
        // TODO: diff files, only register the new ones
        self.registerFonts(with: files)
    }
}

@objc(DEZColor)
public final class Color: NSObject, Decodable {
    @objc public var h: CGFloat
    @objc public var s: CGFloat
    @objc public var l: CGFloat
    @objc public var a: CGFloat

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
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
        try container.update(value: &h, forKey: .h)
        try container.update(value: &s, forKey: .s)
        try container.update(value: &l, forKey: .l)
        try container.update(value: &a, forKey: .a)
    }
}

extension Color: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

extension Color {
    /**
     A `UIColor` representation of the color.
     */
    @objc public var color: UIColor {
        let brightness = l + s * min(l, 1 - l)
        let saturation = (brightness == 0) ? 0 : 2 - 2 * l / brightness
        return UIColor(hue: h, saturation: saturation, brightness: brightness, alpha: a)
    }
}

@objc(DEZTextStyle)
public final class TextStyle: NSObject, Decodable {
    @objc public var fontName: String
    @objc public var fontSize: CGFloat
    @objc public var color: Color

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
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
        try container.update(value: &fontName, forKey: .fontName)
        try container.update(value: &fontSize, forKey: .fontSize)
        try container.update(updatable: &color, forKey: .color)
    }
}

extension TextStyle: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

extension TextStyle {
    /**
     The `UIFont` of the `TextStyle`.

     - Note: If the font fails to load this will fallback to the `UIFont.systemFont(ofSize:)`.
     */
    @objc public var font: UIFont {
        guard let font = UIFont(name: fontName, size: fontSize) else {
            // TODO: Should this instead return nil? Update doc comment if this changes.
            return UIFont.systemFont(ofSize: fontSize)
        }

        return font
    }
}

public extension UILabel {
    @objc(dez_applyTextStyle:)
    func apply(_ textStyle: TextStyle) {
        font = textStyle.font
        textColor = textStyle.color.color
    }
}

public extension UITextView {
    @objc(dez_applyTextStyle:)
    func apply(_ textStyle: TextStyle) {
        font = textStyle.font
        textColor = textStyle.color.color
    }
}

public extension UITextField {
    @objc(dez_applyTextStyle:)
    func apply(_ textStyle: TextStyle) {
        font = textStyle.font
        textColor = textStyle.color.color
    }
}

@objc(DEZHaiku)
public final class Haiku: NSObject, Decodable {
    @objc public var component: String
    @objc public var loop: Bool
    @objc public var autoplay: Bool

    private enum CodingKeys: String, CodingKey {
        case component
        case loop
        case autoplay
    }

    init(
        component: String,
        loop: Bool,
        autoplay: Bool
    ) {
        self.component = component
        self.loop = loop
        self.autoplay = autoplay
    }
}

extension Haiku: Updatable {
    public func update(from decoder: Decoder) throws {
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
        try container.update(value: &component, forKey: .component)
        try container.update(value: &loop, forKey: .loop)
        try container.update(value: &autoplay, forKey: .autoplay)
    }
}

extension Haiku: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

// TODO: this should also accept options.
extension Haiku {
    /**
     The `URL` of the resource, or `nil` if it could not be parsed.

     - See: [File.url](x-source-tag://File.url)
     */
    @objc public var url: URL? {
        return file.url
    }

    var file: File {
      return File(src: "haiku/\(component).html")
    }
}

/**
 A view responsible for rendering a Haiku animation.
 */
@objc(DEZHaikuView)
public final class HaikuView: UIView {
    public override init(frame: CGRect) {
        super.init(frame: frame)

        setup()
    }

    public required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)

        setup()
    }

    /**
     Loads the provided `Haiku`.
     */
    @objc(loadHaiku:)
    public func load(_ haiku: Haiku) {
        // TODO: Add a parameter that allows a fade in animated and add a description of the parameter to doc comment.
        guard let request = haiku.file.request else {
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

@objc(DEZBindings)
public final class Bindings: NSObject, StateBag {
    @objc public var image: Image
    @objc public var svg: SVG
    @objc public var lottie: Lottie
    @objc public var fontRegistry: FontRegistry
    @objc public var textStyle: TextStyle
    @objc public var haiku: Haiku

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
        lottie = Lottie(file: File(src: "assets/lottie.json"), loop: true, autoplay: true)
        fontRegistry = FontRegistry(files: [File(src: "assets/SomeFont.ttf")])
        textStyle = TextStyle(fontName: "Helvetica", fontSize: 50, color: Color(h: 0.16666666666666666, s: 1, l: 0.5, a: 1))
        haiku = Haiku(component: "haiku-component", loop: true, autoplay: true)
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
        guard let container = try decoder.containerIfPresent(keyedBy: CodingKeys.self) else { return }
        try container.update(updatable: &image, forKey: .image)
        try container.update(updatable: &svg, forKey: .svg)
        try container.update(updatable: &lottie, forKey: .lottie)
        try container.update(updatable: &fontRegistry, forKey: .fontRegistry)
        try container.update(updatable: &textStyle, forKey: .textStyle)
        try container.update(updatable: &haiku, forKey: .haiku)
    }
}

extension Bindings: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

/// This is only intended to be used by Objective-C consumers. 
/// In Swift use Diez<Bindings>.
@available(swift, obsoleted: 0.0.1)
@objc(DEZDiezBindings)
public final class DiezBridgedBindings: NSObject {
    @objc public init(view: UIView) {
        diez = Diez(view: view)

        super.init()
    }

    /**
     Registers the provided block for updates to the Bindings.

     The provided closure is called synchronously when this function is called.
     
     If in [development mode](x-source-tag://Diez), this closure will also be called whenever changes occur to the
     component.

     - Parameter subscriber: The block to be called when the component updates.
     */
    @objc public func attach(_ subscriber: @escaping (Bindings?, NSError?) -> Void) {
        diez.attach { result in
            switch result {
            case .success(let component):
                subscriber(component, nil)
            case .failure(let error):
                subscriber(nil, error.asNSError)
            }
        }
    }

    private let diez: Diez<Bindings>
}

