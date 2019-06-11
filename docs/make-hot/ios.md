# Hot Mode (iOS)

## Running the server

You can run a hot server by running the following command from your Diez project's root:

```bash
diez hot -t ios
```

> This will generate a file located relative to the current working directory at `.diez/ios-hot-url` that is only present while the server is active that contains a URL that you could use to connect to your server on the local network.

## iOS Project Setup

Hot mode will allow us to see changes to our Diez project in real time. Hot mode is enabled when your application's main bundle's `Info.plist` has the `DiezIsHot` key is set to `true`, and the `DiezServerURL` is populated.

> If you'd like to disable hot mode in release builds, you could [use scheme configurations and custom environment variables to conditionally set this value](https://thoughtbot.com/blog/let-s-setup-your-ios-environments).

> Check out a generated `create-diez-project` for an example of this in action.

If you are attempting to connect to a hot Diez server on your local network, you'll also need to set the `NSAppTransportSecurity` value in your application's main bundle's `Info.plist` value to `true`. You can do this by adding the following to your application's `Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsLocalNetworking</key>
  <true/>
</dict>
```

## iOS Project Integration

You can instantiate an instance of `Diez` in a `UIViewController` subclass by adding it as a property of the `UIViewController` like so:

```swift
private lazy var diez = Diez<{{Component}}>(view: view)
```

> Replace `{{Component}}` with the desired `Component` that is being exported at the root of your Diez project.

> The `UIView` provided to the `Diez` instance on initialization is used to add a visually empty `WKWebView` instance to the view hierarchy so that it can respond to updates from the hot Diez server. This reliance on `WKWebView` and the need to supply a view will be removed in a future version.

You can observe hot updates published by your `Diez<{{Component}}>` instance using a closure that receives a `Result<{{Component}}, AttachError>` type. Your implementation could look like this:

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    diez.attach { [weak self] result in
        switch result {
        case .success(let component):
            // Apply your component to your views here.
        case .failure(let error):
            print(error)
        }
    }
}
```
