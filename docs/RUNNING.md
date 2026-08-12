# 开发环境与本地运行

## 最低工具链

- Node.js 22.13+（当前工程已验证 22.18）。
- Xcode 26、iOS Simulator、CocoaPods 1.17。
- JDK 17。
- Android Studio、SDK Platform 37、Build Tools 37、Platform Tools 和 Emulator。
- Watchman。

首次检查：

```bash
node --version
java -version
watchman --version
adb version
xcodebuild -version
pod --version
npx @react-native-community/cli@latest doctor
```

## 安装依赖

```bash
cd /Users/dujiang/Desktop/bps/react-native
npm ci
cd ios
bundle install
bundle exec pod install
cd ..
```

## iOS Simulator

```bash
open -a Simulator
xcrun simctl list devices available
npm run ios -- --simulator "iPhone 17 Pro"
```

若 Metro 已运行，在另一个终端执行：

```bash
npm start
npm run ios
```

## Android Emulator

确保 PATH 包含：

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin"
```

启动：

```bash
emulator -avd Medium_Phone_API_36.1
adb devices
npm run android
```

## 真机

iOS 需要在 Xcode 中选择 Team、设置唯一 Bundle ID 并信任开发者证书。Android 开启开发者选项和 USB 调试后，用 `adb devices` 验证授权。

## 常见问题

- Metro 缓存：`npm start -- --reset-cache`。
- iOS Pod 不一致：`cd ios && bundle exec pod install --repo-update`。
- Android 找不到 SDK：检查 `ANDROID_HOME` 和 `android/local.properties`。
- Gradle 使用错误 Java：确保 `java -version` 和 `JAVA_HOME` 都指向 JDK 17。
- Watchman 动态库错误：`brew reinstall boost watchman`。

