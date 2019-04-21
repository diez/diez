// TODO: this should also accept options.
extension Haiku {
    public var url: URL? {
        return file.url
    }

    var file: File {
      return File(src: "haiku/\(component).html")
    }
}
