import Lottie

/**
 An error that occurred when attempting to load a `Lottie` object in a `LOTAnimationView`.
 */
public enum LottieError: Error, CustomDebugStringConvertible {
    case invalidURL
    case requestFailed(Error?)
    case deserializationError(Data, Error)
    case invalidType(json: Any)

    public var debugDescription: String {
        switch self {
        case .invalidURL:
            return "Lottie URL is invalid."
        case .requestFailed(let error):
            return "Request failed: \(String(describing: error))"
        case .deserializationError(let data, let error):
            let dataAsString = String(data: data, encoding: String.Encoding.utf8)
            return "Lottie file failed to be deserialized: \(error)\n\(String(describing: dataAsString))"
        case .invalidType(let json):
            return "JSON was not in the correct format ([AnyHashable: Any]): \(json)"
        }
    }
}

extension LOTAnimationView {
    /**
     A closure to be called when loading a `Lottie` animation has completed.
     */
    public typealias LoadCompletion = (Result<Void, LottieError>) -> Void

    /**
     - Tag: LOTAnimationView.loadLottieSessionCompletion

     Loads the provided `Lottie` animation.

     - Parameters:
       - lottie: The `Lottie` animation to be loaded.
       - session: The `URLSession` to be used when fetching the resource.
       - completion: A closure to be called when the load operation has completed.

     - Returns: The `URLSessionDataTask` used to fetch the asset, or `nil` if the
       [Lottie.url](x-source-tag://Lottie.url) is `nil`.
     */
    @discardableResult
    public func load(_ lottie: Lottie, session: URLSession = .shared, completion: LoadCompletion? = nil) -> URLSessionDataTask? {
        // TODO: Add a parameter that allows a fade in animated and add a description of the parameter to doc comment.
        // TODO: Should this be synchronous when resource is local?
        guard let url = lottie.url else {
            completion?(.failure(.invalidURL))
            return nil
        }

        let task = session.dataTask(with: url) { [weak self] (data, response, error) in
            self?.loadWith(data: data, lottie: lottie, response: response, error: error, completion: completion)
        }

        task.resume()

        return task
    }

    private func loadWith(data: Data?, lottie: Lottie, response: URLResponse?, error: Error?, completion: LoadCompletion?) {
        guard let data = data else {
            DispatchQueue.main.async { completion?(.failure(.requestFailed(error))) }
            return
        }

        do {
            let jsonObject = try JSONSerialization.jsonObject(with: data, options: .allowFragments)

            guard let json = jsonObject as? [AnyHashable: Any] else {
                DispatchQueue.main.async { completion?(.failure(.invalidType(json: jsonObject))) }
                return
            }

            DispatchQueue.main.async {
                // TODO: Use bundle for referenced assets?
                self.setAnimation(json: json)

                self.loopAnimation = lottie.loop

                guard lottie.autoplay else {
                    completion?(.success(()))
                    return
                }

                self.play { _ in
                    completion?(.success(()))
                }
            }
        } catch {
            DispatchQueue.main.async { completion?(.failure(.deserializationError(data, error)))}
        }
    }

    /**
     The Objective-C equivalent of load(:session:completion:).

     - See: [load(:session:completion:)](x-source-tag://LOTAnimationView.loadLottieSessionCompletion)
     */
    @available(swift, obsoleted: 0.0.1)
    @discardableResult
    @objc(dez_loadLottie:withSession:completion:)
    public func load(_ lottie: Lottie, session: URLSession = .shared, completion: ((_ success: Bool, _ error: NSError?) -> Void)? = nil) -> URLSessionDataTask? {
        return load(lottie, session: session) { result in
            switch result {
            case .success:
                completion?(true, nil)
            case .failure(let error):
                completion?(false, error as NSError)
            }
        }
    }
}
