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
