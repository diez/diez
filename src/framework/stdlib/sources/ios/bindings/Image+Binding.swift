import UIKit

extension Image {
    /**
     Returns an image inialized with [UIImage(image: Image)](x-source-tag://UIImage.init).

     - See [UIImage(image: Image)](x-source-tag://UIImage.init)
     */
    @objc
    public var uiImage: UIImage? {
        return UIImage(image: self)
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
    @objc(dez_initWithDEZImage:)
    public convenience init?(image: Image) {
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

            self.init(url: url, scale: maxScale)
            return
        }

        self.init(url: url, scale: screenScale)
    }

    /**
     - See [UIImage(image: Image)](x-source-tag://UIImage.init)
      */
    @objc(dez_imageWithDEZImage:)
    public static func from(image: Image) -> UIImage? {
        return UIImage(image: image)
    }

    convenience init?(url: URL, scale: CGFloat) {
        guard let data = try? Data(contentsOf: url) else {
            return nil
        }

        self.init(data: data, scale: scale)
    }
}
