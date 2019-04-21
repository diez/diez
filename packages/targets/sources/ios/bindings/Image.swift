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
