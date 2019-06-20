import Foundation

extension File {
    /**
     - Tag: File.url

     The `URL` of the resource the file is referencing.

     When in [hot mode](x-source-tag://Diez), this will be a `URL` to resource on the Diez server.

     When not in [hot mode](x-source-tag://Diez), this will be a `URL` pointing to the resource on the filesystem (within the SDK's asset bundle).

     - Note: This `URL` will only be `nil` if there is an issue parsing the `URL` when in [hot mode](x-source-tag://Diez). This should never be `nil` when not in [hot mode](x-source-tag://Diez).
     */
    public var url: URL? {
        if environment.isHot {
            let relativeURLComponents = URLComponents(string: src)
            return relativeURLComponents?.url(relativeTo: environment.serverURL)
        }

        return Bundle.diezResources?.url(forFile: self)
    }

    /**
     A `URLRequest` to the provided file.

     Uses the [url](x-source-tag://File.url) to create the request.

     - See: [url](x-source-tag://File.url)
     */
    public var request: URLRequest? {
        guard let url = url else {
            return nil
        }

        return URLRequest(url: url)
    }
}
