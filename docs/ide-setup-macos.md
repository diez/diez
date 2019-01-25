# IDE setup (macOS)

**Note: the following instructions are for macOS _only_**

## iOS

1. Download the latest version of Xcode from the App Store.
2. Open it, open Preferences from the Xcode menu, scroll over to the Components tab and download at least one Simulator image.

![screen shot 2019-01-30 at 09 55 47](https://user-images.githubusercontent.com/4419992/51982742-9751ba00-2475-11e9-86b5-f0ca7dffbb7a.jpg)

> tip: the download process may take a while and be unstable if you don't have a good connection.
If it keeps failing, you can try to [manually install the Simulator image][1].

3. Confirm it worked by running the Simulator once: from the Xcode menu: `Open Developer Tool > Simulator`. First open will take a while as additional components are installed.
4. Make a new project with `Cmd + Shift + N`, choose `Single View App`. Fill any fields with dummy data, it's not important.

<img width="731" alt="image" src="https://user-images.githubusercontent.com/4419992/51982877-f4e60680-2475-11e9-9e7f-791288405efa.png">

5. Confirm you can build and run the app with your simulator targeted in the top left (shortcut: `Cmd + Shift + R`). You will see a blank screen on the Simulator, this is normal as the test app doesn't have any content.

![screen shot 2019-01-30 at 10 02 10](https://user-images.githubusercontent.com/4419992/51982933-24950e80-2476-11e9-8634-39481abc95dd.jpg)


## Android

1. Install the latest Android Studio from https://developer.android.com/studio/
2. Open it, and select `Tools > AVD Manager` from the top menu. If you don't see this menu, click on the AVD Manager icon on the top right bar:

![image](https://user-images.githubusercontent.com/4419992/51983124-a7b66480-2476-11e9-9738-7c8a1e5aa060.png)

3. Click `Create Virtual Device`, then follow the prompts to set up a device running the Pie (API Level 28) or higher system image.
4. Once you have a virtual device, you can start it from AVD Manager by clicking the green play button on the right.

![screen shot 2019-01-30 at 10 08 34](https://user-images.githubusercontent.com/4419992/51983298-13003680-2477-11e9-841a-1b1f2f599c2d.jpg)

5. Make a new Project from `File > New Project`, choose the `Basic Activity` template, then go through prompts placing your project code somewhere in your home directory, selecting minimum API level 28 and the Kotlin language, and open project

![2019-01-30 10 11 55](https://user-images.githubusercontent.com/4419992/51983509-9588f600-2477-11e9-850e-20fda637037c.gif)

6. Ensure initial Gradle sync is successful. An `app` configuration should be created by default; run it with the play button in the top right (shortcut: `Ctrl + R`). You will initially be missing a ton of SDKs/etc. (Android Studio doesn’t ship with any SDKs), but prompts in the bottom of the interface should tell you what you need to install. You may need to restart a few times—just keep following instructions until it builds and runs in the emulator.

[1]: https://hackernoon.com/manually-install-ios-simulators-in-xcode-f7e4bbe50753
