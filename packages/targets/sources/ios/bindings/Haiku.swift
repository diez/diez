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
      return File(src: "haiku/\(component).html", type: "raw")
    }
}
