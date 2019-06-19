import Foundation
import UIKit
import Lottie

extension Bundle {
    static let diezResources = Bundle(url: Bundle.diez.resourceURL!.appendingPathComponent("Static.bundle"))
}

@objc(DEZFile)
public final class File: NSObject, Decodable {
    @objc public internal(set) var src: String
    @objc public internal(set) var type: String

    init(
        src: String,
        type: String
    ) {
        self.src = src
        self.type = type
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

     When in [hot mode](x-source-tag://Diez), this will be a `URL` to resource on the Diez server.

     When not in [hot mode](x-source-tag://Diez), this will be a `URL` pointing to the resource on the filesystem (within the SDK's asset bundle).

     - Note: This `URL` will only be `nil` if there is an issue parsing the `URL` when in [hot mode](x-source-tag://Diez). This should never be `nil` when not in [hot mode](x-source-tag://Diez).
     */
    public var url: URL? {
        if environment.isHot {
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

extension Bundle {
    func url(forFile file: File) -> URL? {
        return url(forResource: file.src.removingPercentEncoding, withExtension: nil)
    }
}

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

extension Image {
    /**
     Returns an image inialized with [UIImage(_ image: Image)](x-source-tag://UIImage.init).

     - See [UIImage(_ image: Image)](x-source-tag://UIImage.init)
     */
    @objc 
    public var uiImage: UIImage? {
        return UIImage(self)
    }

    func url(forScale scale: CGFloat) -> URL? {
        switch round(scale) {
        case 1: return file.url
        case 2: return file2x.url
        case 3: return file3x.url
        default: return nil
        }
    }
}

extension UIImage {
    /**
     - Tag: UIImage.init

     Initializes a `UIImage` of the appropriate scale if it exists.

     When in [hot mode](x-source-tag://Diez), synchronously fetches and initializes a `UIImage` at the scale returned by `UIScreen.main.scale` if it exists. If an image URL is not available for the `UIScreen.main.scale`, the 3x asset will attempt to be loaded.

     When not in [hot mode](x-source-tag://Diez), uses `UIImage(named:bundle:compatibleWith:)`.
     */
    public convenience init?(_ image: Image) {
        guard environment.isHot else {
            guard let name = (image.file.src as NSString).deletingPathExtension.removingPercentEncoding else {
                return nil
            }

            self.init(named: name, in: Bundle.diezResources, compatibleWith: nil)
            return
        }
        
        let screenScale = UIScreen.main.scale
        guard let url = image.url(forScale: screenScale) else {
            let maxScale: CGFloat = 3
            guard let url = image.url(forScale: maxScale) else {
                return nil
            }
            
            self.init(url, scale: maxScale)
            return
        }
        
        self.init(url, scale: screenScale)
    }
    
    convenience init?(_ url: URL, scale: CGFloat) {
        guard let data = try? Data(contentsOf: url) else {
            return nil
        }

        self.init(data: data, scale: scale)
    }
}

@objc(DEZLottie)
public final class Lottie: NSObject, Decodable {
    @objc public internal(set) var file: File
    @objc public internal(set) var loop: Bool
    @objc public internal(set) var autoplay: Bool

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
    @objc 
    public var url: URL? {
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

@objc(DEZColor)
public final class Color: NSObject, Decodable {
    @objc public internal(set) var h: CGFloat
    @objc public internal(set) var s: CGFloat
    @objc public internal(set) var l: CGFloat
    @objc public internal(set) var a: CGFloat

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

extension Color: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

extension Color {
    /**
     A `UIColor` representation of the `Color`.
     */
    @objc 
    public var uiColor: UIColor {
        return UIColor(self)
    }
}

extension UIColor {
    /**
     Initializes a `UIColor` from the provided `Color`.
     */
    public convenience init(_ color: Color) {
        let brightness = color.l + color.s * min(color.l, 1 - color.l)
        let saturation = (brightness == 0) ? 0 : 2 - 2 * color.l / brightness
        self.init(hue: color.h, saturation: saturation, brightness: brightness, alpha: color.a)
    }
}

@objc(DEZTypograph)
public final class Typograph: NSObject, Decodable {
    @objc public internal(set) var font: Font
    @objc public internal(set) var fontSize: CGFloat
    @objc public internal(set) var color: Color

    init(
        font: Font,
        fontSize: CGFloat,
        color: Color
    ) {
        self.font = font
        self.fontSize = fontSize
        self.color = color
    }
}

extension Typograph: ReflectedCustomStringConvertible {
    public override var description: String {
        return reflectedDescription
    }
}

private var registeredFonts: Set<String> = []

private func registerFont(_ font: Font) {
    if font.file.src == "" || registeredFonts.contains(font.file.src) {
        return
    }

    registeredFonts.insert(font.file.src)

    guard
        let url = font.file.url,
        let data = try? Data(contentsOf: url) as CFData,
        let dataProvider = CGDataProvider(data: data),
        let cgFont = CGFont(dataProvider) else {
            return
    }

    CTFontManagerRegisterGraphicsFont(cgFont, nil)
}

extension Typograph {
    /**
     The `UIFont` of the `Typograph`.

     This uses the `UIFont(name:size)` initializer and may return nil as a result.
     */
    @objc 
    public var uiFont: UIFont? {
        registerFont(font)

        return UIFont(name: font.name, size: fontSize)
    }
}

extension UILabel {
    /**
     Applies the provided `Typograph` to the receiver.
     */
    @objc(dez_applyTypograph:)
    public func apply(_ typograph: Typograph) {
        font = typograph.uiFont
        textColor = typograph.color.uiColor
    }
}

extension UITextView {
    /**
     Applies the provided `Typograph` to the receiver.
     */
    @objc(dez_applyTypograph:)
    public func apply(_ typograph: Typograph) {
        font = typograph.uiFont
        textColor = typograph.color.uiColor
    }
}

extension UITextField {
    /**
     Applies the provided `Typograph` to the receiver.
     */
    @objc(dez_applyTypograph:)
    public func apply(_ typograph: Typograph) {
        font = typograph.uiFont
        textColor = typograph.color.uiColor
    }
}

@objc(DEZBindings)
public final class Bindings: NSObject, StateBag {
    @objc public internal(set) var image: Image
    @objc public internal(set) var lottie: Lottie
    @objc public internal(set) var typograph: Typograph

    convenience public override init() {
        self.init(
            image: Image(file: File(src: "assets/image%20with%20spaces.jpg", type: "image"), file2x: File(src: "assets/image%20with%20spaces@2x.jpg", type: "image"), file3x: File(src: "assets/image%20with%20spaces@3x.jpg", type: "image"), width: 246, height: 246),
            lottie: Lottie(file: File(src: "assets/lottie.json", type: "raw"), loop: true, autoplay: true),
            typograph: Typograph(font: Font(file: File(src: "assets/SomeFont.ttf", type: "font"), name: "SomeFont"), fontSize: 50, color: Color(h: 0.16666666666666666, s: 1, l: 0.5, a: 1))
        )
    }

    init(
        image: Image,
        lottie: Lottie,
        typograph: Typograph
    ) {
        self.image = image
        self.lottie = lottie
        self.typograph = typograph
    }

    public static let name = "Bindings"
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

     If in [hot mode](x-source-tag://Diez), this closure will also be called whenever changes occur to the
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

