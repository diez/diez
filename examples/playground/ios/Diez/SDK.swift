import Foundation
import WebKit
import UIKit
import Lottie
import UIKit.UIView

public typealias Method = (String, Any?) -> Void

public protocol StateBag : Decodable, Updatable {
    init(_ listener: Method?)
    static var name: String { get }
}

public class Diez<T>: NSObject, WKScriptMessageHandler where T : StateBag {
    public private(set) var component: T
    private let decoder = JSONDecoder()
    private var subscribers: [(T) -> Void] = []
    private let wk: WKWebView

    override public init() {
        let wkIn = WKWebView(frame: .zero)
        let componentIn = T({(_ eventName: String, payload: Any?) in
            wkIn.evaluateJavaScript("trigger('\(eventName)')")
        })
        wk = wkIn
        component = componentIn
        super.init()
    }

    public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        do {
            switch (message.name) {
            case "patch":
                if let body = message.body as? String {
                    try decoder.update(&component, from: Data(body.utf8))
                    broadcast()
                }
                break
            default:
                print("unknown message: " + message.name)
            }
        } catch { print(error) }
    }

    public func attach(_ parent: UIViewController, subscriber: @escaping (T) -> Void) {
        // Initially execute a synchronous call on our subscriber.
        subscriber(component)
        wk.configuration.userContentController.add(self, name: "patch")
        if (environment.isDevelopment) {
            let url = URL(string: "\(environment.serverUrl)/components/\(T.name)")!
            wk.load(URLRequest(url: url))
        } else if let url  = Bundle.main.url(forResource: "index", withExtension: "html") {
            wk.load(URLRequest(url: url))
        }
        parent.view.addSubview(wk)
        subscribe(subscriber)
        let displayLink = CADisplayLink(target: self, selector: #selector(tick))
        displayLink.add(to: .current, forMode: .common)
    }

    public func subscribe(_ subscriber: @escaping (T) -> Void) {
        subscribers.append(subscriber)
    }

    private func broadcast() {
        for subscriber in subscribers {
            subscriber(component)
        }
    }

    @objc private func tick() {
        wk.evaluateJavaScript("tick(\(CACurrentMediaTime() * 1000))")
    }
}

public class Environment: NSObject {
    fileprivate var infoDict: NSDictionary {
        get {
            if let path = Bundle(for: type(of: self)).path(forResource: "Diez", ofType: "plist") {
              return NSDictionary(contentsOfFile: path)!
            }

            fatalError("Configuration not found")
        }
    }

    var isDevelopment: Bool {
        get {
            return infoDict["IS_DEVELOPMENT"] as! Bool
        }
    }

    var serverUrl: String {
        get {
            return infoDict["SERVER_URL"] as! String
        }
    }
}

// Global singleton.
let environment = Environment()

// All credit to: https://stablekernel.com/understanding-extending-swift-4-codable/

public protocol Updatable {
    mutating func update(from decoder: Decoder) throws
}

protocol DecodingFormat {
    func decoder(for data: Data) -> Decoder
}

extension DecodingFormat {
    func decode<T: Decodable>(_ type: T.Type, from data: Data) throws -> T {
        return try T.init(from: decoder(for: data))
    }
}

struct DecoderExtractor: Decodable {
    let decoder: Decoder

    init(from decoder: Decoder) throws {
        self.decoder = decoder
    }
}

extension JSONDecoder: DecodingFormat {
    func decoder(for data: Data) -> Decoder {
        // Can try! here because DecoderExtractor's init(from: Decoder) never throws
        return try! decode(DecoderExtractor.self, from: data).decoder
    }
}

extension PropertyListDecoder: DecodingFormat {
    func decoder(for data: Data) -> Decoder {
        // Can try! here because DecoderExtractor's init(from: Decoder) never throws
        return try! decode(DecoderExtractor.self, from: data).decoder
    }
}

extension DecodingFormat {
    func update<T: Updatable>(_ value: inout T, from data: Data) throws {
        try value.update(from: decoder(for: data))
    }
}

class NestedSingleValueDecodingContainer<Key: CodingKey>: SingleValueDecodingContainer {
    let container: KeyedDecodingContainer<Key>
    let key: Key
    var codingPath: [CodingKey] {
        return container.codingPath
    }

    init(container: KeyedDecodingContainer<Key>, key: Key) {
        self.container = container
        self.key = key
    }

    func decode(_ type: Bool.Type) throws -> Bool {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Int.Type) throws -> Int {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Int8.Type) throws -> Int8 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Int16.Type) throws -> Int16 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Int32.Type) throws -> Int32 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Int64.Type) throws -> Int64 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: UInt.Type) throws -> UInt {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: UInt8.Type) throws -> UInt8 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: UInt16.Type) throws -> UInt16 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: UInt32.Type) throws -> UInt32 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: UInt64.Type) throws -> UInt64 {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Float.Type) throws -> Float {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: Double.Type) throws -> Double {
        return try container.decode(type, forKey: key)
    }

    func decode(_ type: String.Type) throws -> String {
        return try container.decode(type, forKey: key)
    }

    func decode<T>(_ type: T.Type) throws -> T where T : Decodable {
        return try container.decode(type, forKey: key)
    }

    func decodeNil() -> Bool {
        return (try? container.decodeNil(forKey: key)) ?? false
    }
}

class NestedDecoder<Key: CodingKey>: Decoder {
    let container: KeyedDecodingContainer<Key>
    let key: Key

    init(from container: KeyedDecodingContainer<Key>, key: Key, userInfo: [CodingUserInfoKey : Any] = [:]) {
        self.container = container
        self.key = key
        self.userInfo = userInfo
    }

    var userInfo: [CodingUserInfoKey : Any]

    var codingPath: [CodingKey] {
        return container.codingPath
    }

    func container<Key>(keyedBy type: Key.Type) throws -> KeyedDecodingContainer<Key> where Key : CodingKey {
        return try container.nestedContainer(keyedBy: type, forKey: key)
    }

    func unkeyedContainer() throws -> UnkeyedDecodingContainer {
        return try container.nestedUnkeyedContainer(forKey: key)
    }

    func singleValueContainer() throws -> SingleValueDecodingContainer {
        return NestedSingleValueDecodingContainer(container: container, key: key)
    }
}

extension KeyedDecodingContainer {
    public func update<T: Updatable>(_ value: inout T, forKey key: Key, userInfo: [CodingUserInfoKey : Any] = [:]) throws {
        let nestedDecoder = NestedDecoder(from: self, key: key, userInfo: userInfo)
        try value.update(from: nestedDecoder)
    }
}

final public class Color : UIColor {}

extension Color : Decodable {
    public convenience init(hue: CGFloat, hslSaturation: CGFloat, lightness: CGFloat, alpha: CGFloat) {
        let brightness = lightness + hslSaturation * min(lightness, 1 - lightness)
        let saturation = (brightness == 0) ? 0 : 2 - 2 * lightness / brightness
        self.init(hue: hue, saturation: saturation, brightness: brightness, alpha: alpha)
    }

    public convenience init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let result = try container.decode([CGFloat].self)
        self.init(hue: result[0], hslSaturation: result[1], lightness: result[2], alpha: result[3])
    }
}

public final class MyPalette : NSObject, StateBag {
    var listener: Method? = nil
    public var hello: Color

    private enum CodingKeys: String, CodingKey {
        case hello
    }

    public init(_ listenerIn: Method?) {
        listener = listenerIn
        hello = Color(hue: 0, hslSaturation: 1, lightness: 0.5, alpha: 1)
    }

    public static let name = "MyPalette"

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        hello = try container.decode(Color.self, forKey: .hello)
    }
}

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

    private func image() throws -> UIImage? {
        guard let url = file.url() else {
            return nil
        }

        return UIImage(data: try Data(contentsOf: url), scale: scale)
    }

    private func imageView() throws -> UIImageView? {
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

public class File : NSObject, Codable {
    var src: String

    private func fullyQualifiedUrl() -> String {
        // TODO: when we are not in development, we should load the file from a local bundle URL.
        // This will look something like: Bundle.main.url(forResource: "index", withExtension: "html")
        // except we will be loading from the framework bundle (not main). Probably this should be handled
        // inside class Environment {...}.
        return environment.isDevelopment
            ? "\(environment.serverUrl)\(src)"
            : "TODO"
    }

    public init(withSrc src: String) {
        self.src = src
        super.init()
    }

    public func url() -> URL? {
        return URL(string: fullyQualifiedUrl())
    }

    public func request() -> URLRequest? {
        guard let url = url() else {
            return nil
        }

        return URLRequest(url: url)
    }
}

public class SVG : NSObject, Decodable, Updatable {
    var file: File

    init(withFile file: File) {
        self.file = file
        super.init()
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        file = try container.decode(File.self, forKey: .file)
    }

    public func embedSvg(inView view: UIView) {
        guard let request = file.request() else {
            print("unable to load SVG URL")
            return
        }

        // TODO: keep a weak handle to this webview and update it on updates.
        // TODO: implement a SVGView metaclass.
        let wk = WKWebView(frame: view.bounds)
        wk.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        wk.scrollView.isScrollEnabled = false
        wk.isOpaque = false
        wk.backgroundColor = .clear
        wk.load(request)
        view.addSubview(wk)
    }
}

public class Lottie : NSObject, Decodable, Updatable {
    var file: File

    init(withFile file: File) {
        self.file = file
        super.init()
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        file = try container.decode(File.self, forKey: .file)
    }

    public func view() -> LOTAnimationView? {
        guard let url = file.url() else {
            print("unable to load Lottie URL")
            return nil
        }

        // TODO: keep a weak handle to this view and update it on updates.
        let view = LOTAnimationView(contentsOf: url)
        // TODO: configuration "loop".
        view.loopAnimation = true
        // TODO: configuration "autoplay".
        view.play()
        return view
    }

    public func embedLottie(inView parent: UIView) {
        guard let lottieView = view() else {
            return
        }

        lottieView.frame = parent.bounds
        lottieView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        parent.addSubview(lottieView)
    }
}

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

fileprivate let fallbackFont = "Helvetica"

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

import UIKit.UIView
import WebKit

// TODO: this should also be updatable.
// TODO: this should also accept options.
public class Haiku : NSObject, Decodable, Updatable {
    var component: String

    init(withComponent component: String) {
        self.component = component
    }

    private func file() -> File {
      return File(withSrc: "/haiku/\(component)")
    }

    private enum CodingKeys: String, CodingKey {
        case component
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        component = try container.decode(String.self, forKey: .component)
    }

    public func embedHaiku(inView view: UIView) {
        guard let request = file().request() else {
            print("unable to load Haiku URL")
            return
        }

        // TODO: keep a weak handle to this webview and update it on updates.
        // TODO: implement a HaikuView metaclass.
        let wk = WKWebView(frame: view.bounds)
        wk.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        wk.scrollView.isScrollEnabled = false
        wk.isOpaque = false
        wk.backgroundColor = .clear
        wk.load(request)
        view.addSubview(wk)
    }
}

public final class MyStateBag : NSObject, StateBag {
    var listener: Method? = nil
    public var palette: MyPalette
    public var copy: String
    public var image: Image
    public var svg: SVG
    public var lottie: Lottie
    public var fontRegistry: FontRegistry
    public var textStyle: TextStyle
    public var haiku: Haiku

    private enum CodingKeys: String, CodingKey {
        case palette
        case copy
        case image
        case svg
        case lottie
        case fontRegistry
        case textStyle
        case haiku
    }

    public init(_ listenerIn: Method?) {
        listener = listenerIn
        palette = MyPalette(listener)
        copy = "Hello Diez"
        image = Image(withFile: File(withSrc: "/assets/images/haiku.jpg"), withWidth: 246, withHeight: 246, withScale: 3)
        svg = SVG(withFile: File(withSrc: "/assets/images/rat.svg"))
        lottie = Lottie(withFile: File(withSrc: "/assets/lottie/loading-pizza.json"))
        fontRegistry = FontRegistry(withFiles: [
            File(withSrc: "/assets/fonts/Roboto-Black.ttf"),
            File(withSrc: "/assets/fonts/Roboto-BlackItalic.ttf"),
            File(withSrc: "/assets/fonts/Roboto-Bold.ttf"),
            File(withSrc: "/assets/fonts/Roboto-BoldItalic.ttf"),
            File(withSrc: "/assets/fonts/Roboto-Italic.ttf"),
            File(withSrc: "/assets/fonts/Roboto-Light.ttf"),
            File(withSrc: "/assets/fonts/Roboto-LightItalic.ttf"),
            File(withSrc: "/assets/fonts/Roboto-Medium.ttf"),
            File(withSrc: "/assets/fonts/Roboto-MediumItalic.ttf"),
            File(withSrc: "/assets/fonts/Roboto-Regular.ttf"),
            File(withSrc: "/assets/fonts/Roboto-Thin.ttf"),
            File(withSrc: "/assets/fonts/Roboto-ThinItalic.ttf"),
        ])
        textStyle = TextStyle(withFont: "Helvetica", withFontSize: 50, withColor: Color(hue: 0, hslSaturation: 1, lightness: 0.5, alpha: 1))
        haiku = Haiku(withComponent: "@haiku/taylor-testthang")
    }

    public static let name = "MyStateBag"

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        try? container.update(&palette, forKey: .palette)
        copy = try container.decode(String.self, forKey: .copy)
        try? container.update(&image, forKey: .image)
        try? container.update(&svg, forKey: .svg)
        try? container.update(&lottie, forKey: .lottie)
        try? container.update(&fontRegistry, forKey: .fontRegistry)
        try? container.update(&textStyle, forKey: .textStyle)
        try? container.update(&haiku, forKey: .haiku)
    }
}

