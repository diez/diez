# `@livedesigner/compiler`

The compiler for Diez components.

## Usage

In its current form, the compiler only provides a dev server which can be be started with `yarn serve`.

It reads the component specified in [playground/MyStateBag.ts](playground/MyStateBag.ts) and expects the sample native bindings in the `playground/` directory to be registered in a corresponding native project.

## Requirements (macOS)
 - Xcode >= version 10.1 and Android Studio >= version 3.3.1. See [IDE setup instructions](../../docs/ide-setup-macos.md) for details.
 - For fast incremental native builds, you'll need to get Bazel. (TODO: manage Bazel setup and installation via the CLI.) See binary installer instructions [here](https://docs.bazel.build/versions/master/install-os-x.html#install-with-installer-mac-os-x). Make sure to run the installer with the `--user` flag and add `export PATH="$PATH:$HOME/bin"` in your `~/.bash_profile`.

### Running the demo adapter project for iOS (macOS)

 - Build the Diez package with Bazel by running `./fire.sh` in `playground/ios/Diez/`. This should create an (untracked) `Diez.framework` container in `playground/ios/Diez/`.
 - Run the `HelloMyStateBag` project.
   - Open the XCode workspace at [playground/ios/HelloMyStateBag/HelloMyStateBag.xcworkspace](playground/ios/HelloMyStateBag/HelloMyStateBag.xcworkspace).
   - Confirm the app builds against your locally built `Diez.framework`.
   - Start the dev server in this package with `yarn serve` in Terminal.
   - Run `HelloMyStateBag` in an available simulator with `Cmd + R` in Xcode.
 - To run on a device:
   - In `System Preferences` > `Sharing`, note your local hostname, e.g. `http://my-local-hostname.local`, printed at the top of this settings panel. Make sure your device is on the same Wifi network as your development machine.
   - **In the Diez project**, modify `Info.plist` to set `SERVER_URL` to your local hostname at port 8081, e.g. `http://my-local-hostname.local:8081`. Rebuild the framework with `Cmd + B`. (In the future, this modification should be managed by the compiler.)
   - Start the dev server in this package with `yarn serve` in Terminal.
   - Run `HelloMyStateBag` on your device with `Cmd + R` in Xcode.

### Creating a demo adapter project for iOS

The following instructions should be suitable for creating a similar project from scratch. These steps should ultimately be automated by the compiler link phase.
 - Create a new project in Xcode (`New` > `Project` or `Cmd + Shift + N`). Choose an Application template such as `Single View App`, name your product, and proceed.
 - Link the Diez package.
   - Locate the `Diez.framework` you built in Finder.
   - Drag it into the project explorer on the left side of `Xcode`. **Uncheck** `Copy items if needed` if it's checked. Use the options to `Create folder references` and add it to your project's main target.
   - Select your project at the top of the project explorer. Navigate to `Build Phases`, then the plus button in the top left to create a `New Copy Files Phase`. In your new Copy Files phase, select the `Frameworks` destination, then use the plus button to select `Diez.framework`. You should now have a _dynamic framework_ linked.
   - Finally, Go to `Build Settings`, ensure you have `All` selected in the top left, search for `Framework Search Paths`, double-click the blank space to the right, add `/path/to/diez/packages/compiler/playground/ios/Diez` with the plus button, and press Return.
 - Modify the application security settings so that you can load local URLs in the simulator.
   - Choose `Info.plist` in the project navigator beneath your _app_'s build target.
   - Right-click to add a row for `App Transport Security Settings`.
   - Add a key for `NSAllowsLocalNetworking` set to `YES`.
 - Navigate to `Main.storyboard`, then create a label by selecting the circled square button in the top right, searching for `Label`, and instantiating it.
 - Create an outlet for your label. Enter parallel view (Venn diagram circles in the top right), right-click your label on the storyboard, then drag from the plus button beneath referencing outlets into the class definition of your `ViewController.swift`. Name your outlet `label`, keeping other defaults.
   - Confirm everything worked and you can now programatically modify your label by adding the following to `viewDidLoad()`:
    ```swift
    label.text = "Foobar"
    label.sizeToFit()
    label.textAlignment = .center
    label.center = view.center
    ```
   - Run your project in a Simulator and see your handiwork!
 - You can now attach to Diez and see everything work together!
   - Replace the contents of `ViewController.swift` with the contents of [playground/ios/HelloMyStateBag/HelloMyStateBag/ViewController.swift](playground/ios/HelloMyStateBag/HelloMyStateBag/ViewController.swift).
   - Start the dev server in this package with `yarn serve`.
   - Start the app with `Cmd + R`.
   - Tap the simulator, and watch the state updates resolve in real time.
   - Without mutating the state interface of `MyStateBag.ts`, make changes to defaults in `MyStateBag.ts`, the `tap()` method, and so on—with the dev server running, changes should live reload. :tada:

### Running the demo adapter project for Android (macOS)

 - Run the `HelloMyStateBag` project.
   - Open the Android Studio project at [playground/android/HelloMyStateBag](playground/android/HelloMyStateBag).
   - Start the dev server in this package with `yarn serve` in Terminal.
   - Run `HelloMyStateBag` in an available simulator with `Ctrl + R` in Android Studio. Note that the `settings.xml` in the `Diez` module is preconfigured for AVD emulators, which simulate localhost URLs at the IP `10.0.2.2`. If you are using a different emulator, you may need to use a different URL.
 - To run on a device:
   - Make sure your device is on the same Wifi network as your development machine, and note your LAN IP.
   - **In the Diez module**, modify `settings.xml` to set `server_url` to your LAN IP at port 8081, e.g. `http://192.168.1.2:8081`.
   - Start the dev server in this package with `yarn serve` in Terminal.
   - Run `HelloMyStateBag` on your device with `Ctrl + R` in Android Studio.

### Creating a demo adapter project for Android

The following instructions should be suitable for creating a similar project from scratch. These steps should ultimately be automated by the compiler link phase.
 - Create a new project in Android (`New` > `New Project`). Choose an Application template with an activity such as `Empty Activity`, name your product, choose minimum API level 28 and language Kotlin, then proceed.
 - Symlink the `diez` module in `settings.gradle`. You can do this by modifying `settings.gradle` to contain:
   ```groovy
   include ':app', ':diez'
   project(':diez').projectDir = '/path/to/diez'
   ```
 - Link `diez` in your app's `build.gradle`:
   ```groovy
   dependencies {
     // ...
     implementation project(':diez')
   }
   ```
 - Enable internet traffic and cleartext serving in `AndroidManifest.xml`:
   - Add `<uses-permission android:name="android.permission.INTERNET"/>` above the `<application />` tag.
   - Set the attribute `android:usesCleartextTraffic="true"` on the `<application />` tag.
 - Set the ID "text" on the "Hello World!" `TextView` in `activity_main.xml`, and the ID "layout" on the `ConstraintLayout` in the same file. https://cl.ly/2667db7f7fec
 - You can now attach to Diez and see everything work together!
   - Replace the contents of `MainActivity.kt` with the contents of [HelloMyStateBag/app/src/main/java/ai/haiku/hellomystatebag/MainActivity.kt](HelloMyStateBag/app/src/main/java/ai/haiku/hellomystatebag/MainActivity.kt).
   - Start the dev server in this package with `yarn serve`.
   - Start the app with `Ctrl + R`.
