# Integrating A Diez Project into an Existing iOS Application

## Assumptions

- You have an existing iOS application.
- You have an existing Diez project.
- You want to integrate your iOS project with a living source of truth.

## Generating an SDK

```bash
diez compile -t ios <dependency-type>
```

The supported dependency types are:

- `--carthage`: Generates a [Carthage](https://github.com/Carthage/Carthage) supported framework.
- `--cocoapods`: Generates a [CocoaPods](https://github.com/CocoaPods/CocoaPods) supported framework.

> You can also supply `--carthage --cocoapods` to generate a project that supports both. You can omit them if you'd like to manage the dependency yourself.
>
> [XcodeGen](https://github.com/yonaskolb/XcodeGen) is required to be installed for compiling an iOS SDK that uses Carthage, or without dependency support.

The dependency will be generated in a location relative to the current working directly at `build/diez-<name>-ios`, where `<name>` is the name of your Diez project in [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).

> For more information about creating a new Diez project, see our guide on [The Basics](TODO:).

## Accessing Components

We can access our Diez project's `Component`s in our application by importing the generated Diez SDK and instantiating the component. For example, assuming a project named `my-project` with an exported component named `DesignSystem`, you could do the following:

```swift
import DiezMyProject

class ViewController: UIViewController {
    func viewDidLoad() {
        super.viewDidLoad()

        let designSystem = DesignSystem()
        // Apply our design tokens to our view here.
    }
}
```

> If you'd like to use hot updates to preview changes in real time, check out our [guide on setting up hot updates](TODO:).

## Interacting with Prefabs

Diez comes packaged with a number of prefabs that you can use to define your [Design Token Components (DTCs)](TODO:). All of the properties defined on these components are available to you along with a number of extensions and helper `UIView` subclasses to make interacting with these components as seamless as possible.

### [Color](TODO:)

#### UIColor Representation

```swift
extension {
    var color: UIColor
}
```

### [Image](TODO:)

#### UIImage Representation

```swift
extension Image {
    var uiImage: UIImage
}
```

### [Lottie](TODO:)

#### Resource URL

```swift
extension Lottie {
    var url: URL?
}
```

#### LOTAnimationView Loader

```swift
extension LOTAnimationView {
    typealias LoadCompletion = (Result<Void, LottieError>) -> Void

    func load(_ lottie: Lottie, session: URLSession = .shared, completion: LoadCompletion? = nil) -> URLSessionDataTask?
}
```

### [Typograph](TODO:)

#### UIFont Representation

```swift
extension Typograph {
    var uiFont: UIFont
}
```

#### UILabel Style Application

```swift
extension UILabel {
    func apply(_ typograph: Typograph)
}
```

#### UITextView Style Application

```swift
extension UITextView {
    func apply(_ typograph: Typograph)
}
```

#### UITextField Style Application

```swift
extension UITextField {
    func apply(_ typograph: Typograph)
}
```
