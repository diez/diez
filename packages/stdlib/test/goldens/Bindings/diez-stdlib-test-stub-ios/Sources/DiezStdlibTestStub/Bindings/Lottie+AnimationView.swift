import Foundation
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

extension AnimationView {
    /**
     A closure to be called when loading a `Lottie` animation has completed with a value that represents whether the animation was loaded successfully.
     */
    public typealias LoadCompletion = (Bool) -> Void

    /**
     Loads the provided `Lottie` animation.
     */
    @objc(dez_loadLottie:completion:)
    public func load(_ lottie: Lottie, completion: LoadCompletion? = nil) {
        // TODO: Add a parameter that allows a fade in animated and add a description of the parameter to doc comment.
        // TODO: Should this be synchronous when resource is local?
        guard let url = lottie.url else {
            completion?(false)
            return
        }

        Animation.loadedFrom(url: url, closure: { [weak self] animation in
            guard let self = self else { return }

            guard let animation = animation else {
                completion?(false)
                return
            }

            self.animation = animation
            self.loopMode = lottie.loop ? .loop : .playOnce

            if lottie.autoplay  {
                self.play()
            }

            completion?(true)
        }, animationCache: nil)
    }
}
