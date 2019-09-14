import Foundation

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
