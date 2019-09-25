## Integrating a Diez project into an existing iOS application

### Assumptions

- You have an existing iOS application.
- You have an existing Diez project.
- You want to integrate your iOS project with a living source of truth.

### Generating an SDK

```bash
diez compile -t ios <dependency-type>
```

The supported dependency types are:

- `--carthage`: Generates a [Carthage](https://github.com/Carthage/Carthage) supported framework.
- `--cocoapods`: Generates a [CocoaPods](https://github.com/CocoaPods/CocoaPods) supported framework.

<div class="note">
    You can also supply `--carthage --cocoapods` to generate a project that supports both. You can omit them if you'd like to manage the dependency yourself.
</div>
<div class="note">
    <a href="https://github.com/yonaskolb/XcodeGen" target="_blank">XcodeGen</a> is required to be installed for compiling an iOS SDK that uses Carthage, or without dependency support.
</div>

The dependency will be generated in a location relative to the current working directly at `build/diez-<name>-ios`, where `<name>` is the name of your Diez project in [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).

<div class="note"> For more information about creating a new Diez project, see our guide on <router-link to="/getting-started/the-basics">The Basics</router-link>.</div>

### Accessing Components

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

<div class="note"> If you'd like to use hot updates to preview changes in real time, check back soon for a guide on setting up hot updates. In the interim, please ask for help on <a href="https://spectrum.chat/diez" target="_blank">Spectrum</a>.</div
>
