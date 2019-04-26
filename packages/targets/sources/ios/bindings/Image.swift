extension Image {
    /**
     Calls [url(forScale:)](x-source-tag://Image.urlForScale) with `UIScreen.main.scale`.

     - See: [url(forScale:)](x-source-tag://Image.urlForScale)
     */ 
    public var url: URL? {
        return url(forScale: UIScreen.main.scale)
    }

    /**
     The `URL` of the @1x image asset.

     The value may be `nil` if:
       - The @1x image asset does not exist
       - The `URL` failed to resolve
     */
    public var urlAt1x: URL? {
        return file1x.url
    }

    /**
     The `URL` of the @2x image asset.

     The value may be `nil` if:
       - The @2x image asset does not exist
       - The `URL` failed to resolve
     */
    public var urlAt2x: URL? {
        return file2x.url
    }

    /**
     The `URL` of the @3x image asset.

     The value may be `nil` if:
       - The @3x image asset does not exist
       - The `URL` failed to resolve
     */
    public var urlAt3x: URL? {
        return file3x.url
    }

    /**
     Calls [image(withScale:)](x-source-tag://Image.imageWithScale) with `UIScreen.main.scale`.

     - See: [image(withScale:)](x-source-tag://Image.imageWithScale)
     */
    public var image: UIImage? {
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
