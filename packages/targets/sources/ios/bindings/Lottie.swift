public class Lottie: NSObject, Decodable, Updatable {
    public var file: File

    init(withFile file: File) {
        self.file = file
        super.init()
    }

    public func update(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        file = try container.decode(File.self, forKey: .file)
    }

    public func view() -> LOTAnimationView? {
        guard let url = file.url else {
            print("unable to load Lottie URL")
            return nil
        }

        // TODO: keep a weak handle to this view and update it on updates.
        let view = LOTAnimationView(contentsOf: url)
        // TODO: configuration "loop".
        view.loopAnimation = true
        // TODO: configuration "autoplay".
        view.play()
        return view
    }

    public func embedLottie(inView parent: UIView) {
        guard let lottieView = view() else {
            return
        }

        lottieView.frame = parent.bounds
        lottieView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        parent.addSubview(lottieView)
    }
}
