extension Image {
    /**
     An `UIImage` of the appropriate scale if it exits.

     When in [hot mode](x-source-tag://Diez), synchronously fetches and returns a `UIImage` at the scale returned by
     `UIScreen.main.scale`.

     When not in [hot mode](x-source-tag://Diez), uses `UIImage(named:bundle:compatibleWith:)`.
     */
    @objc public var uiImage: UIImage? {
        if environment.isHot {
            guard let hotImage = uiImage(forScale: UIScreen.main.scale) else {
                return uiImage(forScale: 3)
            }

            return hotImage
        }

        guard let name = (file.src as NSString).deletingPathExtension.removingPercentEncoding else {
            return nil
        }

        return UIImage(named: name, in: Bundle.diezResources, compatibleWith: nil)
    }

    /**
     - Tag: Image.urlForScale

     Gets a `URL` to the provided `scale`.

     The returned `URL` will only be `nil` if:
       - The provided scale does not round to 1, 2, or 3
       - The `URL` for the image at the provided scale does not exist
       - Diez is in [hot mode](x-source-tag://Diez) and the `URL` failed to resolve

     - Parameter scale: The scale of the image to request which is rounded to the nearest `Int` value before resolving
       the `URL`. This typically corresponds to the `UIScreen.main.scale`.

     - Returns: The `URL` of the image at the provided scale, or nil.
     */
    private func url(forScale scale: CGFloat) -> URL? {
        switch round(scale) {
        case 1: return file.url
        case 2: return file2x.url
        case 3: return file3x.url
        default: return nil
        }
    }


    /**
     Gets an appropriately scaled `UIImage` if it exists.

     - Note: This operation is performed synchronously using the [url(forScale:)](x-source-tag://Image.urlForScale) and
       will block the thread while the image is fetched. This should only be an issue in
       [hot mode](x-source-tag://Diez) when the image may not be resolved from the SDK's bundle.

     - See: [url(forScale:)](x-source-tag://Image.urlForScale)
     */
    private func uiImage(forScale scale: CGFloat) -> UIImage? {
        guard
            let url = url(forScale: scale),
            let data = try? Data(contentsOf: url) else {
                return nil
        }

        return UIImage(data: data, scale: scale)
    }
}
