extension SVG {
    public var url: URL? {
        return file.url
    }

    var file: File {
      return File(src: "\(src).html")
    }
}
